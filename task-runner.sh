#!/bin/bash

TASK_DIR="$(pwd)/tasks"
OUTPUT_DIR="${OUTPUT_DIR:-$(pwd)/logs}"
AGENT_WORKDIR="${AGENT_WORKDIR:-$HOME}"
MODEL="${MODEL:-deepseek-coder:6.7b}"
MODEL_TYPE="${MODEL_TYPE:-local}"
MAX_SECONDS="${MAX_SECONDS:-1800}"

mkdir -p "$TASK_DIR" "$OUTPUT_DIR" "$AGENT_WORKDIR"

TASK_DIR_REAL=$(realpath "$TASK_DIR")
OUTPUT_DIR_REAL=$(realpath "$OUTPUT_DIR")
AGENT_WORKDIR_REAL=$(realpath "$AGENT_WORKDIR")

echo "[runner] Task directory: $TASK_DIR_REAL"
echo "[runner] Output directory: $OUTPUT_DIR_REAL" 
echo "[runner] Agent workspace: $AGENT_WORKDIR_REAL"
echo "[runner] Model: $MODEL ($MODEL_TYPE)"

if ! command -v aider >/dev/null 2>&1; then
  echo "[runner] Aider not found. Please install with: pip install aider-chat"
  exit 1
fi

if command -v inotifywait >/dev/null 2>&1; then
  echo "[runner] Using inotify mode"
  WATCH_MODE="inotify"
else
  echo "[runner] inotifywait not found, using poll mode"
  WATCH_MODE="poll"
fi

echo "[runner] Watching for new tasks..."

if [ "$WATCH_MODE" = "inotify" ]; then
  inotifywait -m -e close_write,create,moved_to --format "%f" "$TASK_DIR_REAL" | while read FILE; do
    [ "${FILE##*.}" = "task" ] || continue
    
    TASK_NAME="${FILE%.*}"
    TASK_FILE="$TASK_DIR_REAL/$FILE"
    STATUS_FILE="$OUTPUT_DIR_REAL/${TASK_NAME}_status.txt"
    FULL_FILE="$OUTPUT_DIR_REAL/${TASK_NAME}_full.txt"
    SUMMARY_FILE="$OUTPUT_DIR_REAL/${TASK_NAME}_summary.txt"
    
    [ -f "$STATUS_FILE" ] && continue
    
    LOCK_FILE="$OUTPUT_DIR_REAL/${TASK_NAME}.lock"
    if [ -f "$LOCK_FILE" ]; then
      echo "[runner] Task $TASK_NAME already being processed (lock exists)"
      continue
    fi
    
    echo "[runner] Processing task: $TASK_NAME"
    
    echo $$ > "$LOCK_FILE"
    echo "Active" > "$STATUS_FILE"
    
    (
      TASK_WD=$(sed -n 's/^# WORKDIR=//p' "$TASK_FILE" | head -n1)
      RUNTIME_DIR="${TASK_WD:-$AGENT_WORKDIR_REAL}"
      
      echo "[task:$TASK_NAME] Using WORKDIR: $RUNTIME_DIR" | tee -a "$FULL_FILE"
      # Event: LLM_START (before launching aider)
      echo "$(date +%s)|LLM_START|$AIDER_MODEL" >> "$OUTPUT_DIR_REAL/${TASK_NAME}.events"
      
      cd "$RUNTIME_DIR" || {
        echo "Failed" > "$STATUS_FILE"
        echo "Invalid WORKDIR: $RUNTIME_DIR" > "$FULL_FILE"
        exit 1
      }
      
      BEFORE_FILES="$OUTPUT_DIR_REAL/${TASK_NAME}.files.before"
      find "$RUNTIME_DIR" -type f > "$BEFORE_FILES" 2>/dev/null
      
      FILES_LINE=$(sed -n 's/^# FILES=//p' "$TASK_FILE" | head -n1)
      MODEL_LINE=$(sed -n 's/^# MODEL=//p' "$TASK_FILE" | head -n1)

      AIDER_FILES_ARGS=()
      if [ -n "$FILES_LINE" ]; then
        IFS=',' read -ra FILE_ITEMS <<< "$FILES_LINE"
        for f in "${FILE_ITEMS[@]}"; do
          f_trimmed="$(echo "$f" | xargs)"
          [ -n "$f_trimmed" ] && AIDER_FILES_ARGS+=("$f_trimmed")
        done
      fi

      if [ -n "$MODEL_LINE" ]; then
        MODEL="$MODEL_LINE"
      fi
      if [ "$MODEL_TYPE" = "local" ]; then
        AIDER_MODEL="ollama/$MODEL"
      else
        AIDER_MODEL="$MODEL"
      fi
      
      echo "[task:$TASK_NAME] Launching Aider with model $AIDER_MODEL" | tee -a "$FULL_FILE"
        
      AIDER_HISTORY_FILE="$OUTPUT_DIR_REAL/${TASK_NAME}_aider_history.txt"
      AIDER_INPUT_FILE="$OUTPUT_DIR_REAL/${TASK_NAME}_aider_input.txt"
      
      TASK_CONTENT=$(cat "$TASK_FILE")
      ENHANCED_TASK="$TASK_CONTENT

EXECUTE IMMEDIATELY: Create/edit the actual files. No explanations, tutorials, or code examples."
      
      timeout "${MAX_SECONDS}s" aider \
        --model "$AIDER_MODEL" \
        --no-git \
        --yes \
        --auto-commits \
        --no-show-model-warnings \
        --no-stream \
        --no-pretty \
        --input-history-file "$AIDER_INPUT_FILE" \
        --chat-history-file "$AIDER_HISTORY_FILE" \
        "${AIDER_FILES_ARGS[@]}" \
        --message "$ENHANCED_TASK" >> "$FULL_FILE" 2>&1
      RC=$?
      # Event: LLM_END (after aider returns)
      echo "$(date +%s)|LLM_END|rc=$RC" >> "$OUTPUT_DIR_REAL/${TASK_NAME}.events"
      
      AFTER_FILES="$OUTPUT_DIR_REAL/${TASK_NAME}.files.after"
      NEW_FILES="$OUTPUT_DIR_REAL/${TASK_NAME}.files.new"
      MODIFIED_FILES="$OUTPUT_DIR_REAL/${TASK_NAME}.files.modified"
      
      find "$RUNTIME_DIR" -type f > "$AFTER_FILES" 2>/dev/null
      
      if [ -f "$BEFORE_FILES" ]; then
        comm -23 <(sort "$AFTER_FILES") <(sort "$BEFORE_FILES") > "$NEW_FILES"
        comm -12 <(sort "$AFTER_FILES") <(sort "$BEFORE_FILES") > "$MODIFIED_FILES"
      else
        cp "$AFTER_FILES" "$NEW_FILES"
        touch "$MODIFIED_FILES"
      fi
      
      NEW_COUNT=$(wc -l < "$NEW_FILES" 2>/dev/null || echo 0)
      MOD_COUNT=$(wc -l < "$MODIFIED_FILES" 2>/dev/null || echo 0)
      echo "[task:$TASK_NAME] New files count: $NEW_COUNT" | tee -a "$FULL_FILE"
      echo "[task:$TASK_NAME] Modified files count: $MOD_COUNT" | tee -a "$FULL_FILE"

      # Log individual file names to console/log and timeline events
      if [ -s "$NEW_FILES" ]; then
        while IFS= read -r nf; do
          [ -n "$nf" ] || continue
          rel_nf=${nf#"$RUNTIME_DIR"/}
          echo "[task:$TASK_NAME] NEW: $rel_nf" | tee -a "$FULL_FILE"
          echo "$(date +%s)|FILE_NEW|$rel_nf" >> "$OUTPUT_DIR_REAL/${TASK_NAME}.events"
        done < "$NEW_FILES"
      fi
      if [ -s "$MODIFIED_FILES" ]; then
        while IFS= read -r mf; do
          [ -n "$mf" ] || continue
          rel_mf=${mf#"$RUNTIME_DIR"/}
          echo "[task:$TASK_NAME] MOD: $rel_mf" | tee -a "$FULL_FILE"
          echo "$(date +%s)|FILE_MOD|$rel_mf" >> "$OUTPUT_DIR_REAL/${TASK_NAME}.events"
        done < "$MODIFIED_FILES"
      fi
      
      if [ $RC -eq 0 ]; then
        echo "Completed" > "$STATUS_FILE"
      elif [ $RC -eq 124 ] || [ $RC -eq 137 ]; then
        echo "Failed" > "$STATUS_FILE"
        echo "Task timed out after ${MAX_SECONDS}s" >> "$FULL_FILE"
      else
        echo "Failed" > "$STATUS_FILE"
        echo "Task failed with exit code: $RC" >> "$FULL_FILE"
      fi
      # Event: FILES_DONE after status written
      echo "$(date +%s)|FILES_DONE|new=$(wc -l < "$NEW_FILES" 2>/dev/null || echo 0),mod=$(wc -l < "$MODIFIED_FILES" 2>/dev/null || echo 0)" >> "$OUTPUT_DIR_REAL/${TASK_NAME}.events"
      
      rm -f "$LOCK_FILE"
      
      if grep -q "**SUMMARY**" "$FULL_FILE"; then
        awk '/\*\*SUMMARY\*\*/{flag=1; next} /^\*\*/{flag=0} flag' "$FULL_FILE" > "$SUMMARY_FILE"
      else
        echo "- Task completed using Aider" > "$SUMMARY_FILE"
        echo "- Working directory: $RUNTIME_DIR" >> "$SUMMARY_FILE"
        if [ -f "$NEW_FILES" ] && [ -s "$NEW_FILES" ]; then
          echo "- New files created:" >> "$SUMMARY_FILE"
          while IFS= read -r file; do
            echo "  - $(basename "$file")" >> "$SUMMARY_FILE"
          done < "$NEW_FILES"
        fi
        if [ -f "$MODIFIED_FILES" ] && [ -s "$MODIFIED_FILES" ]; then
          echo "- Files modified:" >> "$SUMMARY_FILE"
          while IFS= read -r file; do
            echo "  - $(basename "$file")" >> "$SUMMARY_FILE"
          done < "$MODIFIED_FILES"
        fi
      fi
      
    ) &
  done
else
  while true; do
    for TASK_FILE in "$TASK_DIR_REAL"/*.task; do
      [ -e "$TASK_FILE" ] || { sleep 2; continue; }
      
      TASK_NAME=$(basename "$TASK_FILE" .task)
      STATUS_FILE="$OUTPUT_DIR_REAL/${TASK_NAME}_status.txt"
      
      [ -f "$STATUS_FILE" ] && continue
      
      LOCK_FILE="$OUTPUT_DIR_REAL/${TASK_NAME}.lock"
      if [ -f "$LOCK_FILE" ]; then
        echo "[runner] Task $TASK_NAME already being processed (lock exists)"
        continue
      fi
      
      FULL_FILE="$OUTPUT_DIR_REAL/${TASK_NAME}_full.txt"
      SUMMARY_FILE="$OUTPUT_DIR_REAL/${TASK_NAME}_summary.txt"
      
      echo "[runner] Processing task: $TASK_NAME"
      
      echo $$ > "$LOCK_FILE"
      echo "Active" > "$STATUS_FILE"
      
      (
        TASK_WD=$(sed -n 's/^# WORKDIR=//p' "$TASK_FILE" | head -n1)
        RUNTIME_DIR="${TASK_WD:-$AGENT_WORKDIR_REAL}"
        
        echo "[task:$TASK_NAME] Using WORKDIR: $RUNTIME_DIR" | tee -a "$FULL_FILE"
        
        cd "$RUNTIME_DIR" || {
          echo "Failed" > "$STATUS_FILE"
          echo "Invalid WORKDIR: $RUNTIME_DIR" > "$FULL_FILE"
          exit 1
        }
        
        if [ "$MODEL_TYPE" = "local" ]; then
          AIDER_MODEL="ollama/$MODEL"
        else
          AIDER_MODEL="$MODEL"
        fi
        
        echo "[task:$TASK_NAME] Launching Aider with model $AIDER_MODEL" | tee -a "$FULL_FILE"
        
        AIDER_HISTORY_FILE="$OUTPUT_DIR_REAL/${TASK_NAME}_aider_history.txt"
        AIDER_INPUT_FILE="$OUTPUT_DIR_REAL/${TASK_NAME}_aider_input.txt"
        
        TASK_CONTENT=$(cat "$TASK_FILE")
        ENHANCED_TASK="$TASK_CONTENT

EXECUTE IMMEDIATELY: Create/edit the actual files. No explanations, tutorials, or code examples."
        
        timeout "${MAX_SECONDS}s" aider \
          --model "$AIDER_MODEL" \
          --no-git \
          --yes \
          --auto-commits \
          --no-show-model-warnings \
          --no-stream \
          --no-pretty \
          --input-history-file "$AIDER_INPUT_FILE" \
          --chat-history-file "$AIDER_HISTORY_FILE" \
          --message "$ENHANCED_TASK" >> "$FULL_FILE" 2>&1
        RC=$?
        
        if [ $RC -eq 0 ]; then
          echo "Completed" > "$STATUS_FILE"
        elif [ $RC -eq 124 ] || [ $RC -eq 137 ]; then
          echo "Failed" > "$STATUS_FILE"
          echo "Task timed out after ${MAX_SECONDS}s" >> "$FULL_FILE"
        else
          echo "Failed" > "$STATUS_FILE"
          echo "Task failed with exit code: $RC" >> "$FULL_FILE"
        fi
        
        rm -f "$LOCK_FILE"
        
        if grep -q "**SUMMARY**" "$FULL_FILE"; then
          awk '/\*\*SUMMARY\*\*/{flag=1; next} /^\*\*/{flag=0} flag' "$FULL_FILE" > "$SUMMARY_FILE"
        else
          echo "- Task completed using Aider" > "$SUMMARY_FILE"
          echo "- Working directory: $RUNTIME_DIR" >> "$SUMMARY_FILE"
        fi
        
      ) &
    done
    sleep 2
  done
fi
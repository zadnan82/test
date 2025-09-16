# SEVDO Platform - Multi-stage Docker Build
# Stage 1: Builder - Install dependencies and build
FROM python:3.11-slim AS builder

# Optimization environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies for building
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Create application directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Production - Minimal runtime image
FROM python:3.11-slim AS production

# Security and optimization environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random

# Install runtime system dependencies including task runner needs
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    inotify-tools \
    coreutils \
    git \
    bash \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge -y --auto-remove

# Create non-root user for security (MUST be done before chown)
RUN useradd --create-home --shell /bin/bash --uid 1001 --user-group sevdo

# Copy installed packages from builder stage
COPY --from=builder /usr/local/lib/python3.11/site-packages/ /usr/local/lib/python3.11/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/

# Set working directory and create directories as root
WORKDIR /app
RUN mkdir -p /app/tasks /app/logs /app/playground/input_files /app/playground/output_files /app/playground/templates

# Copy application code
COPY . .

# Make task runner script executable and change ownership (must be done as root)

RUN chmod +x task-runner.sh && \

    chown -R sevdo:sevdo /app

# Switch to non-root user (LAST step)
USER sevdo

# Default health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Default command (can be overridden by docker-compose)
CMD ["python", "dashboard.py"]
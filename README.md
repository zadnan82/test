# SEVDO Platform - Docker Setup

## Quick Start

1. **Start Docker Desktop** on Windows
2. **Enable WSL2 Integration** in Docker Desktop Settings → Resources → WSL Integration
3. **Run the platform:**

```bash
# Modern Docker Compose (recommended)
docker compose up --build

# OR Legacy docker-compose (if available)  
docker-compose up --build
```

## Services Access
** User-Backend: http://localhost:8000/docs **
** User-Frontend: http://localhost:5173/ **
** Dashboard: http://localhost:5000/ **

## Useful Commands
```bash
# Start in background
docker compose up -d --build

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f sevdo-task-runner

# Stop services
docker compose down

# Full reset (removes data)
docker compose down -v
```

## Local Ollama Configuration
This setup is configured to work with your local Ollama installation:
- Model: `deepseek-coder:6.7b`
- Ollama Host: `http://host.docker.internal:11434`

Make sure Ollama is running locally before starting the platform.

## Team Development Setup

### Prerequisites
- Docker Desktop with WSL2 integration enabled
- Git configured with SSH keys
- Local Ollama installation with `deepseek-coder:6.7b` model

### First Time Setup
```bash
# Clone repository
git clone <repository-url>
cd sevdo2

# Create environment file (copy from example)
cp .env.example .env

# Edit .env with your configuration
# OPENAI_API_KEY=your-key-here
# AIDER_MODEL=deepseek-coder:6.7b
# OLLAMA_HOST=http://host.docker.internal:11434

# Build and start platform
docker compose up --build
```

### Development Workflow
1. **Make changes** to your code
2. **Restart specific service:**
   ```bash
   docker compose restart sevdo-backend
   ```
3. **View logs:**
   ```bash
   docker compose logs -f sevdo-backend
   ```
4. **Test your changes** via the dashboard or API
5. **Commit and push** to GitHub

## Dependencies Management

SEVDO uses a simplified 2-file requirements approach:

### For Basic SEVDO Development  
```bash
# Core dependencies (FastAPI, Flask, database, etc.)
pip install -r requirements.txt
```

### For RAG/AI Development (Optional)
```bash  
# Install core dependencies first
pip install -r requirements.txt

# Then add heavy ML dependencies (~2GB)
pip install -r requirements-rag.txt
```

### Docker (Recommended)
```bash
# Docker container includes all dependencies
docker compose up --build
```

**File Structure:**
- `requirements.txt` - All core SEVDO functionality (install by default)
- `requirements-rag.txt` - PyTorch, sentence-transformers, ML packages (optional)

**Note:** RAG features require ~2GB additional dependencies. Use Docker for full functionality or install selectively based on your development needs.

### Project Structure
```
sevdo2/
├── Dockerfile              # Multi-stage container build
├── docker-compose.yml      # Service orchestration
├── dashboard.py           # Flask task dashboard
├── task-runner-aider.sh   # AI task processor
├── sevdo_backend/         # DSL compiler API
├── sevdo_frontend/        # Frontend transpiler
├── user_backend/          # User management API
└── requirements.txt       # Python dependencies
```

### Environment Variables
- `OPENAI_API_KEY`: For OpenAI models
- `AIDER_MODEL`: AI model for task processing 
- `OLLAMA_HOST`: Local Ollama server URL
- `SEVDO_ENV`: Environment (development/production)

### Troubleshooting
- **Docker permission errors:** Restart Docker Desktop, enable WSL2 integration
- **Port conflicts:** Ensure ports 5000, 6379, 5432, 8000, 8001 are free
- **Ollama connection issues:** Verify `http://localhost:11434` is accessible

### CI/CD Pipeline
The project includes GitHub Actions that automatically:
- Test Python code quality
- Validate Docker configuration
- Run component integration tests
- Build and verify Docker images

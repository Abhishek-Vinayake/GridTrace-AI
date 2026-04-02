# GridTrace AI

LLM-powered system that simulates program execution and generates structured traces for visualization of arrays, variables, and control flow.

Visualize C++ array and grid execution step-by-step using AI-generated traces.

---

## Overview

GridTrace AI simulates execution of C++ programs (focused on arrays and grids) and generates a structured, step-by-step trace including:

- Variable changes  
- Memory state transitions  
- Control flow progression  
- Crash detection  

---

## Important Note

This project uses LLM APIs for execution tracing.

- Requires an API key (Groq in current setup)  
- Responses are non-deterministic  
- Latency depends on request size  

---

## Prerequisites

- Python 3.11+  
- Node.js 18+  
- PostgreSQL 15+  
- Groq API Key  

---

## Database Setup

```bash
psql -U postgres -c "CREATE DATABASE gridtrace;"
```

---

## Backend Setup

```bash
cd backend

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

# configure .env file

uvicorn app.main:app --reload --reload-dir app
```

---

## Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

---

## Run Application

Open in browser:

http://localhost:5173

---

## Environment Configuration (.env)

```env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/gridtrace

GROQ_API_KEY=your_api_key
GROQ_MODEL=llama-3.3-70b-versatile

GROQ_TIMEOUT=30
GROQ_MAX_RETRIES=3

FRONTEND_URL=http://localhost:5173
```

---

## How It Works

1. User inputs C++ code  
2. Backend constructs a structured prompt  
3. LLM simulates execution as a virtual CPU  
4. Response returned as structured JSON  
5. Frontend visualizes execution step-by-step  

---

## Features

- Step-by-step execution playback  
- Variable tracking  
- Array and grid visualization  
- Crash detection  
- Execution history (PostgreSQL)  

---

## Tech Stack

| Layer    | Technology                               |
|----------|------------------------------------------|
| Frontend | React, Vite, Tailwind, Framer Motion     |
| Backend  | FastAPI, SQLAlchemy (async)              |
| Database | PostgreSQL (JSONB)                       |
| AI       | Groq API (LLaMA models)                  |

---

## Project Structure

```
GridTrace/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── prompts/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── config.py
│   │   ├── database.py
│   │   └── main.py
│   ├── .env
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── types/
│   │   └── App.tsx
```


## Limitations

- LLM output may be inconsistent  
- Complex C++ features not fully supported  
- Requires internet connectivity  
- Non-deterministic outputs  

---

## Future Improvements

- Deterministic execution engine  
- Support for more data structures  
- Improved crash reasoning  
- Offline mode using local models  

---

## Author

Abhishek

---

## Summary

- AI-assisted program execution  
- Algorithm visualization system  
- Practical LLM integration project  

# 🤖 Agentic RAG Chatbot

An AI-powered Agentic Retrieval-Augmented Generation (RAG) chatbot that combines LLM reasoning, document retrieval, and tool-based workflows to provide context-aware and accurate responses.

## 🚀 Overview

Agentic RAG Chatbot is designed to go beyond traditional chat applications by integrating:

* Retrieval-Augmented Generation (RAG)
* Agent-based decision making
* GitHub repository knowledge retrieval
* Web search capabilities
* Multi-step reasoning workflows
* Context-aware conversations

The system allows users to interact with an intelligent chatbot that can retrieve information from external knowledge sources, reason over the retrieved context, and generate grounded responses.

---

## ✨ Features

### 🧠 Agentic Workflow

* Uses an agent-based architecture for intelligent tool selection.
* Decides when to retrieve information and when to respond directly.
* Supports multi-step reasoning and tool execution.

### 📚 RAG Pipeline

* Semantic document retrieval.
* Context injection before response generation.
* Improved factual accuracy and reduced hallucinations.

### 🐙 GitHub Repository RAG

* Query GitHub repositories.
* Retrieve relevant code snippets and project documentation.
* Answer repository-specific questions.

### 🌐 Web Search Integration

* Fetches external information when local knowledge is insufficient.
* Enhances response quality using real-time data.

### 💬 Conversational Memory

* Maintains chat context across interactions.
* Supports follow-up questions.

### ⚡ Streaming Responses

* Real-time token streaming for a better user experience.

---

## 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │        User          │
                         └──────────┬───────────┘
                                    │
                                    ▼
                    ┌────────────────────────────┐
                    │     Frontend (React)       │
                    │  Vite • Tailwind • Axios   │
                    └──────────┬─────────────────┘
                               │ HTTP/WebSocket
                               ▼
                 ┌────────────────────────────────┐
                 │ Backend API (Node.js/Express) │
                 │ Authentication • Routing •    │
                 │ Session/Cookie Management     │
                 └──────────┬────────────────────┘
                            │ API Calls
                            ▼
              ┌───────────────────────────────────┐
              │ AI Service (FastAPI + Pydantic)  │
              │ Request Validation • Streaming   │
              │ AI Orchestration Layer           │
              └──────────┬────────────────────────┘
                         │
                         ▼
      ┌─────────────────────────────────────────────────┐
      │      Agent Orchestration Layer                 │
      │                                                 │
      │  LangGraph • LangChain • LangSmith             │
      │                                                 │
      │  ┌──────────────────────────────────────────┐   │
      │  │              LLM Reasoning              │   │
      │  └──────────────────────────────────────────┘   │
      │                                                 │
      │  ┌──────────────────────────────────────────┐   │
      │  │            Tool Execution               │   │
      │  │                                          │   │
      │  │  • GitHub RAG Tool                      │   │
      │  │  • Web Search Tool                      │   │
      │  │  • Retrieval Pipeline                   │   │
      │  └──────────────────────────────────────────┘   │
      └──────────┬──────────────────────────────────────┘
                 │
                 ▼
      ┌─────────────────────────────────────────────┐
      │     Vector Database / Knowledge Base        │
      │                                             │
      │ Embeddings • Chunked Docs • Repo Data       │
      └──────────┬──────────────────────────────────┘
                 │ Retrieved Context
                 ▼
      ┌─────────────────────────────────────────────┐
      │            Large Language Model             │
      │         Context-Aware Response Generation   │
      └──────────┬──────────────────────────────────┘
                 │
                 ▼
      ┌─────────────────────────────────────────────┐
      │        Streaming AI Response to User        │
      └─────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Redux
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB

### AI / Agent Layer

* LangGraph
* LangChain
* Large Language Models (LLMs)
* FastAPI
* MongoDB/Atlas
* PostgreSQL/Neon

### Retrieval

* Vector Database
* Embeddings
* RAG Pipeline

### Deployment

* AWS EC2
* Docker
* Render
* Vercel

---

## 📂 Project Structure

```text
Present in filestructure.txt file.
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/DanishIslam10/agentic-rag-chatbot.git
cd agentic-rag-chatbot
```

### 2. Install Dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd server
npm install
```

#### AI-Service
```bash
cd ai-service
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file and add the required environment variables.

Example: For Frontend (client)

```env
VITE_SERVER_ENDPOINT=your-server-endpoint
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
```

Example: For Backend (server)

```env
PORT=
MONGODB_URL=
OPENAI_API_KEY=
JWT_SECRET=
AI_SERVICE_URL=
CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=
```

Example: For AI Service (ai-service)

```env
OPENAI_API_KEY=
DB_URI=
LANGSMITH_TRACING=
LANGSMITH_ENDPOINT=
LANGSMITH_API_KEY=
LANGSMITH_PROJECT=
MONGODB_URI=
MONGODB_NAME=
```

### 4. Start the Application

#### AI-Service

```bash
cd ai-service
uvicorn app.main:app --reload
```

#### Backend

```bash
cd server
npm run dev
```

#### Frontend

```bash
cd client
npm run dev
```

---

## 🔄 Workflow

1. User submits a query.
2. Agent analyzes the request.
3. Relevant tools are selected.
4. Retrieval pipeline gathers context.
5. LLM reasons over retrieved information.
6. Final grounded response is generated.
7. Response is streamed back to the user.

---

## 🚧 Future Improvements

* Multi-agent collaboration.
* Additional MCP integrations.
* Better memory management.
* Advanced document ingestion.
* Multiple vector database support.

---

## 👨‍💻 Author

**Danish Islam**

GitHub: [https://github.com/DanishIslam10](https://github.com/DanishIslam10)

If you found this project useful, consider giving it a ⭐ on GitHub.

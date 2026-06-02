# 🤖 Aurora — Agentic RAG Chatbot

A production-grade, full-stack AI chatbot that goes beyond simple Q&A. Aurora combines a **stateful LangGraph agent**, **GitHub repository RAG**, **web search**, **SSE streaming**, and **multi-session persistent memory** — deployed as Dockerized microservices across AWS EC2, Render, and Vercel.

> **Live:** https://aurora-ai-assistant-ivory.vercel.app/ &nbsp;|&nbsp; **GitHub:** [https://github.com/DanishIslam10](https://github.com/DanishIslam10)

---

## What makes this different from a basic chatbot

Most chatbot tutorials wrap an LLM in a simple prompt loop. Aurora is architecturally different:

- The **LangGraph agent** decides *whether* to answer directly, *or* trigger GitHub RAG, *or* invoke web search — based on intent classification at runtime.
- The **GitHub RAG pipeline** clones any repo on-demand, chunks and embeds it into ChromaDB with `repo_hash` isolation, then uses a **Contextual Compression Retriever** (not a basic similarity search) for higher answer precision.
- **PostgreSQL checkpointing** via `AsyncPostgresSaver` gives the agent true persistent multi-session memory — conversations survive server restarts.
- **SSE streaming** runs end-to-end: FastAPI `astream_events` → Express proxy → React `ReadableStream` with Redux state updates, so the user sees tokens as they generate.
- **7 LangSmith-instrumented pipeline stages** give full observability into every retrieval and generation step.

---

## 🏗️ System Architecture

<p align="center">
  <img 
    src="./client/src/assets/architecture.png" 
    alt="Aurora System Architecture"
    width="100%"
  />
</p>

Aurora follows a distributed microservice architecture:

- **Frontend (React + Redux)** → Handles UI and streaming updates
- **Express Backend** → Authentication, chat persistence, SSE proxy
- **FastAPI AI Service** → LangGraph orchestration, tools, RAG pipeline
- **ChromaDB** → Vector storage for repository embeddings
- **MongoDB** → Chats, messages, repository registry
- **PostgreSQL** → LangGraph persistent memory checkpoints
:::

---

## GitHub RAG Pipeline

```

User submits GitHub URL
        │
        ▼
┌──────────────────┐
│ normalize URL    │  strip trailing /, lowercase, remove .git
│ generate hash    │  SHA-256 of normalized URL → repo_hash
│ extract name     │  last path segment
└────────┬─────────┘
         │
         ▼
  Already indexed?  ──yes──▶  skip to retrieval
         │ no
         ▼
┌──────────────────┐
│ clone_repo()     │  git clone --depth=1 --single-branch
│                  │  remove: node_modules, dist, .git,
│                  │  __pycache__, .png, .pdf, .lock ...
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ add_repo_doc()   │  MongoDB: status = "pending"
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ load_repository()│  TextLoader for .py .js .ts .tsx .jsx
│                  │  .java .go .md .json .yaml .yml
│                  │  metadata: repo_path, repo_hash, repo_name
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ split_documents()│  RecursiveCharacterTextSplitter
│                  │  chunk_size=1000, overlap=200
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ create_vector_   │  OpenAI text-embedding-3-small
│ store()          │  ChromaDB with repo_hash filter isolation
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ update_doc()     │  MongoDB: status = "indexed"
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│              RETRIEVAL                   │
│                                          │
│  base_retriever → top-10 chunks          │
│  (filtered by repo_hash)                 │
│         ↓                                │
│  ContextualCompressionRetriever          │
│  (LLMChainExtractor with gpt-4o-mini)    │
│  → compressed, relevant excerpts only    │
│         ↓                                │
│  generate_answer() → final response      │
└──────────────────────────────────────────┘

```
---


## SSE Streaming Flow

```
User types message → sendMessageHandler()
        │
        ▼
POST /chat/save-message-doc         → save human message to MongoDB
        │
        ▼
Optimistic UI update                → add tempAiMessage to Redux (content: "")
        │
        ▼
fetch() POST /chat/message          → Express streaming endpoint
        │
        ▼  (SSE proxy)
fetch() POST /ai-service/chat-message → FastAPI
        │
        ▼
chatbot_workflow.astream_events()   → LangGraph token stream
        │
        ▼  on_chat_model_stream events
res.write(chunk)                    → Express pipes chunks to client
        │
        ▼
ReadableStream reader in browser    → decode chunks
        │
        ▼
dispatch(updateMessage)             → Redux updates message content live
        │
        ▼
Stream ends → save full AI message to MongoDB → dispatch(replaceMessage)
```

---

## Tech Stack

### Frontend (client — Vercel)

| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework |
| Redux Toolkit | Global state (messages, sessions, chat history) |
| Clerk | Authentication (sign in / sign up / session) |
| Tailwind CSS v4 | Styling |
| react-markdown + remark-gfm | Render AI responses with full markdown support |
| react-hot-toast | Notifications |
| Axios | HTTP requests to Express server |

### Backend — Express Server (AWS EC2 / Docker)

| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Persistent chat and message storage |
| Clerk Express middleware | `requireAuth()` route protection |
| SSE proxy | Streams AI service response to frontend |

### AI Service — FastAPI (Render / Docker)

| Technology | Purpose |
|---|---|
| FastAPI + uvicorn | Async AI microservice |
| LangGraph | Stateful agent with conditional tool routing |
| LangChain | Tool calling, prompt templates, chains |
| `AsyncPostgresSaver` | Persistent multi-session memory (pool max=20) |
| OpenAI `gpt-4o-mini` | LLM for agent, RAG generation, title generation |
| OpenAI `text-embedding-3-small` | Embeddings for ChromaDB |
| ChromaDB | Vector store with `repo_hash` namespace isolation |
| `ContextualCompressionRetriever` | LLM-powered chunk compression for precision retrieval |
| DuckDuckGoSearchRun | Real-time web search tool |
| LangSmith | Tracing for all 7 pipeline stages |
| Motor (AsyncIOMotorClient) | Async MongoDB driver for repo registry |
| GitPython | Async repo cloning via `asyncio.to_thread` |

---

## Project Structure

```
aurora-chatbot/
│
├── client/                          # React frontend (Vercel)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Auth.jsx             # Clerk sign in / sign up
│   │   │   └── Chat.jsx             # Main chat layout
│   │   ├── components/
│   │   │   ├── Sidebar.jsx          # Previous chats + new chat + logout
│   │   │   ├── ChatWindow.jsx       # Message list + auto-scroll
│   │   │   ├── MessageSender.jsx    # SSE streaming + Redux updates
│   │   │   ├── DisplayMessages.jsx  # Markdown rendering + streaming indicator
│   │   │   ├── PreviousChats.jsx    # Chat history with delete
│   │   │   └── ProtectedRoute.jsx   # Clerk-based route guard
│   │   ├── slices/
│   │   │   ├── messagesSlice.js     # Messages, streaming state, active session
│   │   │   └── previousChatsSlice.js
│   │   └── store/store.js
│   └── vercel.json                  # SPA rewrite rules
│
├── server/                          # Express backend (AWS EC2)
│   └── src/
│       ├── routes/
│       │   ├── auth.routes.js       # POST /auth/sync
│       │   └── chat.routes.js       # chat CRUD + SSE proxy
│       ├── controllers/
│       │   ├── auth.controller.js   # Clerk user sync → MongoDB
│       │   ├── chat.controller.js   # create/get/delete chats
│       │   └── message.controller.js # SSE proxy + message persistence
│       ├── services/
│       │   ├── chatbot.service.js   # fetch() stream from AI service
│       │   ├── chatTitle.service.js # LLM-generated chat titles
│       │   ├── chat.service.js      # MongoDB chat CRUD
│       │   └── message.service.js   # MongoDB message CRUD
│       └── models/
│           ├── User.js              # clerkId, name, email, chats[]
│           ├── Chat.js              # sessionId (= LangGraph thread_id), title
│           └── Message.js           # role (human/ai/system), content
│
└── ai-service/                      # FastAPI AI microservice (Render)
    └── app/
        ├── main.py                  # lifespan: open pool → build graph → yield
        ├── graph/
        │   └── chatbot.py           # LangGraph StateGraph + AsyncPostgresSaver
        ├── routes/
        │   └── chat.py              # SSE streaming + title endpoints
        ├── tools/
        │   ├── websearch_tool.py    # DuckDuckGoSearchRun
        │   └── github_rag/
        │       ├── github_rag_pipeline.py  # @tool entrypoint
        │       ├── ingestion/
        │       │   ├── ingestion.py        # pipeline orchestration
        │       │   ├── clone_repo.py       # git clone + cleanup
        │       │   ├── loader.py           # TextLoader + metadata injection
        │       │   ├── splitter.py         # RecursiveCharacterTextSplitter
        │       │   └── embedder.py         # ChromaDB + OpenAI embeddings
        │       └── retrieval/
        │           ├── retrieval.py        # pipeline orchestration
        │           ├── generation.py       # RAG answer generation chain
        │           └── retrievers/
        │               ├── base_retriever.py  # ChromaDB + repo_hash filter
        │               └── cc_retriever.py    # ContextualCompressionRetriever
        ├── services/
        │   ├── clone_repo.py        # async git clone + file cleanup
        │   ├── url.py               # normalize, hash, extract repo name
        │   └── mongo_ops.py         # repo registry CRUD (Motor async)
        ├── prompts/
        │   └── system_prompt.py     # agent system prompt with tool rules
        └── schema/                  # Pydantic request/response models
```

---

## Setup & Installation

### Prerequisites

- Node.js 20+
- Python 3.11+
- MongoDB Atlas account (or local MongoDB)
- PostgreSQL instance (Neon recommended)
- OpenAI API key
- Clerk account

### 1. Clone the repository

```bash
git clone https://github.com/DanishIslam10/agentic-rag-chatbot.git
cd agentic-rag-chatbot
```

### 2. Frontend

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_SERVER_ENDPOINT=http://localhost:5000/api/v1
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

```bash
npm run dev
```

### 3. Express Server

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGODB_URL=mongodb+srv://your_connection_string
CLIENT_URL=http://localhost:5173
AI_SERVICE_URL=http://localhost:8000/api/ai-service
CLERK_SECRET_KEY=sk_test_your_key_here
CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
JWT_SECRET=your_jwt_secret
```

```bash
npm run dev
```

### 4. AI Service (FastAPI)

```bash
cd ai-service
python -m venv .venv
source .venv/bin/activate  # Windows: .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `ai-service/.env`:

```env
OPENAI_API_KEY=sk-...
DB_URI=postgresql://user:password@host:5432/dbname
MONGODB_URI=mongodb+srv://your_connection_string
MONGODB_NAME=aurora_repos
LANGSMITH_TRACING=true
LANGSMITH_API_KEY=ls__your_key
LANGSMITH_PROJECT=aurora-chatbot
```

```bash
uvicorn app.main:app --reload --port 8000
```

---

## Docker Deployment

```bash
# AI Service
cd ai-service
docker build -t aurora-ai-service .
docker run -p 8000:8000 --env-file .env aurora-ai-service

# Express Server
cd server
docker build -t aurora-server .
docker run -p 5000:5000 --env-file .env aurora-server
```

---

## Key Design Decisions

**Why LangGraph instead of a simple chain?**
LangGraph gives the agent statefulness — it decides at each step whether to call a tool or respond directly, loops back after tool results, and maintains conversational state. A simple chain can't do conditional tool routing or multi-step reasoning.

**Why `repo_hash` isolation in ChromaDB?**
ChromaDB is a shared vector store. Without namespace isolation, queries for one repo return chunks from all repos. SHA-256 hashing the normalized URL gives a stable, collision-resistant filter key so `search_kwargs={"filter": {"repo_hash": hash}}` returns only the right repo's chunks.

**Why `ContextualCompressionRetriever` instead of basic similarity search?**
Basic top-k retrieval returns whole chunks — many partially irrelevant. `LLMChainExtractor` uses the LLM to extract only the sentences that actually answer the query, improving answer quality at the cost of one extra LLM call.

**Why PostgreSQL for checkpointing instead of in-memory?**
In-memory checkpointing dies on every server restart. `AsyncPostgresSaver` with a connection pool (max=20, keepalive=30s) means every `thread_id` retains its full conversation history indefinitely.

**Why `sessionId` as the LangGraph `thread_id`?**
Each MongoDB chat has a UUID `sessionId` that maps 1:1 to LangGraph's `thread_id`. Switching chats in the UI is simply switching `thread_id` in the LangGraph config — memory and session are always in sync.

**Why SSE instead of WebSockets?**
SSE is unidirectional (server → client), exactly what streaming token output needs. It's simpler, HTTP-native, works through standard proxies and load balancers without a persistent bidirectional socket.

---

## LangSmith Instrumented Stages

| # | Stage | Function |
|---|---|---|
| 1 | Clone | `clone_repo()` |
| 2 | Load | `load_repository()` |
| 3 | Split | `split_documents()` |
| 4 | Embed | `create_vector_store()` |
| 5 | Retrieve | `get_base_retriever()` |
| 6 | Compress | `get_compression_retriever()` |
| 7 | Generate | `generate_answer()` |

---

## Roadmap

- [ ] PDF document RAG (upload → chunk → embed → query)
- [ ] Multi-agent collaboration (planner + executor + reviewer)
- [ ] MCP (Model Context Protocol) tool integrations
- [ ] Redis caching for frequently queried repos
- [ ] Unit and integration tests
- [ ] Rate limiting per user

---

## Author

**Danish Islam**

GitHub: [https://github.com/DanishIslam10](https://github.com/DanishIslam10)
LinkedIn: [https://www.linkedin.com/in/danish-islam-85a127291/](https://www.linkedin.com/in/danish-islam-85a127291/)

If this helped you understand agentic RAG or LangGraph, a ⭐ on GitHub goes a long way.

---

## License

MIT — free to use, fork, and build on.

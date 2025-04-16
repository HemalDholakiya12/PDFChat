# PDFChat

# PDF Chat Application

A web-based application that allows users to upload PDF files and interact with them via a question-and-answer interface. This application parses the PDF, generates embeddings for the text, stores them in a vector database (FAISS), and retrieves relevant information using semantic search to provide contextual answers with an AI language model.

## Features

- Upload PDFs and extract text.
- Text chunking and embedding generation.
- Vector storage with FAISS for efficient similarity search.
- Answer generation using the Llama3 model hosted via Groq.
- Intuitive UI for chatting with your PDFs.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: FastAPI
- **Text Processing**: PyMuPDFLoader, RecursiveCharacterTextSplitter
- **Embeddings**: HuggingFace MiniLM Model
- **Vector Search**: FAISS
- **AI Model**: Llama3 (via Groq)
- **Deployment**: Docker, Groq Hosting

## How It Works

The application follows a structured process to handle user-uploaded PDFs and respond to queries. Here’s a high-level flow of the PDF processing and question-answering pipeline:

```mermaid
flowchart TD
    A[User Uploads PDF] --> B[Read PDF as Bytes using UploadFile]
    B --> C[Write Bytes to Temporary File using tempfile]
    C --> D[Load PDF using PyMuPDFLoader]
    D --> E[Split Text into Chunks using RecursiveCharacterTextSplitter]
    E --> F[Generate Embeddings using HuggingFace MiniLM]
    F --> G[Store Embeddings in FAISS Vector Store]
    G --> H[Create Retriever from FAISS]
    H --> I[Initialize LLM - Groq LLaMA3-8B]
    I --> J[Create QA Chain using RetrievalQA]

    K[User Asks a Question] --> L[Use Retriever to find relevant chunks]
    L --> M[Send Question and Chunks to LLaMA3]
    M --> N[Generate Answer using LLM]
    N --> O[Return Answer as JSON Response]

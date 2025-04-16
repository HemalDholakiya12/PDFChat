# PDFChat

A web-based application that allows users to upload PDF files and interact with them via a question-and-answer interface. This application parses the PDF, generates embeddings for the text, stores them in a vector database (FAISS), and retrieves relevant information using semantic search to provide contextual answers with an AI language model.

Features
Upload PDFs and extract text.

Text chunking and embedding generation.

Vector storage with FAISS for efficient similarity search.

Answer generation using the Llama3 model hosted via Groq.

Intuitive UI for chatting with your PDFs.

Tech Stack
Frontend: HTML, CSS, JavaScript

Backend: FastAPI

Text Processing: PyMuPDFLoader, RecursiveCharacterTextSplitter

Embeddings: HuggingFace MiniLM Model

Vector Search: FAISS

AI Model: Llama3 (via Groq)

Deployment: Docker, Groq Hosting

How It Works
Upload PDF: Users upload a PDF file via the user interface.

Text Extraction: The PDF is parsed, and its text content is split into manageable chunks using PyMuPDFLoader and RecursiveCharacterTextSplitter.

Generate Embeddings: Each chunk of text is embedded using the HuggingFace MiniLM model.

Store in FAISS: The embeddings are stored in a FAISS vector database for efficient retrieval.

Ask a Question: Users can ask any question related to the uploaded PDF.

Retrieve Relevant Chunks: Using semantic search, the system retrieves the top relevant chunks from the vector database.

Generate Answer: The retrieved chunks and the user's question are sent to Llama3 for contextual response generation.

Display Answer: The final answer is displayed to the user in the chat interface.

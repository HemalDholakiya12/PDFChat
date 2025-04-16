# PDFChat
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

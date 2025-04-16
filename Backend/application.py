from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from schemas import QARequest
from qa_engine import process_pdf_and_create_index, get_answer
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "PDF Chat API is running!"}

@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    contents = await file.read()

    process_pdf_and_create_index(contents)

    return {"message": "PDF uploaded and indexed"}

@app.post("/ask/")
async def ask_question(request: QARequest):
    answer = get_answer(request.question) 
    return {"answer": answer}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 40000))

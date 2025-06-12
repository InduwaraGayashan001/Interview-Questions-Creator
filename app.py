from fastapi import FastAPI, Form, Request, File
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os
import aiofiles
import csv
from src.helper import llm_pipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.post("/upload")
async def upload_file(pdf_file: bytes = File(...), filename: str = Form(...)):
    base_folder = 'static/docs'
    os.makedirs(base_folder, exist_ok=True)

    pdf_filename = os.path.join(base_folder, filename)
    async with aiofiles.open(pdf_filename, 'wb') as f:
        await f.write(pdf_file)

    return JSONResponse(content={"message": "File uploaded successfully", "pdf_filename": pdf_filename})


def get_csv(file_path: str):
    answer_generation_chain, ques_list = llm_pipeline(file_path)
    qa_pairs = []

    base_folder = 'static/output'
    os.makedirs(base_folder, exist_ok=True)

    output_file = os.path.join(base_folder, 'QA.csv')
    with open(output_file, mode='w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['Question', 'Answer'])

        for question in ques_list:
            answer = answer_generation_chain.run(question)
            qa_pairs.append({"question": question, "answer": answer})
            writer.writerow([question, answer])

    return output_file, qa_pairs


@app.post("/analyze")
async def analyze(pdf_filename: str = Form(...)):
    output_file, qa_pairs = get_csv(pdf_filename)
    return JSONResponse(content={"output_file": output_file, "qa_pairs": qa_pairs})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
import boto3
import os
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import json


# Load environment variables from .env
load_dotenv()
router = APIRouter()

@router.get("/hello")
def translation_hello():
    return {"message": "Hello from translation API"}


# New endpoint to receive file upload and upload to S3
@router.post("/upload")
async def upload_translation_file(file: UploadFile = File(...), language: str = Form(...)):
    # AWS S3 setup
    s3 = boto3.client("s3")
    bucket_name = os.environ.get("AWS_S3_BUCKET", "transbucket-dl")  # Set your bucket name or use env var
    s3_key = f"translate/{file.filename}"

    # Read file content
    file_content = await file.read()

    # Upload to S3
    try:
        response = s3.put_object(Bucket=bucket_name, Key=s3_key, Body=file_content, ContentType=file.content_type)
        print(f"Uploaded {file.filename} to S3 bucket {bucket_name} as {s3_key}")
        print("S3 response:", response)
    except Exception as e:
        print("S3 upload error:", e)
        return JSONResponse({"error": str(e)}, status_code=500)    

    return JSONResponse({
        "filename": file.filename,
        "language": language,
        "s3_url": f"https://{bucket_name}.s3.amazonaws.com/{s3_key}"
    })


@router.post("/extract_text")
async def extract_text_from_pdf(file_path):
    reader = PdfReader(file_path)
    return "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])


@router.post("/create_chunks")
async def split_text_into_chunks(text, chunk_size=1000, chunk_overlap=100):
    splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    return splitter.split_text(text)

@router.post("/translate-using-claude")
async def call_claude(prompt, model_id="anthropic.claude-3-sonnet-20240229-v1:0", max_tokens=1000):
    bedrock = boto3.client("bedrock-runtime", region_name="us-east-1")  # use your region
    body = {
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": max_tokens,
    }

    response = bedrock.invoke_model(
        modelId=model_id,
        body=json.dumps(body),
        contentType="application/json",
        accept="application/json",
    )
    return json.loads(response['body'].read())['content']
from fastapi import APIRouter, UploadFile, File, Form
from app.services.ai_service import analyze_image

router = APIRouter()

@router.post("/analyze-style")
async def analyze_style(
    file: UploadFile = File(...),
    style: str = Form(...)
):
    file_bytes = await file.read()
    analysis = analyze_image(file_bytes, style)

    return {
        "filename": file.filename,
        "analysis": analysis
    }

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from app.routes import style

app = FastAPI()

app.include_router(style.router)

@app.get("/")
def root():
    return {"message": "boots down backend is running"}
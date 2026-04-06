import os
import base64
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

print("API KEY:", os.getenv("OPENAI_API_KEY"))

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def analyze_image(file_bytes: bytes) -> str:
    base64_image = base64.b64encode(file_bytes).decode("utf-8")

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": (
                            "Analyze this clothing item image. "
                            "Describe the item in a short, clear way:\n"
                            "- item type\n"
                            "- color\n"
                            "- material\n"
                            "- style vibe\n"
                            "- season or occasion\n"
                        )
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ]
    )

    return response.choices[0].message.content
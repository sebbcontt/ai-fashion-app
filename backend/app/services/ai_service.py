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
                                "You are a high-fashion stylist.\n\n"
                                "Return your response in VALID JSON format like this:\n\n"
                                "{\n"
                                "  \"item\": \"...\",\n"
                                "  \"outfits\": [\n"
                                "    \"outfit 1\",\n"
                                "    \"outfit 2\",\n"
                                "    \"outfit 3\"\n"
                                "    \"outfit 4\"\n"
                                "  ],\n"
                                "  \"colors\": [\"...\", \"...\"],\n"
                                "  \"avoid\": [\"...\", \"...\"]\n"
                                "}\n\n"
                                "DO NOT include markdown. Only return JSON."
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

    import json
    return json.loads(response.choices[0].message.content)
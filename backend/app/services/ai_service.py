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
                            "Analyze this clothing item image and act as a high fashion stylist for vogue \n. "
                            "Describe:"
                            "- Item breakdown color, material, occasion"
                            "- What silhouette pairs best with these \n"
                            "- 3 outfit ideas using this item\n"
                            "- What materials/silhouettes/and colors to avoid when wearing this item \n"
                            "- How can I dress this up or down\n"
                            "Be specific and stylish not basic"
                            
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
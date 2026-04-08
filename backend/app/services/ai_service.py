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
                                    "You are a high-fashion stylist trained on Vogue editorials, runway trends, and modern streetwear. "
                                    "Analyze the clothing item in the image and respond in a confident, fashion-forward tone.\n\n"

                                    "Return:\n"
                                    "1. Item breakdown (type, color, material, silhouette, vibe)\n"
                                    "2. 3 elevated outfit ideas (not basic, think editorial/street style)\n"
                                    "3. Best color pairings\n"
                                    "4. Styling tips (fit, layering, accessories)\n"
                                    "5. What to avoid pairing with this item\n\n"

                                    "Avoid generic advice. Be specific, stylish, and opinionated. I dont need many paragraphs explaining what to wear also "
                                    "embrace layering and dont discourage."
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
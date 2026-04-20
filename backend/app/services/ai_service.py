import os
import base64
import json
from dotenv import load_dotenv
from openai import OpenAI
from PIL import Image
import io

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def normalize_image(file_bytes):
    image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    buffer = io.BytesIO()
    image.save(buffer, format="JPEG")
    return buffer.getvalue()


def analyze_image(file_bytes: bytes, style: str = "neutral") -> dict:
    print("analyzing image")

    file_bytes = normalize_image(file_bytes)
    print("image size:", len(file_bytes))

    base64_image = base64.b64encode(file_bytes).decode("utf-8")

    prompt = f"""
You are an elite fashion stylist.

The user selected this style direction: {style}

STRICT RULES:
- masculine: structured, boxy fits, sharp silhouettes, darker tones, no feminine garments
- feminine: soft fabrics, flowy silhouettes, waist emphasis, heels, skirts, dresses allowed
- neutral: balanced, minimal, androgynous, modern

You MUST reflect the selected style in EVERY outfit.

Return ONLY valid JSON in this exact shape:
{{
  "item": "short description of the item",
  "outfits": [
    "outfit idea 1",
    "outfit idea 2",
    "outfit idea 3",
    "outfit idea 4"
  ],
  "colors": ["color 1", "color 2", "color 3"],
  "avoid": ["avoid 1", "avoid 2", "avoid 3"]
}}

No markdown. JSON only.
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            },
                        },
                    ],
                }
            ],
        )

        print("got response")

        content = response.choices[0].message.content
        data = json.loads(content)

    except Exception as e:
        print("OPENAI ERROR:", e)
        return {
            "item": "API error",
            "outfits": [],
            "colors": [],
            "avoid": [],
        }

    return {
        "item": data.get("item", ""),
        "outfits": data.get("outfits", []),
        "colors": data.get("colors", []),
        "avoid": data.get("avoid", []),
    }
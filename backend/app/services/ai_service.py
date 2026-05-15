import os
import base64
import json
from dotenv import load_dotenv
from openai import OpenAI
from PIL import Image
from pillow_heif import register_heif_opener
import io

load_dotenv()

# Allow Pillow to open HEIC / HEIF images (the default format on iPhones).
# The frontend attempts a browser-side conversion for the preview, but the
# original HEIC may still be uploaded here if that conversion fails.
register_heif_opener()

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

You MUST reflect the selected style in EVERY outfit and recommendation.

Return ONLY valid JSON in this exact shape:
{{
  "item": "short description of the item",
  "vibe": "a 2-4 word style descriptor for this item (e.g. 'streetwear minimalist', 'old-money casual')",
  "seasons": ["season 1", "season 2"],
  "outfits": [
    "outfit idea 1",
    "outfit idea 2",
    "outfit idea 3",
    "outfit idea 4"
  ],
  "styling_tips": [
    "specific tip on fit, tucking, layering, or proportion 1",
    "specific tip 2",
    "specific tip 3"
  ],
  "where_to_wear": ["occasion 1", "occasion 2", "occasion 3"],
  "accessories": ["accessory suggestion 1", "accessory suggestion 2", "accessory suggestion 3"],
  "colors": [
    {{"name": "color name 1", "hex": "#RRGGBB"}},
    {{"name": "color name 2", "hex": "#RRGGBB"}},
    {{"name": "color name 3", "hex": "#RRGGBB"}}
  ],
  "avoid": ["avoid 1", "avoid 2", "avoid 3"]
}}

For each color, "hex" MUST be an accurate 6-digit hex code matching the color name.
Keep every string concise. Seasons must be drawn from: spring, summer, fall, winter.
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
            "vibe": "",
            "seasons": [],
            "outfits": [],
            "styling_tips": [],
            "where_to_wear": [],
            "accessories": [],
            "colors": [],
            "avoid": [],
        }

    return {
        "item": data.get("item", ""),
        "vibe": data.get("vibe", ""),
        "seasons": data.get("seasons", []),
        "outfits": data.get("outfits", []),
        "styling_tips": data.get("styling_tips", []),
        "where_to_wear": data.get("where_to_wear", []),
        "accessories": data.get("accessories", []),
        "colors": data.get("colors", []),
        "avoid": data.get("avoid", []),
    }
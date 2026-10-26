import os
import glob
from PIL import Image

artifact_dir = r"C:\Users\Admin\.gemini\antigravity-ide\brain\4d1184d8-1851-4ee3-9066-743a331667c9"
dest_dir = r"d:\Luxury Hotel Website\public\images"
os.makedirs(dest_dir, exist_ok=True)

image_mapping = {
    "lobby": "lobby.webp",
    "staircase": "staircase.webp",
    "dining": "dining.webp",
    "spa": "spa.webp",
    "gym": "gym.webp",
    "pool": "pool.webp",
    "suite": "suite.webp",
    "balcony": "balcony.webp",
    "skylounge": "skylounge.webp",
    "og_image": "og-image.jpg",
}

for key, target_filename in image_mapping.items():
    pattern = os.path.join(artifact_dir, f"{key}_*.jpg")
    matches = glob.glob(pattern)
    if matches:
        latest = max(matches, key=os.path.getmtime)
        dest_path = os.path.join(dest_dir, target_filename)
        img = Image.open(latest)
        if target_filename.endswith(".webp"):
            # Resize if long side > 1600px
            max_size = 1600
            if max(img.size) > max_size:
                img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            img.save(dest_path, "WEBP", quality=82)
            print(f"Saved {dest_path} ({os.path.getsize(dest_path) / 1024:.1f} KB)")
        else:
            img.save(dest_path, "JPEG", quality=88)
            print(f"Saved {dest_path} ({os.path.getsize(dest_path) / 1024:.1f} KB)")
    else:
        print(f"Warning: No match found for pattern {pattern}")

# Write PROMPTS.md
prompts_content = """# SAPTARISHI Luxury Card Image Prompts

All imagery generated with custom art direction matching the ultra-luxury aesthetic of Saptarishi:

Prefix for all prompts:
`Ultra-luxury hotel interior photography at night, warm amber architectural lighting, deep obsidian shadows, bronze and dark marble, linen and warm stone tones, wet reflective surfaces, cinematic, photorealistic, calm and quiet, 4:5 portrait, no people, no text, no logos, no watermarks.`

1. **lobby.webp**
   - Prompt: Grand double-height lobby, bronze-framed glass, long marble reception desk, tall potted olive trees, amber ceiling coves.
2. **staircase.webp**
   - Prompt: Sculptural marble staircase curving upward, thin bronze handrail, warm light grazing the stone.
3. **dining.webp**
   - Prompt: Intimate fine-dining room, a few candlelit tables with linen and crystal, floor-to-ceiling curtains, glowing amber pendants.
4. **spa.webp**
   - Prompt: Serene thermal spa, warm stone walls, still dark water, soft steam, a row of candles.
5. **gym.webp**
   - Prompt: Private minimalist training studio, dark wood floor, bronze details, large window with soft blue dusk light.
6. **pool.webp**
   - Prompt: Infinity pool at dusk reflecting a deep navy sky with the first stars, lit cabanas, stone deck.
7. **suite.webp**
   - Prompt: Signature suite bedroom, low bed with linen and umber textiles, bronze lamps, panoramic window with the city glowing below.
8. **balcony.webp**
   - Prompt: Private stone balcony at twilight, two lounge chairs, glass balustrade, glowing city skyline in the distance.
9. **skylounge.webp**
   - Prompt: Rooftop sky lounge, long bronze bar, low leather seating, open starry sky, warm lantern light.
10. **og-image.jpg** (1200x630)
   - Prompt: Ultra-luxury hotel exterior photography at night, grand glowing bronze-framed glass entrance, wet dark marble reflections, floodlit olive trees and palms, dark luxury limousine, serene deep navy night sky with subtle stars, cinematic, photorealistic, calm and quiet, 16:9, no people, no watermarks.
"""

with open(os.path.join(dest_dir, "PROMPTS.md"), "w", encoding="utf-8") as f:
    f.write(prompts_content)

print("PROMPTS.md created successfully!")

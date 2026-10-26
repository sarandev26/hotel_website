import os
import shutil
import subprocess
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
print(f"Using ffmpeg at: {ffmpeg_exe}")

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
public_dir = os.path.join(base_dir, "public")
videos_dir = os.path.join(public_dir, "videos")
images_dir = os.path.join(public_dir, "images")

os.makedirs(videos_dir, exist_ok=True)
os.makedirs(images_dir, exist_ok=True)

sources = [
    ("Hero video 1", "journey-1"),
    ("Hero video 2", "journey-2"),
    ("Hero video 3", "journey-3"),
]

for src_folder_name, out_prefix in sources:
    src_folder = os.path.join(base_dir, src_folder_name)
    print(f"\nProcessing {src_folder_name} -> {out_prefix}...")

    # 1. Poster from frame 1
    frame_1 = os.path.join(src_folder, "frame_000001.jpg")
    poster_out = os.path.join(videos_dir, f"{out_prefix}-poster.jpg")
    if os.path.exists(frame_1):
        shutil.copyfile(frame_1, poster_out)
        print(f"  Copied poster: {poster_out}")
        if out_prefix == "journey-1":
            shutil.copyfile(frame_1, os.path.join(images_dir, "hero-poster.jpg"))
            print(f"  Copied hero poster to images/hero-poster.jpg")

    # 2. Encode 1080p / native (1440x810) with all keyframes (-g 1)
    input_pattern = os.path.join(src_folder, "frame_%06d.jpg")
    out_mp4 = os.path.join(videos_dir, f"{out_prefix}.mp4")
    out_encoded = os.path.join(videos_dir, f"{out_prefix}.encoded.mp4")

    cmd_full = [
        ffmpeg_exe, "-y",
        "-framerate", "24",
        "-i", input_pattern,
        "-c:v", "libx264",
        "-g", "1",
        "-crf", "18",
        "-preset", "slow",
        "-pix_fmt", "yuv420p",
        "-an",
        "-movflags", "+faststart",
        out_mp4
    ]
    print(f"  Encoding {out_mp4}...")
    res = subprocess.run(cmd_full, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"  Error encoding full mp4: {res.stderr}")
    else:
        print(f"  Successfully encoded {out_mp4} ({os.path.getsize(out_mp4) / 1024 / 1024:.2f} MB)")
        # Also copy as .encoded.mp4 as mentioned in specification
        shutil.copyfile(out_mp4, out_encoded)

    # 3. Encode 720p version for mobile / low-power devices
    out_720 = os.path.join(videos_dir, f"{out_prefix}-720p.mp4")
    cmd_720 = [
        ffmpeg_exe, "-y",
        "-framerate", "24",
        "-i", input_pattern,
        "-vf", "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2",
        "-c:v", "libx264",
        "-g", "1",
        "-crf", "22",
        "-preset", "slow",
        "-pix_fmt", "yuv420p",
        "-an",
        "-movflags", "+faststart",
        out_720
    ]
    print(f"  Encoding 720p {out_720}...")
    res_720 = subprocess.run(cmd_720, capture_output=True, text=True)
    if res_720.returncode != 0:
        print(f"  Error encoding 720p: {res_720.stderr}")
    else:
        print(f"  Successfully encoded 720p ({os.path.getsize(out_720) / 1024 / 1024:.2f} MB)")

print("\nAll videos processed successfully!")

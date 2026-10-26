#!/usr/bin/env bash
# SAPTARISHI Luxury 7-Star Hotel
# Re-encode journey videos with intra-only keyframes (-g 1) for stutter-free reverse and forward scrubbing.

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VIDEOS_DIR="$DIR/public/videos"

mkdir -p "$VIDEOS_DIR"

for N in 1 2 3; do
  INPUT="$VIDEOS_DIR/journey-$N.mp4"
  OUTPUT="$VIDEOS_DIR/journey-$N.encoded.mp4"
  OUTPUT_720="$VIDEOS_DIR/journey-$N-720p.mp4"

  if [ -f "$INPUT" ]; then
    echo "Processing journey-$N.mp4 with keyframe-per-frame (-g 1)..."
    ffmpeg -y -i "$INPUT" \
      -c:v libx264 -g 1 -crf 20 -preset slow -pix_fmt yuv420p -an -movflags +faststart \
      "$OUTPUT"

    echo "Creating 720p mobile version journey-$N-720p.mp4..."
    ffmpeg -y -i "$INPUT" \
      -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" \
      -c:v libx264 -g 1 -crf 22 -preset slow -pix_fmt yuv420p -an -movflags +faststart \
      "$OUTPUT_720"
  else
    echo "Warning: $INPUT not found."
  fi
done

echo "Encoding complete."

#!/bin/bash

# Matrix Video Setup Script
# This script downloads the Matrix rain video from YouTube and converts it for web use

echo "Setting up Matrix video background..."

# Create videos directory in public folder
mkdir -p public/videos

# Check if yt-dlp is installed (better than youtube-dl)
if ! command -v yt-dlp &> /dev/null; then
    echo "Installing yt-dlp for video download..."
    
    # For Windows (using pip)
    if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        pip install yt-dlp
    else
        # For macOS/Linux
        curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
        chmod a+rx /usr/local/bin/yt-dlp
    fi
fi

# Download the Matrix video from YouTube
echo "Downloading Matrix rain video..."
yt-dlp -f "best[height<=720]" --output "public/videos/matrix-rain-original.%(ext)s" "https://www.youtube.com/watch?v=PYlF8HgM90Y"

# Check if ffmpeg is available for conversion
if command -v ffmpeg &> /dev/null; then
    echo "Converting video for web optimization..."
    
    # Convert to MP4 (H.264) for better compatibility
    ffmpeg -i public/videos/matrix-rain-original.* -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart public/videos/matrix-rain.mp4
    
    # Convert to WebM for additional compatibility
    ffmpeg -i public/videos/matrix-rain-original.* -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus -b:a 128k public/videos/matrix-rain.webm
    
    # Create a looped version (30 seconds)
    ffmpeg -stream_loop -1 -i public/videos/matrix-rain.mp4 -t 30 -c copy public/videos/matrix-rain-loop.mp4
    
    echo "Video setup complete!"
    echo "Files created:"
    echo "- public/videos/matrix-rain.mp4"
    echo "- public/videos/matrix-rain.webm"
    echo "- public/videos/matrix-rain-loop.mp4"
else
    echo "FFmpeg not found. Please install FFmpeg for video conversion."
    echo "You can use the original downloaded file, but it may not be optimized for web."
fi

echo "Matrix video background is ready!"

# Matrix Video Setup PowerShell Script
# Downloads and sets up the Matrix rain video for local use

Write-Host "Setting up Matrix video background..." -ForegroundColor Green

# Create videos directory
$videosDir = "public\videos"
if (!(Test-Path $videosDir)) {
    New-Item -ItemType Directory -Path $videosDir -Force
    Write-Host "Created videos directory" -ForegroundColor Yellow
}

# Check if yt-dlp is installed
try {
    yt-dlp --version | Out-Null
    Write-Host "yt-dlp found" -ForegroundColor Green
} catch {
    Write-Host "Installing yt-dlp..." -ForegroundColor Yellow
    
    # Install yt-dlp via pip
    try {
        pip install yt-dlp
        Write-Host "yt-dlp installed successfully" -ForegroundColor Green
    } catch {
        Write-Host "Failed to install yt-dlp. Please install Python and pip first." -ForegroundColor Red
        Write-Host "Or use the YouTube embed version which works without local video files." -ForegroundColor Yellow
        pause
        exit 1
    }
}

# Download the Matrix video
Write-Host "Downloading Matrix rain video from YouTube..." -ForegroundColor Yellow
$videoUrl = "https://www.youtube.com/watch?v=PYlF8HgM90Y"

try {
    yt-dlp -f "best[height<=720]" --output "$videosDir\matrix-rain-original.%(ext)s" $videoUrl
    Write-Host "Video downloaded successfully" -ForegroundColor Green
} catch {
    Write-Host "Failed to download video. YouTube embed will be used instead." -ForegroundColor Yellow
    pause
    exit 0
}

# Check if ffmpeg is available for conversion
try {
    ffmpeg -version | Out-Null
    Write-Host "FFmpeg found, converting video..." -ForegroundColor Green
    
    # Convert to optimized formats
    ffmpeg -i "$videosDir\matrix-rain-original.*" -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart "$videosDir\matrix-rain.mp4"
    ffmpeg -i "$videosDir\matrix-rain-original.*" -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus -b:a 128k "$videosDir\matrix-rain.webm"
    
    Write-Host "Video conversion complete!" -ForegroundColor Green
    Write-Host "Files created:" -ForegroundColor Yellow
    Write-Host "- public\videos\matrix-rain.mp4" -ForegroundColor Cyan
    Write-Host "- public\videos\matrix-rain.webm" -ForegroundColor Cyan
    
    # Update the component to use local video
    Write-Host "To use local video instead of YouTube embed, set useYouTube: false in MatrixVideoBackground settings" -ForegroundColor Yellow
    
} catch {
    Write-Host "FFmpeg not found. Install FFmpeg for video optimization." -ForegroundColor Yellow
    Write-Host "Current video will work but may not be optimized for web." -ForegroundColor Yellow
}

Write-Host "Matrix video background setup complete!" -ForegroundColor Green
Write-Host "The component is currently using YouTube embed for reliability." -ForegroundColor Cyan
pause

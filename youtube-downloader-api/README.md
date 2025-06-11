
# YouTube Downloader API

This Node.js application provides an API endpoint to download YouTube videos or extract their audio using `yt-dlp`. Downloaded files are saved to a local `downloads/` directory and made available via a public link. A cleanup script is also included to remove old files.

## Features

- Download YouTube videos (best quality MP4).
- Extract audio from YouTube videos (MP3 format).
- Customizable output filenames.
- Serves downloaded files statically.
- Automatic cleanup of files older than 24 hours.

## Prerequisites

1.  **Node.js and npm:** Make sure you have Node.js (v14 or newer recommended) and npm installed.
2.  **yt-dlp:** This API relies on the `yt-dlp` command-line program. You need to install it and ensure it's accessible in your system's PATH.
    -   Installation instructions for `yt-dlp` can be found here: [https://github.com/yt-dlp/yt-dlp#installation](https://github.com/yt-dlp/yt-dlp#installation)
    -   Alternatively, you can set the `YT_DLP_PATH` environment variable to the full path of your `yt-dlp` executable if it's not in PATH.
3.  **(Optional but recommended for audio extraction) FFmpeg:** `yt-dlp` requires FFmpeg for audio extraction and format conversion (like creating MP3s). Ensure FFmpeg is installed and in your system's PATH.
    -   Download FFmpeg: [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)

## Setup and Installation

1.  **Clone the repository (or create the files as provided):**
    ```bash
    # If you have the files locally in a youtube-downloader-api directory
    cd youtube-downloader-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Running the API Server

To start the API server:

```bash
npm start
```

By default, the server will run on `http://localhost:3000`.
The `downloads/` directory will be created in the project root if it doesn't exist.

## API Endpoint

### `POST /download`

This endpoint initiates the download and processing of a YouTube video.

**Request Body (JSON):**

```json
{
  "url": "YOUTUBE_VIDEO_URL",
  "format": "video_or_audio",
  "filename": "DESIRED_FILENAME_WITHOUT_EXTENSION"
}
```

-   `url` (string, required): The full URL of the YouTube video.
-   `format` (string, required): The desired format.
    -   `"video"`: Downloads the best quality MP4 video.
    -   `"audio"`: Extracts audio and saves it as an MP3 file.
-   `filename` (string, required): The base name for the downloaded file. The API will automatically append `.mp4` for video or `.mp3` for audio. Any existing extension in the provided filename will be stripped and replaced.

**Sample Request:**

```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "format": "audio",
  "filename": "my-favorite-song"
}
```

**Success Response (200 OK):**

Returns a JSON object with a link to the downloaded file.

```json
{
  "downloadLink": "http://localhost:3000/downloads/my-favorite-song.mp3"
}
```

**Error Responses:**

-   `400 Bad Request`: If required fields are missing or the format is invalid.
    ```json
    {
      "error": "Missing required fields: url, format, filename"
    }
    ```
-   `500 Internal Server Error`: If `yt-dlp` fails or another server-side error occurs.
    ```json
    {
      "error": "Failed to download video/audio.",
      "details": "yt-dlp error message or other error info"
    }
    ```

## File Cleanup

A script is provided to remove files from the `downloads/` directory that are older than 24 hours.

To run the cleanup script manually:

```bash
npm run cleanup
```

You can automate this script using a cron job (Linux/macOS) or Task Scheduler (Windows) to run periodically (e.g., once a day).

**Example cron job (runs daily at 3 AM):**

```cron
0 3 * * * cd /path/to/your/youtube-downloader-api && /usr/bin/node cleanup.js >> /path/to/your/cleanup.log 2>&1
```
(Adjust paths as necessary)

## Important Notes

-   **Legality and Terms of Service:** Be aware of YouTube's Terms of Service and copyright laws in your country before downloading content. This tool is provided for educational or personal use where permissible.
-   **Resource Usage:** Downloading and processing videos can be resource-intensive (CPU, network, disk space).
-   **Error Handling:** The `yt-dlp` process can sometimes fail due to various reasons (video unavailable, network issues, etc.). The API attempts to provide error details.
-   **`yt-dlp` Updates:** `yt-dlp` is frequently updated to keep up with changes on YouTube. Keep your `yt-dlp` installation up-to-date for best results. The `yt-dlp-wrap` library may also download `yt-dlp` if it can't find it, but managing your own `yt-dlp` version is often more reliable for server applications.
-   **Filename Sanitization:** The API sanitizes the provided `filename` to prevent potentially unsafe characters.


const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const YTDlpWrap = require('yt-dlp-wrap').default; // .default is important for CommonJS
const sanitize = require('sanitize-filename');

const app = express();
const port = process.env.PORT || 3000;

const downloadsDir = path.join(__dirname, 'downloads');
const ytDlpPath = process.env.YT_DLP_PATH; // Optional: specify path to yt-dlp binary

// Ensure downloads directory exists
fs.ensureDirSync(downloadsDir);

// Initialize yt-dlp-wrap
// It will attempt to find yt-dlp in PATH or download it if not found and no path is specified.
// For production, it's recommended to have yt-dlp installed and in PATH or provide YT_DLP_PATH.
const ytDlpWrap = new YTDlpWrap(ytDlpPath);

app.use(express.json());

// Serve downloaded files statically
app.use('/downloads', express.static(downloadsDir));

app.post('/download', async (req, res) => {
  const { url, format, filename } = req.body;

  if (!url || !format || !filename) {
    return res.status(400).json({ error: 'Missing required fields: url, format, filename' });
  }

  if (format !== 'audio' && format !== 'video') {
    return res.status(400).json({ error: 'Invalid format. Must be "audio" or "video".' });
  }

  // Sanitize filename and determine extension
  let baseFilename = filename;
  const extPeriod = filename.lastIndexOf('.');
  if (extPeriod > 0 && extPeriod < filename.length -1 ) { // Ensure '.' is not the first or last char
    baseFilename = filename.substring(0, extPeriod);
  }
  const safeBaseFilename = sanitize(baseFilename);
  if (!safeBaseFilename) {
    return res.status(400).json({ error: 'Invalid filename after sanitization.' });
  }

  const fileExtension = format === 'audio' ? 'mp3' : 'mp4';
  const finalFilename = `${safeBaseFilename}.${fileExtension}`;
  const outputPath = path.join(downloadsDir, finalFilename);

  try {
    console.log(`Attempting to download: ${url} as ${format} to ${finalFilename}`);

    let ytDlpArgs = [];
    if (format === 'audio') {
      ytDlpArgs = [
        url,
        '-x', // Extract audio
        '--audio-format', 'mp3',
        '-o', outputPath,
      ];
    } else { // video
      ytDlpArgs = [
        url,
        '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best', // Get best MP4 video with audio
        '--merge-output-format', 'mp4', // Ensure output is MP4 if merging is needed
        '-o', outputPath,
      ];
    }

    // Optional: Add progress reporting if needed for longer downloads
    // ytDlpWrap.on('progress', (progress) => console.log(progress.percent, progress.totalSize, progress.currentSpeed, progress.eta));

    await ytDlpWrap.execPromise(ytDlpArgs);

    console.log(`Successfully downloaded and saved to ${outputPath}`);
    const downloadLink = `${req.protocol}://${req.get('host')}/downloads/${finalFilename}`;
    res.json({ downloadLink });

  } catch (error) {
    console.error('Error during download process:', error);
    // Attempt to delete partially downloaded file if error occurs
    if (await fs.pathExists(outputPath)) {
        await fs.remove(outputPath);
    }
    res.status(500).json({ error: 'Failed to download video/audio.', details: error.message || error.toString() });
  }
});

app.listen(port, () => {
  console.log(`YouTube Downloader API server listening on port ${port}`);
  console.log(`Ensure yt-dlp is installed and accessible in your system's PATH, or set YT_DLP_PATH environment variable.`);
  console.log(`Downloaded files will be saved to: ${downloadsDir}`);
  console.log(`Files will be served from: http://localhost:${port}/downloads/<filename>`);
});

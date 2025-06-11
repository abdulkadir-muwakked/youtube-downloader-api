
const fs = require('fs-extra');
const path = require('path');

const downloadsDir = path.join(__dirname, 'downloads');
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

async function cleanupOldFiles() {
  console.log(`Starting cleanup of files older than 24 hours in ${downloadsDir}...`);

  try {
    if (!(await fs.pathExists(downloadsDir))) {
      console.log('Downloads directory does not exist. Nothing to clean up.');
      return;
    }

    const files = await fs.readdir(downloadsDir);
    let filesDeleted = 0;

    for (const file of files) {
      const filePath = path.join(downloadsDir, file);
      try {
        const stats = await fs.stat(filePath);
        const ageMs = Date.now() - stats.mtime.getTime();

        if (ageMs > MAX_AGE_MS) {
          await fs.remove(filePath);
          console.log(`Deleted old file: ${file}`);
          filesDeleted++;
        }
      } catch (statError) {
        console.error(`Error processing file ${file}: ${statError.message}. Skipping.`);
      }
    }
    console.log(`Cleanup complete. Deleted ${filesDeleted} old file(s).`);
  } catch (error) {
    console.error(`Error during cleanup process: ${error.message}`);
  }
}

cleanupOldFiles();

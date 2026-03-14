const fs = require('fs');
const path = require('path');

// Escape single quotes for Google Drive API query strings
function escapeDriveQuery(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// Escape HTML to prevent XSS
function escapeHtml(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(str).replace(/[&<>"']/g, (c) => map[c]);
}

// Get the most recent modification time in a directory
function getDirectoryLastModified(dirPath) {
  let latestTime = new Date(0);

  function checkDirectory(currentPath) {
    try {
      const items = fs.readdirSync(currentPath);

      for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const stats = fs.statSync(fullPath);

        if (stats.mtime > latestTime) {
          latestTime = stats.mtime;
        }

        if (stats.isDirectory()) {
          checkDirectory(fullPath);
        }
      }
    } catch (error) {
      console.error('Error checking directory:', error);
    }
  }

  if (fs.existsSync(dirPath)) {
    checkDirectory(dirPath);
  }

  return latestTime;
}

module.exports = { escapeDriveQuery, escapeHtml, getDirectoryLastModified };

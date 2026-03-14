const Store = require('electron-store');
const { app } = require('electron');
const crypto = require('crypto');

// Derive a machine-specific encryption key from userData path
const machineKey = crypto
  .createHash('sha256')
  .update(app.getPath('userData'))
  .digest('hex')
  .slice(0, 32);

const store = new Store({
  cwd: app.getPath('userData'),
  encryptionKey: machineKey,
});

module.exports = store;
const ProtocolAction = require('./_base-action.js');
const path = require('path');
const Archiver = require('archiver');

/**
 * Uploads a file to the remote server, returning the path to the remote file.
 *
 * @param  {[String]} file The path to the file.
 * @param  {Function} [callback] Optional callback function to be called when the command finishes.
 * @return {[String]}  The path to the file on the remote server.
 */

module.exports = class Action extends ProtocolAction {
  command(filePath, callback) {
    let buffers = [];
    const zip = new Archiver('zip');
  
    zip.on('data', function(data) {
      buffers.push(data);
    })
      .on('finish', function() {
        const finalZipBuffer = Buffer.concat(buffers);
        return this.transportActions.uploadFileToSeleniumServer(finalZipBuffer.toString('base64'), callback);
      })
      .on('error', function(err) {
        throw err;
      });
  
    const name = path.basename(filePath)
    zip.file(filePath, { name: name });
    zip.finalize();
  }
};

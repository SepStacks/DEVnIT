var fs = require("fs");
const { throttle } = require("lodash");

// Check if directory exist
const ifExist = (root, path, directory, fileType, fileName) => {
  // attach md file to dir only if the target to delete is the .md file

  fs.stat(root, (err, stats) => {
    if (err) {
      console.log(err);
    } else {
      if (directory) {
        fs.rmdir(path, { recursive: true }, err => {
          if (err) throw err;

          console.log("Code has been");

          console.log(`${path} is deleted!`);
        });

      } else {
        fs.unlink(path + fileType, err => {
          if (err) throw err;
          console.log("file deleted successfully");
          console.log(path + fileType);
        });
      }
    }
  });
};

exports.ifExist = ifExist;

var fs = require("fs");
const { throttle } = require("lodash");

// Check if directory exist
const ifExist = (root, path, directory, fileType) => {
  // attach md file to dir only if the target to delete is the .md file

  fs.stat(root, (err, stats) => {
    if (err) {
      console.log('file does not exist')
      console.log(err);
    } else {
      if (directory === true) {
        fs.rmdir(path, { recursive: true }, err => {
          if (err){
            console.log(`unable to remove ${path} `)
            console.log(err)
          }

          console.log("Code has been");

          console.log(`${path} is deleted!`);
        });

      } else {
        //remove content (.md) files, this can be either parent or child components
        fs.unlink(path + fileType, err => {
          if (err) throw err;
          console.log("file deleted successfully");
          console.log(path + fileType);

          //remove folder if empty
          fs.rmdir(root, function(err) {
            if (err) {
              throw err
            } else {
              console.log("Successfully removed the empty directory!")
            }
          })
        });
      }
    }
  });
};

exports.ifExist = ifExist;

var fs = require("fs");
const { throttle } = require("lodash");
/* If you want to check file before delete whether it exist or not. So, use
   fs.stat or fs.statSync(Synchronous) instead of fs.exists. Because according to
   the latest node.js documentation, fs.exists now deprecated.*/

// Check if directory exist
const ifExist = (root, path, directory, fileType, fileName) => {
  // attach md file to dir only if the target to delete is the .md file

  fs.stat(root, (err, stats) => {
    if (err) {
      console.log(err);
    } else {
      if (directory) {
        fs.rm(root, { recursive: true, force: true }, err => {
          if (err) throw err;

          consola.success({
            message: `Directory removed successfully`,
            badge: true
          });
        });
      } else {
        fs.unlink(path + fileType, err => {
          if (err) throw err;
          consola.success({
            message: `File removed successfully`,
            badge: true
          });
        });

        //remove directories if its empty
        fs.readdir(root + '/' + fileName, function(err, files) {
          if (err) {
             // some sort of error
          } else {
             if (!files.length) {
              // root + '/' + fileName,
              fs.rmdir(root, err => {
                if (err) throw err;

                consola.success({
                  message: `Removed empty directory at ${root}/${fileName}`,
                  badge: true
                });

                // fs.rmdir(root, err => {
                //   if (err) throw err;

                //   consola.success({
                //     message: `Removed empty directory at ${root}`,
                //     badge: true
                //   });
                // });
              });
             }
          }
      });


      }
    }
  });
};

exports.ifExist = ifExist;

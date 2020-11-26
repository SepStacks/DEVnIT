var fs = require("fs");
const { throttle } = require('lodash')

    // Check if directory exist
const ifExist = (dir, vueExample) => {
    // attach md file to dir only if the target to delete is the .md file

    fs.stat(vueExample === true ? dir : dir + '.md', (err, stats) => {
        if (err) { console.log(err) } else {
            if (vueExample) {

                fs.rmdir(dir, { recursive: true }, (err) => {
                    if (err) throw err

                    console.log('Code has been')

                    console.log(`${dir} is deleted!`)
                })

            } else {
                fs.unlink(dir + '.md', (err) => {
                    if (err) throw err
                    console.log('file deleted successfully')
                    console.log(dir + '.md')
                })
            }
        }





        })
    }

exports.ifExist = ifExist

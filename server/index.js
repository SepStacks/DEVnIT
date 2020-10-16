var fs = require("fs")

const axios = require('axios')
const path = require('path')


// Get data from the frontend

axios.get('http://localhost:3000/_content/projects')
    .then(response => {

    const pathToContent = path.join(__dirname, '../' + '/content/projects/')
        // place response into a custom object

        markdownData = "---\ntitle: ava\n---\n# Helloo from AVA "

        const process = {
            dir: true,
            title: "ava2",
            slug: "test",
            data: markdownData,
            extension: ".md"
        }

        // If file requires a directory

        if (process.dir === true) {

            //Control exactly the desired directory to create a folder

            fs.mkdir(pathToContent + process.title, (err) => {
                if (err) {
                    return console.error(err)
                }

                console.log('Directory created successfully!')
            })
        }

        const check = process.dir === true ? process.title + "/" + process.slug + process.extension : process.slug + process.extension

        fs.writeFile(pathToContent + check  , process.data, (err) => {

            // If there is any error in writing to the file, return

            if (err) {
                console.error(err)
                return
            }

            // Log this message if the file was written to successfully
            console.log('wrote to file successfully')
        })

    })
    .catch(error => {
        console.log(error)
    })
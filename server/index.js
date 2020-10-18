var fs = require("fs")
const express = require('express')
// Just for fancy logging
const consola = require('consola')

const path = require('path')
const app = express()
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 4000


console.log("Hello from node")

const server = app.listen(port, host)
const io = require('socket.io').listen(server)
app.set('port', port)


io.on('connection', (socket) => {
  console.log(socket.id)
  console.log("Hooray!")

  // the name properties references the emit that takes place on the frotnend
  // content is the data that is being generated from the frontend

  socket.on('properties', (content) => {

    const pathToContent = path.join(__dirname, '../' + '/content/projects/')

    // If file requires a directory

    if (content.type === 'project') {

      //Create a folder within content/projects

      fs.mkdir(pathToContent + content.title, (err) => {
        if (err) {
          return console.error(err)
        }

          console.log('Directory created successfully!')

          //create the index file
          // Markdown data is within content.markdownData

          fs.writeFile(pathToContent + content.title + "/" + content.slug + content.extention, content.markdownData, (err) => {

              if (err) {

                  return err
              }

              // Log this message if the file was written to successfully
              console.log('File successfully created')
          })
      })


    }


    //Wip???
    if (content.type === 'component') {
      //Check if project directory exist

      if (fs.existsSync(pathToContent + content.parent)) {

      //components should be nested in an existing project
      //?? Component needs data. perhaps some form of slot template that we can somehow use to inject custom data?
        fs.writeFile(pathToContent + content.parent + '/' + content.slug + content.extention, content.data, (err) => {

          if (err) {
            return err
          }

          // Log this message if the file was written to successfully
          console.log('component successfully created')
        })
      }


    }

    // Emit message to frontend
    socket.emit('output', content)

  })

  socket.on('disconnect', () => {
    // Display connection message when pager is disconnected
    console.log('pager disconnected')
  })

})

io.on('connect', (socket) => {
  console.log('socket is connected')

  socket.on('disconnect', () => {

    console.log('Node-Server disconnected')
  })
})



// Get data from the frontend

// axios.get('http://localhost:3000/_content/projects')
//     .then(response => {
//         console.log('Hello from backend')

//     const pathToContent = path.join(__dirname, '../' + '/content/projects/')
//         // place response into a custom object

//         markdownData = "---\ntitle: stephanie\n---\n# Helloo from stephanie "

//         const process = {
//             dir: true,
//             title: "stephanie",
//             slug: "test",
//             data: markdownData,
//             extension: ".md"
//         }

//         // If file requires a directory

//         if (process.dir === true) {

//             //Control exactly the desired directory to create a folder

//             fs.mkdir(pathToContent + process.title, (err) => {
//                 if (err) {
//                     return console.error(err)
//                 }

//                 console.log('Directory created successfully!')
//             })
//         }

//         // Check if project is a directory. If Successful, generate an md file within said directory

//         const check = process.dir === true ? process.title + "/" + process.slug + process.extension : process.slug + process.extension

//         fs.writeFile(pathToContent + check  , process.data, (err) => {

//             // If there is any error in writing to the file, return

//             if (err) {
//                 console.error(err)
//                 return
//             }

//             // Log this message if the file was written to successfully
//             console.log('wrote to file successfully')
//         })

//     })
//     .catch(error => {
//         console.log(error)
//     })


// Listen the server

consola.ready({
  message: `QMS-Server listening on http://${host}:${port}`,
  badge: true
})

var fs = require("fs");
const express = require("express");
let { render } = require("mustache");
// Just for fancy logging
const consola = require("consola");
const path = require("path");
const app = express();
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 4000;

const server = app.listen(port, host);
const io = require("socket.io").listen(server);

app.set("port", port);

io.on("connection", socket => {
  // the name properties references the emit that takes place on the frotnend
  // content is the data that is being generated from the frontend

  socket.on("properties", ({ content, modeType }) => {
    //paths
    const pathToContent = path.join(__dirname, "../" + "/content/projects/");
    const templatePath = path.join(__dirname, "../" + "/assets/templates/");
    const globalComponentPath = path.join(
      __dirname,
      "../" + "/components/examples/"
    );

    // check if you are in Create modeType eg: if(content.modeType === 'create') {}
    // If file requires a directory
    if (content.type === "project") {
      if (modeType === "create") {
        //Create a folder within content/projects
        fs.mkdir(pathToContent + content.title, err => {
          if (err) {
            if (err.code === "EEXIST") {
              console.error("myfile already exists");
              return;
            }
            throw err;
          }

          console.log("Directory created successfully!");

          //Get project.md template and inject project variables and generate an index file
          let projTemplate = fs
            .readFileSync(templatePath + "project.md")
            .toString();
          //project template path + content from frontend
          let output = render(projTemplate, content);
          fs.writeFile(
            pathToContent +
              content.title +
              "/" +
              content.slug +
              content.extention,
            output,
            err => {
              if (err) {
                return err;
              }

              // Log this message if the file was written to successfully
              console.log("File successfully created");
            }
          );
        });
      }

      // check if you are in edit modeType eg: if(content.modeType === 'edit') {}
      //edit file

      if (modeType === "edit") {
        const oldDirName = pathToContent + content.parent;
        const newDirName = pathToContent + content.title;

        /* Function is syncronous because I want the folder to be renamed and only continue
        once that hascompleted */

        if (fs.existsSync(oldDirName)) {
          console.log("This folder exists woooh!!");

          // rename the directory
          try {
            fs.renameSync(oldDirName, newDirName);
            //create new index file from template

            //Get project.md template and inject project variables and generate an index file
            let projTemplate = fs
              .readFileSync(templatePath + "project.md")
              .toString();
            //project template path + content from frontend
            let output = render(projTemplate, content);
            fs.writeFile(
              pathToContent +
                content.title +
                "/" +
                content.slug +
                content.extention,
              output,
              err => {
                if (err) {
                  return err;
                }

                // Log this message if the file was written to successfully
                console.log("File renamed successfully!");
              }
            );
          } catch (err) {
            console.log(err);
          }
        }
      }
    }

    //Component Generation

    if (content.type === "component") {
      if (modeType === "create") {
        //Check if project directory exist

        // component.md template with variables for custom files
        let compTemplate = fs
          .readFileSync(templatePath + "component.md")
          .toString();
        let vueCompTemplate = fs
          .readFileSync(templatePath + "vueCompTemplate.js")
          .toString();
        // let jsCompTemplate = fs.readFileSync(templatePath + 'JSCompRegister.js').toString()

        //content is needed as it has access to the variable content the templates needs
        let output = render(compTemplate, content);

        //components should be nested in an existing project
        fs.writeFile(
          pathToContent +
            content.parent +
            "/" +
            content.slug +
            content.extention,
          output,
          { recursive: true },
          err => {
            if (err) {
              return err;
            }

            // Log this message if the file was written to successfully
            console.log("component successfully created");
          }
        );

        const examplePath =
          globalComponentPath + content.parent + "/" + content.slug;
        // Creates /parent/slug/apple, regardless of whether `/parent` and /parent/slug exist.

        fs.mkdir(examplePath, { recursive: true }, err => {
          if (err) {
            if (err.code === "EEXIST") {
              console.error("myfile already exists");
              return;
            }
            throw err;
          }
          //Create folder with slug name

          // Create a vue component and inject values from frontend through the content variable
          let vueOutput = render(vueCompTemplate, content);

          fs.writeFile(
            examplePath + "/" + content.parent + '_' + content.slug + "-usage" + ".vue",
            vueOutput,
            err => {
              if (err) {
                return err;
              }
            }
          );
        });
      }

      if (modeType === "edit") {
        const oldPath = pathToContent + content.slug;
        const newPath = pathToContent + content.slug;

        fs.rename(oldPath, newPath, function(err) {
          if (err) console.log("ERROR: " + err);
        });
      }
    }

    // Emit message to frontend
    socket.emit("output", content);

    socket.on("disconnect", () => {
    });
  });

  io.on("connect", socket => {
    console.log("socket is connected");

    socket.on("disconnect", () => {
      console.log("Node-Server disconnected");
    });
  });
});
// Listen the server

consola.ready({
  message: `Node-Server listening on http://${host}:${port}`,
  badge: true
});

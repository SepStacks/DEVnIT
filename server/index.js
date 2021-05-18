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
const removeDir = require("./remove");
const generate = require("./component");

app.set("port", port);

io.on("connection", socket => {
  //paths
  const pathToContent = path.join(__dirname, "../" + "/content/projects/");
  const templatePath = path.join(__dirname, "../" + "/assets/templates/");
  const globalComponentPath = path.join(
    __dirname,
    "../" + "/components/examples/"
  );
  // create project folder

  fs.promises
    .access(pathToContent)
    .then(() => {
      // It exists
    })
    .catch(() => {
      // It doesn't exist
      fs.mkdir(pathToContent, err => {
        if (err) {
          throw err;
        }
        console.log("Directory created successfully!");
      });
    });

  // the name properties references the emit that takes place on the frotnend
  // content is the data that is being generated from the frontend

  socket.on("properties", ({ content, modeType }) => {
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
    else if (content.type === "component") {
      if (modeType === "create") {
        //parent-component creation
        generate.component(
          content,
          templatePath,
          globalComponentPath,
          pathToContent
        );
      }
    } else if (content.type === "childComponent") {
      console.log("this is running yay!!");
      //child-component creation
      generate.component(
        content,
        templatePath,
        globalComponentPath,
        pathToContent
      );
    }

    if (modeType === "edit") {
      // Proceed to generate new version of component
      generate.component(
        content,
        templatePath,
        globalComponentPath,
        pathToContent
      );
    }
    // Emit message to frontend
    socket.emit("output", content);

    socket.on("disconnect", () => {
      // Remove all listeners when socket-connection disconnects
      socket.removeAllListeners();
    });
  });

  socket.on("deleteProperty", ({ content }) => {
    if (content.type === "project") {
      const dirProject = path.join(
        __dirname,
        "../" + `/components/examples/${content.parent}`
      );
      const dirProjectSlug = path.join(
        __dirname,
        "../" + `/content/projects/${content.parent}`
      );
      const root = dirProject;
      const rootSlug = dirProjectSlug;

      // Delete Function for project

      // Delete project dir and its components
      removeDir.ifExist(root, dirProject, true);

      // Delete project content and its pages
      removeDir.ifExist(rootSlug, dirProjectSlug, true);
    } else {
      if (content.type === "component") {
        // Delete Function for component0

        // directory path
        //use old parent variable incase project name has been changed
        const dirComponent = path.join(
          __dirname,
          "../" + `/components/examples/${content.parent}`
        );
        const dirSlug = path.join(
          __dirname,
          "../" + `/content/${content.path}`
        );
        const root = dirComponent;
        // add seperately a function that would also remove an eddited project component
        // delete directory recursively
        removeDir.ifExist(root, dirComponent, false);

        removeDir.ifExist(root, dirSlug, false, ".md");
      } else {
        // Delete Function for component0

        // directory path
        //use old parent variable incase project name has been changed
        const dirComponent = path.join(
          __dirname,
          "../" +
            `/components/examples/${content.parent}/${content.parentComponent}/${content.parent}_${content.slug}`
        );
        const dirSlug = path.join(
          __dirname,
          "../" +
            `/content/projects/${content.parent}/child/${content.parentComponent}/${content.slug}`
        );
        const rootContent = path.join(
          __dirname,
          "../" +
            `/content/projects/${content.parent}/child`
        );
        const root = path.join(
          __dirname,
          "../" +
            `/components/examples/${content.parent}/${content.parentComponent}`
        );
        // add seperately a function that would also remove an eddited project component
        // delete directory recursively
        //set to false to remove file set to true to remove directory
        removeDir.ifExist(root, dirComponent, false, ".vue" );

        removeDir.ifExist(rootContent, dirSlug, false, ".md", content.parentComponent);
      }
    }
  });
});
// Listen the server

consola.ready({
  message: `Node-Server listening on http://${host}:${port}`,
  badge: true
});

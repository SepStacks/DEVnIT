var fs = require("fs");
let { render } = require("mustache");
const consola = require("consola");

const component = (
  content,
  templatePath,
  globalComponentPath,
  pathToContent
) => {
  //Check if project directory exist

  // component.md template with variables for custom files
  let compTemplate = fs.readFileSync(templatePath + "component.md").toString();
  let vueCompTemplate = fs
    .readFileSync(templatePath + "vueCompTemplate.js")
    .toString();
  // let jsCompTemplate = fs.readFileSync(templatePath + 'JSCompRegister.js').toString()

  //content is needed as it has access to the variable content the templates needs
  let output = render(compTemplate, content);
  //change component directory path based on content type
  // const componentDir =
  //   content.type === "component"
  //     ? pathToContent + content.parent + "/" + content.slug
  //     : pathToContent +
  //       content.parent +
  //       "/" +
  //       content.parentComponent;

        const nestedDir = pathToContent + content.parent +  "/" + "child"
  //markdown child pages should be nested in an existing project

  //nested md dir might not exist so it needs to be created
  if (content.type === "childComponent") {
    fs.mkdir(nestedDir, { recursive: true }, err => {
      if (err) {
        if (err.code === "EEXIST") {
          console.error("directory already exists");
          return;
        }
        throw err;
      }
      //add another directly seperating each child by parentComponent
      fs.mkdir(nestedDir + `/${content.parentComponent}`, { recursive: true }, err => {
        if (err) {
          if (err.code === "EEXIST") {
            console.error("directory already exists");
            return;
          }
          throw err;
        }
        fs.writeFile(
          //within projects/child/slug/
          nestedDir + `/${content.parentComponent}` + "/" + content.slug + content.extention,
          output,
          { recursive: true },
          err => {
            if (err) {
              consola.error(new Error("Failed to create component"));
              return err;
            }

            // Log this message if the file was written to successfully
            consola.success("component successfully created");
          }
        );
      })

    });


  }

  if(content.type === "component") {
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
                consola.error(new Error('Failed to create component'))
                return err
            }
            // Log this message if the file was written to successfully
            consola.success("component successfully created")
        }
    )
  }

  // Slug will change for nested components so an if statement is needed for this to check if its parent or children
  // both Parent and child vueComponents has to be nested in the same directory
  let pathToComponent = globalComponentPath + content.parent;
  const examplePath =
    content.type === "component"
      ? pathToComponent + "/" + content.slug
      : pathToComponent + "/" + content.parentComponent;
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
    // Renders the template with the given view and partials using the default writer.
    let vueOutput = render(vueCompTemplate, content);
    let parentComponentProjectDir =
      examplePath +
      "/" +
      content.parent +
      "_" +
      content.slug +
      "-usage" +
      ".vue";

    let nestedComponentProjectDir =
      examplePath + "/" + content.parent + "_" + content.slug + ".vue";

      //check if component type is parent or child
    const generatedComponent =
      content.type === "component"
        ? parentComponentProjectDir
        : nestedComponentProjectDir;

    fs.writeFile(generatedComponent, vueOutput, err => {
      if (err) {
        return err;
      }
    });
  });
};

exports.component = component;

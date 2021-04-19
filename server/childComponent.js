var fs = require("fs");
let { render } = require("mustache");
const consola = require("consola");

const generate = ({
  content,
  templatePath,
  globalComponentPath,
  pathToContent
}) => {
  console.log("hello");
  let vueCompTemplate = fs
    .readFileSync(templatePath + "vueCompTemplate.js")
    .toString();

  //get data from content and append it to parent component
  //available content
  const data = {
    title: `${content.title}`,
    parent: content.parent,
    slug: content.slug,
    description: content.description,
    prefix: content.prefix,
    parentComponent: content.parentComponent,
    extention: content.extention,
    content: `<doc-component :file="'${content.parent}/${content.parentComponent}/${content.parent}_${content.slug}'" :name="'${content.title}'"></doc-component>`
  };
  let path =
    pathToContent + data.parent + "/" + data.parentComponent + data.extention;

  const template =
    "\n" +
    "\n" +
    "## " +
    data.title +
    "\n" +
    "\n" +
    data.description +
    "\n" +
    "\n" +
    data.content;

  fs.appendFile(path, template, { flags: "a+" }, function(err) {
    if (err) throw err;
  });

  //examplePath should be /components/examples/projectName/parentComponent/

  const examplePath =
    globalComponentPath + content.parent + "/" + content.parentComponent;
  // Creates /parent/slug/apple, regardless of whether `/parent` and /parent/slug exist.
  let vueOutput = render(vueCompTemplate, content);

  //child component example name would be TEST_alert-outlined.vue
  fs.writeFile(
    examplePath + "/" + content.parent + "_" + content.slug + ".vue",
    vueOutput,
    err => {
      if (err) {
        return err;
      }
    }
  );
  //   fs.mkdir(examplePath, { recursive: true }, err => {
  //     if (err) {
  //       if (err.code === "EEXIST") {
  //         console.error("myfile already exists");
  //         return;
  //       }
  //       throw err;
  //     }
  //     //Create folder with slug name

  //     // Create a vue component and inject values from frontend through the content variable
  //     // Renders the template with the given view and partials using the default writer.

  //   });
};

exports.generate = generate;

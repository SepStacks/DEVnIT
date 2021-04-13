var fs = require("fs");
let { render } = require("mustache");
const consola = require("consola")

const component = (content, templatePath, globalComponentPath, pathToContent ) => {
    //Check if project directory exist

    // component.md template with variables for custom files
    let compTemplate = fs
        .readFileSync(templatePath + "component.md")
        .toString()
    let vueCompTemplate = fs
        .readFileSync(templatePath + "vueCompTemplate.js")
        .toString()
    // let jsCompTemplate = fs.readFileSync(templatePath + 'JSCompRegister.js').toString()

    //content is needed as it has access to the variable content the templates needs
    let output = render(compTemplate, content)

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

    const examplePath =
        globalComponentPath + content.parent + "/" + content.slug
    // Creates /parent/slug/apple, regardless of whether `/parent` and /parent/slug exist.

    fs.mkdir(examplePath, { recursive: true }, err => {
        if (err) {
            if (err.code === "EEXIST") {
                console.error("myfile already exists")
                return
            }
            throw err
        }
        //Create folder with slug name

        // Create a vue component and inject values from frontend through the content variable
        // Renders the template with the given view and partials using the default writer.
        let vueOutput = render(vueCompTemplate, content)

        fs.writeFile(
            examplePath + "/" + content.parent + '_' + content.slug + "-usage" + ".vue",
            vueOutput,
            err => {
                if (err) {
                    return err
                }
            }
        )
    })
}

exports.component = component

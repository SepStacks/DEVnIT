var fs = require("fs")
let { render } = require("mustache")

const createVueTemp = (dir, templatePath, content) => {

    let vueCompTemplate = fs
        .readFileSync(templatePath + "vueCompTemplate.js")
        .toString()

    return new Promise((resolve, reject) => {



            //generate tmp file
        fs.mkdir(dir, { recursive: true }, err => {
            if (err) {
                if (err.code === "EEXIST") {
                    console.error("myfile already exists")
                    return
                }
                throw err
            }

            //If content.html is empty generate the default markup

                // Create a vue component and inject values from frontend through the content variable
                let vueOutput = render(vueCompTemplate, content)

                fs.writeFile(
                    dir + "vueDemo.vue",
                    vueOutput,
                    err => {
                        if (err) {
                            return err
                        }
                    }
                )
                console.log(resolve)


                console.log("Directory created successfully!")
            })


    })
}

exports.createVueTemp = createVueTemp


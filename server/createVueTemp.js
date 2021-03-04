var fs = require("fs")
let { render } = require("mustache")

const createVueTemp = (dir, templatePath, content) => {

    let vueCompTemplate = fs.readFileSync(templatePath + "vueCompTemplate.js").toString()

    //generate tmp file
    try {
        fs.mkdir(dir, err => {console.log(err)})

    } catch {

        console.log(`${dir} already exists`)

    }

    //If content.html is empty generate the default markup

    // Create a vue component and inject values from frontend through the content variable
    let vueOutput = render(vueCompTemplate, content)

    try {

        fs.unlink(dir + "vueDemo.vue", err => { console.log(err) })

    } catch (error) {
        console.log('error from fsumlink')

        console.log(error)

    }

    fs.writeFile(dir + "vueDemo.vue", vueOutput, err => { console.log(err) })

    console.log("Directory created successfully!")

}


exports.createVueTemp = createVueTemp


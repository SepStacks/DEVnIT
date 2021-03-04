
//implementation of import() which does work with external resources.

export default async function externalComponent (url) {
    const name = url.split('/').reverse()[0].match(/^(.*?)\.umd/)[1]

    if (window[name]) return window[name]

    window[name] = new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.async = true
        script.addEventListener('load', () => {
            resolve(window[name])
        })
        script.addEventListener('error', () => {
            reject(new Error(`Error loading ${url}`))
        })
        script.src = url
        document.head.appendChild(script)
    })

    return window[name]


    //sample importing external component
 /*   import externalComponent from '../utils/external-component'

    const MyComponent = () => externalComponent('http://localhost:8200/MyComponent/MyComponent.c9c0abb8e999d0e5654e.umd.min.js')

    export default {
        name: 'MyOtherComponent',
        components: {
            MyComponent,
        },
        // ...
    }

    */

}
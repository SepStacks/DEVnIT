<template>
<div>

    <v-container>
        <p v-if="isConnected">We're connected to the server!</p>
        <p v-else>NODE-SERVER OFFLINE</p>

        <v-form ref="form">

            <v-radio-group v-model="type" row>
                <v-radio label="create new project" value="project"></v-radio>

                <v-radio label="create component" value="component"></v-radio>
            </v-radio-group>

            <div v-if="type === 'component'">
                <!-- This value needs to be exported as a prop and get the project titles array -->
                <v-select :items="items" label="Select project"></v-select>
            </div>
            <v-text-field v-model="title" label="title"></v-text-field>
            <v-text-field v-model="slug" label="component name"></v-text-field>

            <v-btn @click="emitToServer">
                Submit
            </v-btn>
            <div>Socket Result:</div>
            {{response}}
        </v-form>
    </v-container>

</div>
</template>

<script>
export default {
    data() {
        return {
            items: ['item1', 'item2'],
            response: '',
            msg: 'Hello from client',
            isConnected: false,
            title: '',
            slug: '',
            extention: '.md',
            type: "project",

        }
    },

    computed: {

        content() {
            return {

            }
        }

    },

    sockets: {

        // Fired when the socket connects.

        connect() {
            this.isConnected = true;
            console.log('QMS-SERVER is connected')

        },
        disconnect() {
            this.isConnected = false;
        },
        output(data) {
            // this method was fired by the socket server. eg: io.emit("output", content)'
            return this.response = data
            console.log(data)
            console.log('this method was fired by the socket server. eg: io.emit("output", content)')
        },

    },

    methods: {

        emitToServer() {

            const content = {

                title: this.title,
                slug: this.slug,
                extention: this.extention,
                type: this.type,
                markdownData: `---\ntitle: ${this.title}\n---\n# Helloo from  ${this.title}`
            }

            this.$socket.client.emit("properties", content)
            console.log(this.content)
        },

    }

}
</script>

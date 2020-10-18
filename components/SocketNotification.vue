<template>
<div>

    <v-container>
        <v-form ref="form" v-model="isFormValid">
            <v-radio-group v-model="type" row v-if="projects.length > 0">
                <v-radio name="Project" label="create new project" value="project"></v-radio>
                <v-radio @change="reset" name="Component" label="create new component" value="component"></v-radio>
            </v-radio-group>

            <div v-if="type === 'project'">
                <v-text-field v-model="title" :rules="rules" label="title" required></v-text-field>
                <v-text-field persistent-hint hint="component name for project should always be index" readonly v-model="slug" :value="slug ='index'" label="component name"></v-text-field>
            </div>

            <div v-if="type === 'component'">
                <!-- This items value needs to be exported as a prop and get the project titles array -->
                <v-select :items="projects" v-model="parent" item-text="title" label="Select project"></v-select>
                <v-text-field v-model="slug" label="component name"></v-text-field>

            </div>

            <div class="mt-5">
                <v-btn @click="emitToServer" :disabled="!isFormValid">
                    Submit
                </v-btn>

                <v-btn to="/projects" v-if="projects.length > 0">Go to projects</v-btn>
            </div>

            <div class="mt-5">Socket Result from node.js:</div>
            <v-sheet>
                <v-card-text>
                    <!-- just some details the backend is sending back -->
                    {{response}}
                </v-card-text>
            </v-sheet>
        </v-form>
    </v-container>

</div>
</template>

<script>
export default {

    props: {
        projects: {
            type: Array,
        }
    },

    data() {
        return {
            isFormValid: false,
            response: '',
            isConnected: false,
            rules: [
                value => !!value || 'Required.',
                value => !this.checkIfExist || 'Name already exists'
            ],

            title: '',
            slug: '',
            extention: '.md',
            type: "project",
            parent: '',
            data: '<data-component></data-component>'

        }
    },

    computed: {
        //check if project title exist

        checkIfExist() {
            return this.projects.includes(this.title)

        }

    },

    sockets: {

        // Fired when the socket connects.
        connect() {
            this.isConnected = true;
            console.log('NODE-SERVER is connected')

        },
        disconnect() {
            this.isConnected = false;
        },
        output(data) {
            // This method was fired by the node-server. eg: io.emit("output", content)'
            return this.$notifier.showMessage({
                content: 'new ' + `<strong>${data.type}</strong>` + ' has been created',
                color: "success",
            });

        },

    },

    methods: {

        emitToServer() {

            const content = {

                title: this.title,
                slug: this.slug,
                extention: this.extention,
                type: this.type,
                parent: this.parent,
                data: this.data,
                markdownData: `---\ntitle: ${this.title}\n---\n# Helloo from  ${this.title}`
            }

            this.$socket.client.emit("properties", content)
            console.log(this.content)

            this.title = ''
            this.$refs.form.resetValidation()

        },

        reset() {
            this.$refs.form.reset()
        },

    }

}
</script>

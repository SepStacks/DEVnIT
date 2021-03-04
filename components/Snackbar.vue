<template>
<v-snackbar top right v-model="show" color="white" class="pa-2 mt-5">
    <v-row align="center" justify="center">
        <v-row align="center" justify="center">
            <v-sheet class="rounded-r-xl ml-2 pa-2" width="70px" v-ripple :color="color" tile>
                <v-row align="center" justify="center">
                    <v-icon color="white" size="25">la-check-circle</v-icon>
                </v-row>
            </v-sheet>

            <v-col>
                <div class="primary--text" v-html="message" />
            </v-col>
                <v-btn icon color="info" @click="show = false">
                    <v-icon>
                       la-close
                    </v-icon>
                </v-btn>
            </div>
        </v-row>
    </v-row>
</v-snackbar>
</template>

<script>
export default {
    data() {
        return {
            show: false,
            message: '',
            color: '',
            snackIcon: ''
        }
    },

    created() {
        this.$store.subscribe((mutation, state) => {
            if (mutation.type === 'snackbar/showMessage') {
                this.message = state.snackbar.content
                this.color = state.snackbar.color
                this.snackIcon = state.snackbar.snackIcon
                this.show = true
            }
        })
    }
}
</script>

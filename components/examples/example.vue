<template>
    <div class="red--text">

        <div>component</div>
        <div>{{message}}</div>
    </div>
</template>

<script>
    export default {
        name: 'example',
        data() {
            return {
                message: 'hello from component',
            }
        }

    }
</script>

<style lang="scss" scoped>

</style>
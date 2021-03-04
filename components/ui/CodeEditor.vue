<template>
    <div>
        <pre id="editor">
            <code class="language-javascript" id="editor-code"></code>
            <textarea id="editor-content"></textarea>
        </pre>
    </div>
</template>

<script>
    export default {

    }
</script>

<style scoped>
#editor {
    position: relative;
}
#editor-content {
    position: absolute;
    top: 1em;
    left: 1em;
    right: 1em;
    bottom: 1em;
    opacity: 0;
    width: calc(100% - 2em);
    height: calc(100% - 2em);
    -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
     box-sizing: border-box;
}
</style>
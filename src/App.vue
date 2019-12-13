<template>
    <div id="app">
        <img src="./assets/logo.png">
        <div>
            <p>
                If Element is successfully added to this project, you'll see an
                <code v-text="'<el-button>'"></code>
                below
            </p>
            <el-button>el-button</el-button>
        </div>
        <HelloWorld msg="Welcome to Your Vue.js App" />
        <div class="flex">
            123
        </div>
    </div>
</template>

<script>

export default {
    name: 'App',
    mounted() {
        console.log([1, 2, 3].includes(1));
    }
};
</script>

<style scoped lang="less">
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: @primary;
    margin-top: 60px;
}

.flex {
    display: flex;
}
</style>

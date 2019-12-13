<template>
    <div class="home">
        <img
            alt="Vue logo"
            src="../assets/logo.png">
        <HelloWorld msg="Welcome" />
    </div>
</template>

<script>

export default {
    name: 'Home',
    mounted() {
        console.log(123);
        this.axios.get('https://baidu.com');
    }
};
</script>

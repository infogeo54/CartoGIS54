<template>
    <div id="form">

    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: "Form",
        computed: {
            ...mapGetters({
                feature: 'feature/selected'
            })
        }

    }
</script>

<style scoped>

</style>
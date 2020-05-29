<template>
    <p class="layer-item" @click="clicked">{{ title }}</p>
</template>

<script>
    export default {
        name: "CategoriesItem",
        props: ['layer'],
        computed: {
            name: function () {
                return this.layer.properties.name
            },
            title: function () {
                return this.layer.properties.title
            }
        },
        methods: {
            clicked: function () {
                this.$emit('itemClicked', this.name)
            }
        }
    }
</script>

<style scoped>

</style>
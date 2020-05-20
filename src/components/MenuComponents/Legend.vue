<template>
    <div id="legend">
        <h3>{{ title }}</h3>
        <LegendItem v-for="(style, index) in styles"
                    :key="index"
                    :feature-style="style"
                    @itemClicked="itemClicked"></LegendItem>
    </div>
</template>

<script>
    import LegendItem from './LegendItem'

    export default {
        name: "Legend",
        props: ['layer'],
        computed: {
            title: function () {
                return this.layer.properties.title
            },
            styles: function () {
                return this.layer.styles
            }
        },
        methods: {
            itemClicked: function (featureType) {
                this.$emit('legendItemClicked', featureType)
            }


        },
        components: {
            LegendItem
        }
    }
</script>

<style lang="sass" scoped>

</style>

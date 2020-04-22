<template>
    <div id="legend">
        <h3>{{ title }}</h3>
        <LegendItem v-for="(style, index) in layer.styles"
                    :key="index"
                    :feature-style="style"
                    @clicked="onClick"></LegendItem>
    </div>
</template>

<script>
    import LegendItem from './LegendItem'
    import {mapActions} from 'vuex'
    export default {
        name: "Legend",
        props: ['layer'],
        computed: {
            title: function() {
                return this.layer.Title._text
            },
            name: function () {
                return this.layer.Name._text
            }
        },
        methods: {
            ...mapActions('feature', ['getSchema']),
            /**
             * Call getSchema
             */
            onClick: function (styleName) {
                const params = {
                    layer: this.name,
                    style: styleName
                }
                this.getSchema(params)
            }
        },
        components: {
            LegendItem
        }
    }
</script>

<style lang="sass" scoped>

</style>

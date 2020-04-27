<template>
    <div id="legend">
        <h3>{{ layerTitle }}</h3>
        <LegendItem v-for="(style, index) in layer.styles"
                    :key="index"
                    :feature-style="style"
                    @clicked="onClick"></LegendItem>
    </div>
</template>

<script>
    import LegendItem from './LegendItem'
    import {mapMutations,mapActions} from 'vuex'
    export default {
        name: "Legend",
        props: ['layer'],
        computed: {
            layerTitle: function() {
                return this.layer['Title']['_text']
            },
            layerName: function () {
                return this.layer['Name']['_text']
            }
        },
        methods: {
            ...mapMutations('map', ['setEditing']),
            ...mapActions('feature', ['getSchema']),
            /**
             * Call getSchema
             */
            onClick: function (styleName) {
                const params = {
                    layer: this.layerName,
                    style: styleName
                }
                this.getSchema(params)
                this.setEditing(true)
            }
        },
        components: {
            LegendItem
        }
    }
</script>

<style lang="sass" scoped>

</style>

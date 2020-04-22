<template>
    <div id="legend">
        <h3>{{ layerTitle }}</h3>
        <ul>
            <li v-for="(style, index) in layer.styles"
                :key="index"
                @click="onClick"
            >
                <img :src="getStyleIcon(style)" :alt="getStyleName(style)">
                <h4>{{ getStyleName(style) }}</h4>
            </li>
        </ul>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    export default {
        name: "Legend",
        props: ['layer'],
        computed: {
            layerTitle: function() {
                return this.layer.Title._text
            },
            layerName: function () {
                return this.layer.Name._text
            }
        },
        methods: {
            ...mapActions('feature', ['getSchema']),
            /**
             * Get the name of a style
             */
            getStyleName: function(style) {
                return style['se:Name']['_text']
            },
            /**
             * Get a style's corresponding icon
             */
            getStyleIcon: function(style) {
                const name = this.getStyleName(style).toLowerCase()
                let icon
                try {
                    icon = require(`../assets/icons/${name}.svg`)
                } catch (e) {
                    icon = require('../assets/icons/poi.svg')
                }
                return icon
            },
            /**
             * Call getSchema
             */
            onClick: function () {
                this.getSchema(this.layerName)
            }
        }
    }
</script>

<style lang="sass" scoped>
    #legend
        ul
            padding: 0
            li
                list-style: none
                h4
                    font-weight: normal
                    margin: 0
                img
                    max-width: 64px
                    height: auto
</style>

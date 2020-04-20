<template>
    <div id="legend">
        <h3>{{ layerName }}</h3>
        <ul>
            <li v-for="(style, index) in layer.styles" :key="index">
                <img :src="getStyleIcon(style)" :alt="getStyleName(style)">
                <h4>{{ getStyleName(style) }}</h4>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "Legend",
        props: ['layer'],
        computed: {
            layerName: function() {
                return this.layer.Title._text
            }
        },
        methods: {
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

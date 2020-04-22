<template>
    <div class="legend-item" @click="onClick">
        <img :src="icon" :alt="name">
        <h4>{{ name }}</h4>
    </div>
</template>

<script>
    export default {
        name: "LegendItem",
        props: ['featureStyle'],
        computed: {
            name: function () {
                return this.featureStyle['se:Name']['_text']
            },
            icon: function () {
                const name = this.name.toLowerCase()
                let icon
                try {
                    icon = require(`@/assets/icons/${name}.svg`)
                } catch (e) {
                    icon = require('@/assets/icons/poi.svg')
                }
                return icon
            }
        },
        methods: {
            onClick: function () {
                this.$emit('clicked', this.name.toLowerCase())
            }
        }
    }
</script>

<style lang="sass" scoped>
    .legend-item
        img
            max-width: 64px
            height: auto
        h4
            font-weight: normal
            margin: 0
</style>
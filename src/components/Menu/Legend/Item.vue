<template>
    <div class="legend-item" @click="clicked">
        <img :src="icon" :alt="name">
        <h4>{{ title }}</h4>
    </div>
</template>

<script>
export default {
    name: "LegendItem",
    props: {
        featureStyle: {
            type: Object,
            default: null
        }
    },
    computed: {
        title: function() {
            return this.featureStyle['se:Name']['_text']
        },
        name: function () {
            return this.title.toLowerCase()
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
        clicked: function () {
            this.$emit('itemClicked', this.name)
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
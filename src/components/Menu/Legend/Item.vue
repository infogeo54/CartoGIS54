<template>
    <div class="legend-item">
        <img :src="icon" :alt="literal" @click="clicked">
        <p>{{ title }}</p>
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
        literal: function () {
            return this.featureStyle['ogc:Filter']['ogc:PropertyIsEqualTo']['ogc:Literal']['_text']
        },
        icon: function () {
            let icon
            try {
                icon = require(`@/assets/icons/${this.literal}.svg`)
            } catch (e) {
                icon = require('@/assets/icons/poi.svg')
            }
            return icon
        }
    },
    methods: {
        clicked: function () {
            this.$emit('itemClicked', this.literal)
        }
    }
}
</script>

<style lang="sass" scoped>
    .legend-item
        margin-bottom: 10p
        img
            max-width: 64px
            height: auto
            &:hover
                cursor: pointer
        p
            margin: auto
</style>
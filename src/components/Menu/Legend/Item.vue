<template>
    <div class="legend-item">
        <img :src="icon" :alt="name" @click="clicked">
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
        margin-bottom: 10px
        img
            max-width: 64px
            height: auto
            &:hover
                cursor: pointer
        p
            width: fit-content
            margin: auto
</style>
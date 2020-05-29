<template>
    <div id="legend">
        <h3>{{ title }}</h3>
        <Item v-for="(style, index) in styles"
              :key="index"
              :feature-style="style"
              @itemClicked="itemClicked"
        />
    </div>
</template>

<script>
import Item from './Item'

export default {
    name: "Legend",
    components: {
        Item
    },
    props: {
        layer: {
            type: Object,
            default: null
        }
    },
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


    }
}
</script>

<style lang="sass" scoped>

</style>

<template>
    <div id="legend">
        <h3>{{ layer.title }}</h3>
        <LegendItem v-for="(style, index) in layer.styles"
                    :key="index"
                    :feature-style="style"
                    @clicked="onClick"></LegendItem>
    </div>
</template>

<script>
    import LegendItem from './LegendItem'
    import {mapGetters,mapMutations} from 'vuex'

    export default {
        name: "Legend",
        computed: {
            ...mapGetters('layer', {
                layer: 'selected'
            })
        },
        methods: {
            ...mapMutations('map', ['setEditing']),
            ...mapMutations('feature', ['setType']),
            /**
             * Creating new Feature & Entering Editing mode
             */
            onClick: async function (type) {
                this.setEditing(true)
                this.setType(type)
            }
        },
        components: {
            LegendItem
        }
    }
</script>

<style lang="sass" scoped>

</style>

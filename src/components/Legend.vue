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
    import Feature from '../models/Feature'

    export default {
        name: "Legend",
        computed: {
            ...mapGetters('layer', {
                layer: 'selected'
            })
        },
        methods: {
            ...mapMutations('map', ['setEditing']),
            ...mapMutations('feature', ['setSelected']),
            /**
             * Creating new Feature & Entering Editing mode
             */
            onClick: async function (typeName) {
                const f = new Feature()
                await f.getDescription(this.layer.name, typeName)
                this.setSelected(f)
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

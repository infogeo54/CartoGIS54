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
    //import Feature from '../models/Feature'
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
            ...mapMutations('feature', ['setSelected']),
            /**
             * Creating new Feature & Entering Editing mode
             * Récupérer la description
             * Créer une nouvelle feature
             * La stocker dans le store
             */
        },
        components: {
            LegendItem
        }
    }
</script>

<style lang="sass" scoped>

</style>

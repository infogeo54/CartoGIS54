<template>
    <div id="legend">
        <h3>{{ title }}</h3>
        <LegendItem v-for="(style, index) in layer.styles"
                    :key="index"
                    :feature-style="style"
                    @clicked="onClick"></LegendItem>
    </div>
</template>

<script>
    import LegendItem from './LegendItem'
    import {mapGetters,mapMutations,mapActions} from 'vuex'
    export default {
        name: "Legend",
        computed: {
            ...mapGetters('layer', {
                layer: 'selected',
                name: 'selectedName',
                title: 'selectedTitle'
            })
        },
        methods: {
            ...mapMutations('map', ['setEditing']),
            ...mapActions('feature', ['getSchema']),
            /**
             * Call getSchema
             */
            onClick: function (styleName) {
                const params = {
                    layer: this.name,
                    style: styleName
                }
                this.getSchema(params)
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

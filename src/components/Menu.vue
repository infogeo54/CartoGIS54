<template>
    <div id="menu">
        <div id="categories">
            <h3>Catégories</h3>
            <ul>
                <li v-for="(layer, index) in layers" :key="index">{{ getTitle(layer) }}</li>
            </ul>
        </div>
        <Legend></Legend>
    </div>
</template>

<script>
    import Legend from './Legend'
    import {mapGetters} from 'vuex'
    export default {
        name: "Menu",
        computed: {
            ...mapGetters({
                layers: 'layer/list'
            })
        },
        methods: {
            getTitle: function (layer) {
                return layer.Title._text
            }
        },
        components: {
            Legend
        },
    }
</script>

<style lang="sass" scoped>
    #menu
        text-align: center
        width: 18%
        ul
            padding: 0
            li
                list-style: none
                &:hover
                    text-decoration: underline
                    cursor: pointer

</style>
<template>
    <div id="menu" :class="selectedLayer ? 'open' : ''">
        <div id="categories">
            <h3>Catégories</h3>
            <ul>
                <li v-for="(layer, index) in layers" :key="index" @click="setSelected(layer)">
                    {{ getTitle(layer) }}
                </li>
            </ul>
        </div>
        <Legend v-if="selectedLayer" :layer="selectedLayer"></Legend>
    </div>
</template>

<script>
    import Legend from './Legend'
    import {mapGetters, mapMutations} from 'vuex'
    export default {
        name: "Menu",
        computed: {
            ...mapGetters({
                layers: 'layer/list',
                selectedLayer: 'layer/selected'
            })
        },
        methods: {
            ...mapMutations('layer', ['setSelected']),
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
        display: flex
        flex-direction: row
        ul
            padding: 0
            li
                list-style: none
                &:hover
                    text-decoration: underline
                    cursor: pointer

</style>

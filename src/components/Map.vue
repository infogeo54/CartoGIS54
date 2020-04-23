<template>
    <div id="map" :style="{cursor: cursor}"></div>
</template>

<script>
    import L from 'leaflet'
    import MapTools from '../tools/MapTools'
    import {mapGetters, mapMutations} from 'vuex'
    export default {
        name: "Map",
        data() {
            return {
                map: null
            }
        },
        computed: {
            ...mapGetters({
                layers: 'layer/list',
                editing: 'map/editing',
                coordinates: 'map/coordinates'
            }),
            cursor: function () {
                return this.editing ? 'crosshair' : 'grab'
            }
        },
        methods: {
            ...mapMutations('map', ['setCoordinates']),
            onClick: function (e) {
                console.log(e)
            },
            addToMap: function (feature) {
                const representation = MapTools.representation(feature)
                representation.addTo(this.map)
            },
            init: function (center) {
                this.map = L.map('map').setView(center, 15)
                L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
                    attribution: 'données © OpenStreetMap/ODbL - rendu OSM France',
                    minZoom: 1,
                    maxZoom: 20
                }).addTo(this.map)
                this.layers.forEach(l => {
                    const features = l.entities.features
                    features.forEach(f => {
                        this.addToMap(f)
                    })
                })
                this.map.on('click', e => {
                    if (this.editing) this.onClick(e)
                })
            },
        },
        mounted() {
            this.init([49.305, 5.78])
        }
    }
</script>

<style lang="sass" scoped>
    #map
        height: 100%
        width: 100%
</style>

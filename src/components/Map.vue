<template>
    <div id="map"></div>
</template>

<script>
    import L from 'leaflet'
    import {mapGetters} from 'vuex'
    export default {
        name: "Map",
        data() {
            return {
                map: null
            }
        },
        computed: {
            ...mapGetters({
                layers: 'layer/list'
            })
        },
        methods: {
            addMarker: function () {

            },
            init: function (center) {
                this.map = L.map('map').setView(center, 15)
                L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
                    // Il est toujours bien de laisser le lien vers la source des données
                    attribution: 'données © OpenStreetMap/ODbL - rendu OSM France',
                    minZoom: 1,
                    maxZoom: 20
                }).addTo(this.map)
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
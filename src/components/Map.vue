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
            createMarker: function (coordinates) {
                return L.marker(coordinates.reverse()) // WFS sends reversed coordinates
            },
            createPolygon: function (coordinates) {
                let polygon = coordinates[0][0] // WFS sends an array of reversed coordinates
                let points = []
                for (let p of polygon) {
                    p = p.reverse()
                    points.push(p)
                }
                return L.polygon(points, {fillOpacity: 0.5})
            },
            addToMap: function (feature) {
                let coordinates = feature.geometry.coordinates
                let representation = coordinates.length === 2 ? this.createMarker(coordinates) : this.createPolygon(coordinates)
                representation.bindPopup(`${feature.id}`)
                .addTo(this.map)
            },
            init: function (center) {
                this.map = L.map('map').setView(center, 15)
                L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
                    // Il est toujours bien de laisser le lien vers la source des données
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
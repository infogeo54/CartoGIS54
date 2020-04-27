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
                map: null,
                toInsert: null
            }
        },
        computed: {
            ...mapGetters({
                layers: 'layer/list',
                selectedLayer: 'layer/selected',
                selectedFeature: 'feature/selected',
                editing: 'map/editing',
                coordinates: 'map/coordinates'
            }),
            cursor: function () {
                return this.editing ? 'crosshair' : 'grab'
            },
            representations: function () {
                const res = this.layers.map(l => {
                    const features = l.features
                    return features.map(f =>
                        MapTools.representation(f).on('click', () => this.featureClicked(f))
                    )
                })
                return res.flat()
            }
        },
        methods: {
            ...mapMutations('map', ['setCoordinates']),
            ...mapMutations('feature', ['setSelected']),
            onClick: function (e) {
                if (this.toInsert) { this.toInsert.remove() }
                const coordinates = [e.latlng.lng, e.latlng.lat]
                this.selectedFeature.setGeometryFromCoordinates(coordinates)
                this.toInsert = MapTools.representation(this.selectedFeature).addTo(this.map)
            },
            addRepresentations: function () {
                this.representations.forEach(r => r.addTo(this.map))
            },
            removeRepresentations: function () {
                this.representations.forEach(r => r.remove())
            },
            featureClicked: function (f) {
                this.setSelected(f)
            },
            init: function (center) {
                this.map = L.map('map').setView(center, 15)

                L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
                    attribution: 'données © OpenStreetMap/ODbL - rendu OSM France',
                    minZoom: 1,
                    maxZoom: 20
                }).addTo(this.map)

                this.addRepresentations()

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

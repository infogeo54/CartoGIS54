<template>
    <div id="map" :style="{cursor: cursor}"></div>
</template>

<script>
    import L from 'leaflet'
    import {mapGetters, mapMutations} from 'vuex'
    export default {
        name: "Map",
        data() {
            return {
                map: null,
            }
        },
        computed: {
            ...mapGetters({
                layers: 'layer/list',
                features: 'layer/features',
                selectedLayer: 'layer/selected',
                selectedFeature: 'feature/selected',
            }),
            editing: function () {
                return this.selectedFeature
            },
            cursor: function () {
                return this.editing ? 'crosshair' : 'grab'
            },
            representations: function () {
                return this.features.map(f => {
                    f.createRepresentation()
                    return f.representation
                })
            }
        },
        methods: {
            ...mapMutations('feature', ['setSelected']),
            addRepresentations: function () {
                this.representations.forEach(r => {
                    r.addTo(this.map)
                })
            },
            mapClicked: async function (e) {
                if (this.selectedFeature.representation) this.selectedFeature.representation.remove()
                this.selectedFeature.coordinates = [e.latlng.lat, e.latlng.lng]
                this.selectedFeature.createRepresentation()
                this.selectedFeature.representation.addTo(this.map)
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
                    if (this.editing) this.mapClicked(e)
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

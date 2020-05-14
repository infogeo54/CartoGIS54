<template>
    <div id="map" :style="{cursor: cursor}"></div>
</template>

<script>
    import L from 'leaflet'
    import {mapGetters, mapMutations} from 'vuex'
    import Feature from "../models/Feature";
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
                description: 'layer/getDescription',
                selectedLayer: 'layer/selected',
                selectedFeature: 'feature/selected',
                representation: 'feature/representation',
                selectedType: 'feature/type',
                editing: 'map/editing',
            }),
            cursor: function () {
                return this.editing ? 'crosshair' : 'grab'
            },
            representations: function () {
                return this.features.map(f => f.representation)
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
                if (this.representation) this.representation.remove()
                const options = {
                    properties: {
                        ...this.description(this.selectedLayer.name).attributes,
                        geometry: { coordinates: [e.latlng.lat, e.latlng.lng] },
                        type: this.selectedType
                    },
                    parent: this.selectedLayer
                }
                const f = new Feature(options)
                f.representation.addTo(this.map)
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

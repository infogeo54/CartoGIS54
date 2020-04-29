<template>
    <div id="map" :style="{cursor: cursor}"></div>
</template>

<script>
    import L from 'leaflet'
    import MapTools from '../tools/MapTools'
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
                selectedLayer: 'layer/selected',
                selectedFeature: 'feature/selected',
                selectedType: 'feature/type',
                editing: 'map/editing',
                representation: 'map/representation'
            }),
            cursor: function () {
                return this.editing ? 'crosshair' : 'grab'
            },
            representations: function () {
                return this.features.map(f =>
                    MapTools.representation(f, this.setSelected)
                )
            },
            toInsert: function () {
                if (this.selectedFeature) {
                    return this.selectedFeature.representation(this.setSelected)
                }
                return null
            }
        },
        methods: {
            ...mapMutations('feature', ['setSelected']),
            ...mapMutations('map', ['setRepresentation']),
            addRepresentations: function () {
                this.representations.forEach(r => r.addTo(this.map))
            },
            removeRepresentations: function () {
                this.representations.forEach(r => r.remove())
            },
            mapClicked: async function (e) {
                if (this.toInsert) this.toInsert.remove()
                const options = {
                    geometry: { coordinates: [e.latlng.lat, e.latlng.lng] },
                    properties: {
                        ... await Feature.getDescription(this.selectedLayer.name),
                        type: this.selectedType
                    }
                }
                this.setSelected(new Feature(options))
                this.toInsert.addTo(this.map)
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

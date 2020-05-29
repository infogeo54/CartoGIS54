<template>
    <div id="map" :style="{cursor: cursor}"></div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import MapTools from '@/tools/MapTools'

export default {
    name: "Map",
    computed: {
        ...mapGetters({
            map: 'map',
            layerList: 'layer/list',
            featureList: 'layer/features',
            layer: 'layer/selected',
            feature: 'feature/selected',
        }),
        cursor: function () {
            return this.feature ? 'crosshair' : 'grab'
        },
        representations: function () {
            return this.featureList.map(f => {
                f.createRepresentation()
                return f.representation
            })
        }
    },
    methods: {
        ...mapMutations(['setMap']),
        mapClicked: async function (e) {
            if (this.feature) {
                const point = [e.latlng.lat, e.latlng.lng]
                if (this.feature.representation) this.feature.deleteRepresentation()
                if (this.feature.parent.shape === 'Point') this.feature.coordinates = point
                else this.feature.coordinates.push(point)
                this.feature.createRepresentation().addTo(this.map)
            }
        }
    },
    mounted() {
        const map = MapTools.createMap([49.305, 5.78]).on('click', e => this.mapClicked(e))
        this.setMap(map)
        MapTools.addRepresentations(this.map, this.representations)
    }
}
</script>

<style lang="sass" scoped>
    #map
        height: 100%
        width: 100%
</style>

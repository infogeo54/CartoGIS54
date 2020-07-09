<template>
    <div id="map" :style="{cursor: cursor}"></div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import MapTools from '@/tools/MapTools'
import _ from 'lodash'

export default {
    name: "Map",
    computed: {
        ...mapGetters({
            map: 'map',
            layerList: 'layer/list',
            featureList: 'layer/features',
            layer: 'layer/selected',
            feature: 'feature/selected',
            ogCoordinates: 'feature/ogCoordinates'
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
                else {
                    if (this.feature.coordinates) {
                        if (_.isEqual(this.feature.coordinates, this.ogCoordinates)) this.feature.coordinates = [point]
                        else this.feature.coordinates.push(point)
                    }
                    else this.feature.coordinates = [point]
                }
                this.feature.createRepresentation().addTo(this.map)
            }
        }
    },
    mounted() {
        const map = MapTools.map.create([49.305, 5.78]).on('click', e => this.mapClicked(e))
        this.setMap(map)
        MapTools.map.representations(this.map, this.representations)
    }
}
</script>

<style lang="sass" scoped>
  #map
    height: 100%
    width: 100%
</style>

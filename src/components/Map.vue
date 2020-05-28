<template>
    <div id="map" :style="{cursor: cursor}"></div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import MapTools from '@/tools/MapTools'
import Feature from '@/models/Feature'

export default {
    name: "Map",
    data() {
        return {
            map: null
        }
    },
    computed: {
        ...mapGetters({
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
        },
        tempFeature: function () {
            return new Feature({...this.feature})
        }
    },
    methods: {
        ...mapMutations('feature', ['setSelected']),
        mapClicked: async function (e) {
            if (this.tempFeature) {
                if (this.feature.representation) this.feature.representation.remove()
                const point = [e.latlng.lat, e.latlng.lng]
                MapTools.manageFeature(this.tempFeature, point).addTo(this.map)
            }
        }
    },
    mounted() {
        this.map = MapTools.createMap([49.305, 5.78]).on('click', e => this.mapClicked(e))
        MapTools.addRepresentations(this.map, this.representations)
    }
}
</script>

<style lang="sass" scoped>
    #map
        height: 100%
        width: 100%
</style>

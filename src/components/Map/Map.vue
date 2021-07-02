<template>
        <div id="map" :style="{cursor: cursor}"></div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex'
import MapTools from '@/tools/MapTools'
import _ from 'lodash'
// import { bus } from '@/main.js'
import L from 'leaflet'
import { map as mapConfig } from '@/app.config.json'
 

export default {
    name: "Map",
    computed: {
        ...mapGetters({
            map: 'map',
            layerList: 'layer/list',
            featureList: 'layer/features',
            layer: 'layer/selected',
            feature: 'feature/selected',
            ogCoordinates: 'feature/ogCoordinates',
            editable: 'feature/editable',
            quickMeasure: 'quickMeasure/quickMeasure',
            formVisible: 'form/formVisible',
        }),
        cursor: function (){
            if (this.feature && this.feature.id == undefined) {
                switch (this.feature.parent.shape ) {
                    case 'Point': return "url('/img/cursor_marker.svg') 11.5 17, crosshair";
                    case 'Polygon': return "url('/img/cursor_polygon.svg') 11.5 17, crosshair";
                    case 'Polyline(': return "url('/img/cursor_line.svg') 11.5 17, crosshair";
                    default: return 'crosshair'
                }
            }else if (this.quickMeasure.type) {
                switch (this.quickMeasure.type) {
                    case 'polygon': return "url('/img/cursor_polygon.svg') 11.5 17, crosshair";
                    case 'polyline(': return "url('/img/cursor_line.svg') 11.5 17, crosshair"; 
                    default: return 'crosshair'
                }
            }
            return 'grab'
        },
        representations: function () {
            return this.featureList.map(f => {
                f.createRepresentation()
                return f.representation
            })
        },
        mapParams: function () {
            return this.$route.query
        },
    },
    methods: {
        ...mapMutations(['setMap',
            'feature/setEditable', 
            'feature/toggleEdit', 
        ]),

        ...mapActions([
            'quickMeasure/addLatlng',
            'quickMeasure/spliceVertex',
        ]),

        addRepresentation: function () {
            let f = this.feature.createRepresentation()
            f.addTo(this.map)
        },

        mapClicked: async function (e) {
                        
            const point = L.latLng(e.latlng.lat, e.latlng.lng);
            const p = [e.latlng.lat, e.latlng.lng];

            if (this.quickMeasure.type != null) {
                this['quickMeasure/addLatlng'](point);
            }else if(this.feature) {
                
                if (this.feature.parent.shape === 'Point'){

                    if (this.feature.representation && this.editable){
                        this.feature.deleteRepresentation()
                        this.feature.coordinates = point
                        this.addRepresentation()
                    }

                    if (!this.feature.representation) {
                        this.feature.coordinates = point
                        this.addRepresentation()
                    }
                } 
                else{
                    if(!this.editable && this.feature.id === undefined){
                        if (this.feature.representation) {
                            this.feature.deleteRepresentation()
                        }
                        if (this.feature.coordinates) {
                            if (_.isEqual(this.feature.coordinates, this.ogCoordinates)) this.feature.coordinates = [point]
                            else {
                                this.feature.coordinates.push(p);
                                }
                        }else this.feature.coordinates = [point]
                        // console.log(this.feature.coordinates);
                        this.addRepresentation()
                        this.feature.updateMeasurements()

                    }
                }
            }
        },

        newVertex: function (e){
            const point = [e.latlng.lat, e.latlng.lng]
            let index = e.vertex.getIndex() 

            if (this.feature) {
                this.feature.coordinates.splice(index, 0, point)  
                this.feature.updateMeasurements()
            }

            if (this.quickMeasure.type != null) this['quickMeasure/spliceVertex']( { 'index' : index, 'size' : 0, 'point' : point } );
        },

        dragVertex: function (e) {
            const point = [e.vertex.latlng.lat, e.vertex.latlng.lng]
            let index = e.vertex.getIndex() 

            if (this.feature) {
                this.feature.coordinates[index] = point
                this.feature.updateMeasurements()
            }

            if (this.quickMeasure.type != null) this['quickMeasure/spliceVertex']( { 'index' : index, 'size' : 1, 'point' : point } );

        },

        deleteVertex: function (e) {
            const point = [e.vertex.latlng.lat, e.vertex.latlng.lng]
            let indexes = []
            let i = 0

            if (this.feature) {
                this.feature.coordinates.forEach(function(coordinates, index){
                    if (coordinates[0]==point[0] && coordinates[1]==point[1]) indexes.push(index)
                });
                indexes.forEach(index => {
                    this.feature.coordinates.splice(index + i, 1)
                    i--
                });
                this.feature.updateMeasurements()
            }


            if (this.quickMeasure.type != null) {
                this.quickMeasure.latlngs.forEach(function(coordinates, index){
                    if (coordinates[0]==point[0] && coordinates[1]==point[1]) indexes.push(index)
                });
                indexes.forEach(index => {
                    this['quickMeasure/spliceVertex']( { 'index' : index + i, 'size' : 1 } );
                    i--
                });
            }

        },
        
        getMapParam: function (key) {
            return((this.mapParams[key]) ? this.mapParams[key] : mapConfig.default[key]);
        }

    },
    mounted() {
        const map = MapTools.map.create(
            Number(this.getMapParam('x')),
            Number(this.getMapParam('y')),
            Number(this.getMapParam('minZoom')),
            (this.getMapParam('isLimited') == 'false') ? false : true,
            mapConfig.baseLayers
            )
            .on('click', e => this.mapClicked(e))

        map.on('editable:vertex:dragend', e => this.dragVertex(e))
        map.on('editable:vertex:new', e => this.newVertex(e))
        map.on('editable:vertex:deleted', e => this.deleteVertex(e))

        this.setMap(map)
        MapTools.map.representations(this.map, this.representations)

        let tool = document.querySelector('.leaflet-right');
        tool.classList.remove('leaflet-top');
        tool.classList.add('leaflet-bottom'); 
    },
}



</script>

<style lang="sass" scoped>

#map
    min-height: 100%
    box-sizing: border-box
</style>
 
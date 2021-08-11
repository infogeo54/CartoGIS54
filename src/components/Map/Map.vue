<template>
        <div id="map" :style="{cursor: cursor}"></div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex'
import MapTools from '@/tools/MapTools'
import { bus } from '@/main.js'
import _ from 'lodash'
import { map as mapConfig } from '@/app.config.json'
 

export default {
    name: "Map",
    computed: {
        ...mapGetters({
            map: 'map',
            featureList: 'layer/features',
            feature: 'feature/selected',
            ogCoordinates: 'feature/ogCoordinates',
            editable: 'feature/editable',
            quickMeasure: 'quickMeasure/quickMeasure',
            formVisible: 'form/formVisible',
        }),
        cursor: function (){
            if (this.feature && this.feature.id == undefined) {
                switch (this.feature.parent.shape ) {
                    case 'point': return "url('/img/cursor_marker.svg') 11.5 17, crosshair";
                    case 'polygon': return "url('/img/cursor_polygon.svg') 11.5 17, crosshair";
                    case 'polyline': return "url('/img/cursor_line.svg') 11.5 17, crosshair";
                    default: return 'crosshair'
                }
            }else if (this.quickMeasure.type) {
                switch (this.quickMeasure.type) {
                    case 'polygon': return "url('/img/cursor_polygon.svg') 11.5 17, crosshair";
                    case 'polyline': return "url('/img/cursor_line.svg') 11.5 17, crosshair"; 
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
                        
            const point = [e.latlng.lat, e.latlng.lng];

            if (this.quickMeasure.type != null) {
                this['quickMeasure/addLatlng'](point);
            }else if(this.feature) {
                if (this.feature.type == 'point'){
                    
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
                                this.feature.coordinates.push(point);
                                }
                        }else this.feature.coordinates = [point]
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
        
        getMapParam: function (key) { return((this.mapParams[key]) ? this.mapParams[key] : mapConfig.default[key]); },

    },
    mounted() {
        const map = MapTools.map.create(
            Number(this.getMapParam('x')),
            Number(this.getMapParam('y')),
            Number(this.getMapParam('minZoom')),
            (this.getMapParam('isLimited') == false || this.getMapParam('isLimited') == "false") ? false : true,
            mapConfig.baseLayers
            )
            .on('click', e => this.mapClicked(e));

        map.on('editable:vertex:dragend', e => this.dragVertex(e));
        map.on('editable:vertex:new', e => this.newVertex(e));
        map.on('editable:vertex:deleted', e => this.deleteVertex(e));

        this.setMap(map)
        MapTools.map.representations(this.map, this.representations);
        let zoomTool = document.querySelector('.leaflet-top.leaflet-left');
        zoomTool.classList.replace('leaflet-left', 'leaflet-right');

        bus.$on('draggedMarker', (latlng) => { this.feature.coordinates = [latlng.lat, latlng.lng] });


    },
}



</script>

<style lang="sass" scoped>

#map
    min-height: 100%
    box-sizing: border-box
</style>
 
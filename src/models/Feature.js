import feature from '@/store/modules/feature'
// import store from '@/store'
import { bus } from '@/main.js' 
import MapTools from '../tools/MapTools'
import L from 'leaflet'
import _ from 'lodash'

export default class Feature {
    constructor (options = {
        id: null,
        properties: null,
        parent: null
    }) {
        this.id = options.id
        this.parent = options.parent
        this._properties = {parent: options.parent, props: options.properties}
        this.representation = null
    }

    set _properties (params) {
        const attributes = params.parent.description.attributes
        let properties = {}
        for (let attr in attributes) {
            const type = attributes[attr].type
            let value = params.props ? params.props[attr] : null
            if (!value) {
                switch (type) {
                    case 'gml:PointPropertyType':
                    case 'gml:MultiPolygonPropertyType':
                    case 'gml:MultiLineStringPropertyType':
                        value = { coordinates: [] } // New Feature's geometry is init at empty coordinates
                        break
                }
            }
            properties[attr] = {type: type, value: value}
        }
        this.properties = properties
    }

    set coordinates (coordinates) {
        this.properties.geometry.value = {coordinates: coordinates}
    }

    get coordinates () {

        let g = this.properties.geometry;
        if(g.value){
            if ((g.type=='gml:MultiPolygonPropertyType') && (g.value.coordinates.length >= 3)) {
                
                /* 
                    Dans le cas où le premier point a été duppliquer pour fermer le polygone, 
                    on supprime le doublon, qui est le dernier point.
                */
                let firstCoord = g.value.coordinates[0];
                let lastCoord = g.value.coordinates[g.value.coordinates.length -1 ];
                if (firstCoord[0] == lastCoord[0] && firstCoord[1] == lastCoord[1]) {
                    g.value.coordinates.pop();
                }

                /* 
                    Ici pour tous les doublons
                */
                // g.value.coordinates.forEach(function(coord, index){
                //     g.value.coordinates.forEach(function(testC, testI){
                //         if (testC[0] == coord[0] && testC[1] == coord[1] && testI != index ) {
                //             g.value.coordinates.splice(testI, 1);
                //         }
                //     });
                // });

            }
            return g.value.coordinates

        }else{
            return null
        }
    }

    get layer () {
        return this.parent.description.layer;
    }

    createRepresentation () {
        if (!this.coordinates) throw 'Feature has no coordinates'
        const cb = () => {
            if (!feature.getters.isDrawing) {
                feature.mutations.setSelected(feature.state, this)
                feature.mutations.setOgProperties(feature.state, this.copyProperties())
                bus.$emit('centerOnFeature', feature.state.selected)
            }
        }
        return this.representation = MapTools.representation.create(this, cb)
    }

    /**
     * Remove and reset Feature's representation
     */
    deleteRepresentation () {
        if (this.representation) {
            this.representation.remove()
            this.representation = null
        } else {
            throw 'Feature has no representation'
        }
    }

    /**
     * Return a deep copy (not referenced) of the Feature's properties
     * @returns Object
     */
    copyProperties () {
        if (this.properties) return _.cloneDeep(this.properties)
        throw  'Feature has no properties'
    }


    get perimeter (){
        if (this.representation && this.properties.geometry.type == 'gml:MultiPolygonPropertyType') {
            let coordinates = this.representation._latlngs[0];
                
            let allSides =  L.GeometryUtil.accumulatedLengths(coordinates);
            let lastSide = L.GeometryUtil.length([coordinates[0], coordinates[coordinates.length-1]]);
            let perimeter = allSides[allSides.length-1] + lastSide;
    
            return Math.round(perimeter);
        }
        return null;
    }


    get area (){
        if (this.representation && this.properties.geometry.type == 'gml:MultiPolygonPropertyType') {
            let area = L.GeometryUtil.geodesicArea(this.representation._latlngs[0]);
    
            return Math.round(area);
        }
        return null;

    }


    get totalDistance (){
        if (this.representation && this.properties.geometry.type == 'gml:MultiLineStringPropertyType') {
            let totalDistance = L.GeometryUtil.length(this.representation);
    
            return Math.round(totalDistance);
        }
        return null;
    }


    updateMeasurements () {
        if (this.perimeter != null) this.properties.perimeter.value = this.perimeter;
        if (this.area != null) this.properties.area.value = this.area;
        if (this.totalDistance != null) this.properties.longueur.value = this.totalDistance;
        //  this.properties.photo.value = "https://place-hold.it/250x150"
    }

}

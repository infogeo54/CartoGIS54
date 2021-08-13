import feature from '@/store/modules/feature'
import { bus } from '@/main.js' 
import MapTools from '../tools/MapTools'
import L from 'leaflet'
import _ from 'lodash'
import { form } from '@/app.config.json'

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
            const alias = attributes[attr].alias
            let value = params.props ? params.props[attr] : null
            properties[attr] = {type, value, alias}
        }
        this.properties = properties
    }

    set coordinates (coordinates) {
        this.properties.geometry.value = {coordinates: coordinates}
    }

    get themeAnalysisAttr (){
        return this.parent.styles[0].filter.propertyIsEqualTo.propertyName
    }

    get style () {
        if (this.parent.styles.length) {
            let value = this.properties[this.themeAnalysisAttr].value;
            return this.parent.styles.find(style => style.filter.propertyIsEqualTo.literal == value);
        }
        return null
    }

    get coordinates () {

        let g = this.properties.geometry;
        if(g.value){
            if ((this.type=='polygon') && (g.value.coordinates.length >= 3)) {
                
                /* 
                    In the case where the 1st point was duplicated to close the polygon,
                    We delete the duplicate, which is the last point
                */
                let firstCoord = g.value.coordinates[0];
                let lastCoord = g.value.coordinates[g.value.coordinates.length -1 ];
                if (firstCoord[0] == lastCoord[0] && firstCoord[1] == lastCoord[1]) {
                    g.value.coordinates.pop();
                }
                
            }
            return g.value.coordinates

        }else{
            return null
        }
    }

    get layer () {
        return this.parent.description.layer;
    }

    // For testing the feature's shape by regrouping the "simple/classic" version with the "multi" version
    get type () {
        let t = this.properties.geometry.type
        switch (this.properties.geometry.type) {
            case 'gml:MultiPolygonPropertyType':
            case 'gml:PolygonPropertyType':
                t='polygon';
                break;
            
            case 'gml:MultiLineStringPropertyType':
            case 'gml:LineStringPropertyType':
                t='polyline';
                break;

            case 'gml:MultiPointPropertyType':
            case 'gml:PointPropertyType':
                t='point';
                break;          
        }

        return t
        
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
     * 
     * @returns { object } The deep copy of the properties
     */
    copyProperties () {
        if (this.properties) return _.cloneDeep(this.properties)
        throw  'Feature has no properties'
    }

    /**
     * To update the measurements attributes of a Feature by computing the value of the current shape
     * The function is called whenever the geometry of the feature is changed
     * Handled measures : area, perimeter, distance.
     */
    updateMeasurements () {
        this._updateByRole('area');
        this._updateByRole('perimetre');
        this._updateByRole('distance');
    }

    /**
     * Search in the config the attributes of the Feature where the role is used.
     * If found, call the getter linked to the role to compute the measurement 
     * 
     * @param { ('area'|'perimeter'|'distance') } role - The role of the attribute, to which kind of measure it is for 
     */
    _updateByRole(role){
        const type = form.notEnterable.find((t) => { 
            return (t.role === role) ? (!t.layer || t.layer === this.parent.description.layer) : null
        });
        if (type && this.properties[type.name]) {
            this.properties[type.name].value = this[role]
        }
    }

    /**
     * Compute a perimeter (for polygons only)
     * Using accumulatedLengths the L.GeometryUtil of Makina Corpus 
     * { @link https://makinacorpus.github.io/Leaflet.GeometryUtil/global.html#accumulatedLengths }
     * 
     * @returns { number } The computed perimeter
     */
    get perimetre (){
        if (this.representation && this.type == 'polygon') {
            let coordinates = this.representation._latlngs[0];
            
            /*
             accumulatedLengths do the sum of the distances between the coordinates passed in parameter,
             But it doesn't do the distance between the last and the first coordiantes,
             We have do it manually with the function length which computes the distance between to coordinates
             */
            let allSides =  L.GeometryUtil.accumulatedLengths(coordinates);
            let lastSide = L.GeometryUtil.length([coordinates[0], coordinates[coordinates.length-1]]);
            let perimeter = allSides[allSides.length-1] + lastSide;
    
            return Math.round(perimeter);
        }
        return null;
    }


    /**
     * Compute a area (for polygons only)
     * Using geodesicArea of the L.GeometryUtil of Leaflet Draw 
     * { @link https://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html#l-geometryutil }
     * 
     * @returns { number } The computed area
     */
    get area (){
        if (this.representation && this.type == 'polygon') {
            let area = L.GeometryUtil.geodesicArea(this.representation._latlngs[0]);
    
            return Math.round(area);
        }
        return null;

    }

    /**
     * Compute a distance (for lines only)
     * Using length the L.GeometryUtil of Makina Corpus 
     * { @link https://makinacorpus.github.io/Leaflet.GeometryUtil/global.html#accumulatedLengths }
     * 
     * @returns { number } The computed area
     */
    get distance (){
        if (this.representation && this.type == 'polyline') {
            /*
             L.GeometryUitl.length return here the complete perimeter of the Feature
             Because we passed as a parameter a Leaflet Polyline object
             */
            let totalDistance = L.GeometryUtil.length(this.representation);
    
            return Math.round(totalDistance);
        }
        return null;
    }

}

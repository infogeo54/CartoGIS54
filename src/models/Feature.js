import MapTools from '../tools/MapTools'
//import WFS from '../API/WFS'

export default class Feature {
    constructor (options = {
        id: null,
        properties: null,
        parent: null
    }) {
        this.properties = options.properties
        this.id = options.id
        this.parent = options.parent
        this.representation = null
    }

    createRepresentation (cb) {
        this.representation =  MapTools.representation(this, cb)
    }

    /**
     * Returns the EPSG:900913 to EPSG:2154 geometry conversion
     * @returns Object
     */
    getConvertedGeometry () {
        return { coordinates: MapTools.project(this.properties.geometry.coordinates) }
    }
}
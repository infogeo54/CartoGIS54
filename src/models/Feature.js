import MapTools from '../tools/MapTools'
import WFS from '../API/WFS'

export default class Feature {
    constructor (options = {}) {
        this.props = options.properties
        this.identifier = options.id
        this.geom = options.geometry
        this.parent = options.parent
    }

    set props (properties) {
        this.properties = properties ? properties : {}
    }

    set identifier (id) {
        this.id = id ? id : null
    }

    set geom (geometry) {
        this.geometry = geometry ? geometry : {}
    }

    createRepresentation (cb) {
        this.representation =  MapTools.representation(this, cb)
    }

    async getDescription (layerName, typeName) {
        this.props = {
            ...await WFS.fetchFeatureDescription(layerName),
            type: typeName
        }
    }

    /**
     * Returns the EPSG:900913 to EPSG:2154 geometry conversion
     * @returns Object
     */
    getConvertedGeometry () {
        return { coordinates: MapTools.project(this.geometry.coordinates) }
    }
}
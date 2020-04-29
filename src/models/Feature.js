import MapTools from '../tools/MapTools'
import WFS from '../API/WFS'

export default class Feature {
    constructor (options = {}) {
        this.props = options.properties
        this.identifier = options.id
        this.geom = options.geometry
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

    representation (cb) {
        return MapTools.representation(this, cb)
    }

    async getDescription (layerName, typeName) {
        this.props = {
            ...await WFS.fetchFeatureDescription(layerName),
            type: typeName
        }
    }
}
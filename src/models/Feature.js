import WFS from '../API/WFS'

export default class Feature {
    constructor (options = {}) {
        this.props = options.properties
        this.identifier = options.id
        this.geom = options.geometry
        console.log(this)
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

    async getDescription (layerName, typeName) {
        let properties = await WFS.fetchFeatureDescription(layerName)
        properties.type = typeName
        this.properties = properties
    }
}
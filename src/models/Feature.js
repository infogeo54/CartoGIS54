import WFS from '../API/WFS'

export default class Feature {
    constructor (properties = {}, id = null, geometry = {}) {
        this.id = id
        this.geometry = geometry
        this.properties = properties
    }

    setGeometryFromCoordinates (coordinates) {
        this.geometry.coordinates = coordinates
    }

    async getDescription (layerName, typeName) {
        let properties = await WFS.fetchFeatureDescription(layerName)
        properties.type = typeName
        this.properties = properties
    }
}
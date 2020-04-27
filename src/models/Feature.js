import WFS from '../API/WFS'

export default class Feature {
    constructor (properties = {}, id = null, geometry = null) {
        this.id = id
        this.geometry = geometry
        this.properties = properties
    }

    async getDescription (layerName, typeName) {
        let properties = await WFS.fetchFeatureDescription(layerName)
        properties.type = typeName
        this.properties = properties
    }
}
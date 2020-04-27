export default class Feature {
    constructor (properties = {}, id = null, geometry = null) {
        this.id = id
        this.geometry = geometry
        this.properties = properties
        this.icon = this.setIcon(properties.type)
    }

    setShape (geometry) {
        return geometry.length === 2 ? 'Point' : 'Polygon'
    }

    setIcon (type) {
        let icon
        try { icon = require(`@/assets/icons/${type}.svg`) }
        catch { icon = require(`@/assets/icons/poi.svg`) }
        return icon
    }
}
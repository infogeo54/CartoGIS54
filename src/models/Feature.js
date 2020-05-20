import MapTools from '../tools/MapTools'

export default class Feature {
    constructor (options = {
        id: null,
        properties: null,
        parent: null
    }) {
        this.id = options.id
        this.parent = options.parent
        this._properties = {parent: options.parent, props: options.properties}
    }

    set _properties (params) {
        const attributes = params.parent.description.attributes
        let properties = {}
        for (let attr in attributes) {
            const type = attributes[attr].type
            let value = params.props[attr]
            if (type === 'boolean' && !value) value = 'FALSE' // New Feature's booleans are init at FALSE
            properties[attr] = {type: type, value: value}
        }
        this.properties = properties
    }

    set coordinates (coordinates) {
        this.properties.geometry.value = {coordinates: coordinates}
    }

    get coordinates () {
        if(this.properties.geometry.value) return this.properties.geometry.value.coordinates
        return null
    }

    createRepresentation () {
        if (this.coordinates) {
            this.representation = MapTools.representation(this)
        }
    }
}
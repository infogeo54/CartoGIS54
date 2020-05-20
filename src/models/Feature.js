import MapTools from '../tools/MapTools'

export default class Feature {
    constructor (options = {
        id: null,
        properties: null,
        parent: null
    }) {
        this.id = options.id
        this.parent = options.parent
        this.setProperties(options.parent, options.properties)
        this.representation = MapTools.representation(this)
    }

    setProperties (parent, props) {
        const attributes = parent.description.attributes
        let properties = {}
        for (let attr in attributes) {
            const type = attributes[attr].type
            let value = props[attr]
            if (type === 'boolean' && !value) value = 'FALSE' // New Feature's booleans are init at FALSE
            properties[attr] = {type: type, value: value}
        }
        this.properties = properties
    }
}
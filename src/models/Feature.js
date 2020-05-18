import MapTools from '../tools/MapTools'
import layer from '../store/modules/layer'

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
        const description = {...layer.getters.getDescription(layer.state)(parent)}.attributes
        let properties = {}
        for (let prop in description) {
            const type = description[prop].type
            let value = props[prop]
            if (type === 'boolean' && !value) value = 'FALSE' // New Feature's booleans are init at FALSE
            properties[prop] = {type: type, value: value}
        }
        this.properties = properties
    }
}
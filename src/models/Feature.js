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
            properties[prop] = {type: description[prop].type, value: props[prop]}
        }
        this.properties = properties
    }
}
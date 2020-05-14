import MapTools from '../tools/MapTools'

export default class Feature {
    constructor (options = {
        id: null,
        properties: null,
        parent: null
    }) {
        this.properties = options.properties
        this.id = options.id
        this.parent = options.parent
        this.representation = MapTools.representation(this)
    }
}
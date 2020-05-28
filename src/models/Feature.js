import MapTools from '../tools/MapTools'
import _ from 'lodash'

export default class Feature {
    constructor (options = {
        id: null,
        properties: null,
        parent: null
    }) {
        this.id = options.id
        this.parent = options.parent
        this._properties = {parent: options.parent, props: options.properties}
        this.representation = null
    }

    set _properties (params) {
        const attributes = params.parent.description.attributes
        let properties = {}
        for (let attr in attributes) {
            const type = attributes[attr].type
            let value = params.props ? params.props[attr] : null
            if (!value) {
                switch (type) {
                    case 'boolean':
                        value = 'FALSE' // New Feature's booleans are init at FALSE
                        break
                    case 'gml:PointPropertyType':
                    case 'gml:MultiPolygonPropertyType':
                        value = {coordinates: []} // New Feature's geometry is init at empty coordinates
                        break
                }
            }
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
        if (this.coordinates) return this.representation = MapTools.createRepresentation(this)
        throw 'Feature\'s coordinates are undefined'
    }

    copy () {
        const f = new Feature({id: this.id, parent: this.parent})
        f.properties = _.cloneDeep(this.properties)
        return f
    }
}

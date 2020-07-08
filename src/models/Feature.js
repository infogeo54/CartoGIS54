import feature from '@/store/modules/feature'
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
                    case 'gml:PointPropertyType':
                    case 'gml:MultiPolygonPropertyType':
                        value = { coordinates: [] } // New Feature's geometry is init at empty coordinates
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
        if (!this.coordinates) throw 'Feature has no coordinates'
        const cb = () => {
            feature.mutations.setSelected(feature.state, this)
            feature.mutations.setOgProperties(feature.state, this.copyProperties())
        }
        return this.representation = MapTools.representation.create(this, cb)
    }

    /**
     * Remove and reset Feature's representation
     */
    deleteRepresentation () {
        if (this.representation) {
            this.representation.remove()
            this.representation = null
        } else {
            throw 'Feature has no representation'
        }
    }

    /**
     * Return a deep copy (not referenced) of the Feature's properties
     * @returns Object
     */
    copyProperties () {
        if (this.properties) return _.cloneDeep(this.properties)
        throw  'Feature has no properties'
    }
}

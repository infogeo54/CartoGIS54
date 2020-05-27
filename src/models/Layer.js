import WFS from '../API/WFS'
import WMS from '../API/WMS'
import Feature from './Feature'


export default class Layer {
    constructor (options = {properties: null, description: null}) {
        this.properties = {
            name: options.properties['Name']['_text'],
            title: options.properties['Title']['_text']
        }
        this.description = options.description
    }

    get shape () {
        return this.description.shape
    }

    async getFeatures () {
        const data = await WFS.fetchFeatures(this.properties.name)
        this.features = data.map(f => new Feature({
            properties: {...f.properties, geometry: f.geometry},
            id: f.id,
            parent: this
        }))
    }

    async getStyles () {
        this.styles = await WMS.fetchStyles(this.properties.name)
    }
}
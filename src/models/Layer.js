import WFS from '../API/WFS'
import WMS from '../API/WMS'
import Feature from './Feature'


export default class Layer {
    constructor (data) {
        this.srs = data['DefaultSRS']
        this.name = data['Name']['_text']
        this.title = data['Title']['_text']
        this.operations = data['Operations']['Operation']
        this.boundingBox = data['ows:WGS84BoundingBox']
    }

    async getFeatures () {
        const data = await WFS.fetchFeatures(this.name)
        this.features = data.map(f => new Feature({
            properties: f.properties,
            id: f.id,
            geometry: f.geometry,
            parent: this.name
        }))
    }

    async getStyles () {
        this.styles = await WMS.fetchStyles(this.name)
    }
}
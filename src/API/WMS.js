import axios from 'axios'
import * as convert from 'xml-js'

const host = 'localhost:8080'
const baseUrl = `http://${host}?SERVICE=WMS&VERSION=1.3.0`

async function getCapabilities() {
    const url = `${baseUrl}&REQUEST=GetCapabilities`
    const res = await axios.get(url)
    return res.data
}

function extractStyles(stylesXML) {
    const stylesJS = convert.xml2js(stylesXML, {compact: true, spaces: 4})
    return stylesJS['StyledLayerDescriptor']['NamedLayer']['UserStyle']['se:FeatureTypeStyle']['se:Rule']

}

async function getStyles(layerName) {
    const url = `${baseUrl}&REQUEST=GetStyles&LAYERS=${layerName}`
    const res = await axios.get(url)
    return extractStyles(res.data)
}

export default {getCapabilities, getStyles, extractStyles}

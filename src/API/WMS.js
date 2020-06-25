import axios from 'axios'
import * as convert from 'xml-js'
import { server } from '@/config'

const defaultQueryParams = server.queryParams.join('&')
const baseUrl = `http://${server.host}?${defaultQueryParams}&SERVICE=WMS&VERSION=1.1.0`


function extractStyles(stylesXML) {
    const stylesJS = convert.xml2js(stylesXML, {compact: true, spaces: 4})
    return stylesJS['StyledLayerDescriptor']['NamedLayer']['UserStyle']['se:FeatureTypeStyle']['se:Rule']
}

async function fetchStyles(layerName) {
    const url = `${baseUrl}&REQUEST=GetStyles&LAYERS=${layerName}`
    const res = await axios.get(url)
    return extractStyles(res.data)
}

export default { fetchStyles }

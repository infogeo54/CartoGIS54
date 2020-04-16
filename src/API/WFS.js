import axios from 'axios'
import * as convert from 'xml-js'

const host = 'localhost:8080'
const baseUrl = `http://${host}?SERVICE=WFS&VERSION=1.3.0&OUTPUTFORMAT=GEOJSON`

/**
 * Make a GetCapabilities AJAX request and return the response
 * @param host - The request's target
 * @returns {Promise<AxiosResponse<any>>} - The response
 */
async function getCapabilities() {
    const url = `${baseUrl}&REQUEST=GetCapabilities`
    const res = await axios.get(url)
    return res.data
}

/**
 * Extract a list of layers from a Capabilities XML document
 * @param capabilitiesXML - Capabilities XML document
 */
function extractLayers(capabilitiesXML) {
    const capabilities = convert.xml2js(capabilitiesXML, {compact: true, spaces: 4})
    return capabilities.WFS_Capabilities.FeatureTypeList.FeatureType
}

async function getFeatures(layer) {
    const url = `${baseUrl}&REQUEST=GetFeature&TYPENAME=${layer}`
    const res = await axios.get(url)
    return res.data
}

export default {getCapabilities, extractLayers, getFeatures}

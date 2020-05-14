import axios from 'axios'
import * as convert from 'xml-js'
import config from '../config'

const baseUrl = `http://${config.qgisserver.host}?SERVICE=WFS&VERSION=1.1.0`

/**
 * Make a GetCapabilities AJAX request and return a stringified XML document from the response
 * @returns String
 */
async function fetchCapabilities() {
    const url = `${baseUrl}&REQUEST=GetCapabilities`
    const res = await axios.get(url)
    return res.data
}

/**
 * Extract a list of layers from a Capabilities XML document
 * @param capabilitiesXML : String - Capabilities stringified XML document
 */
function extractLayers(capabilitiesXML) {
    const capabilities = convert.xml2js(capabilitiesXML, {compact: true})
    return capabilities['WFS_Capabilities']['FeatureTypeList']['FeatureType']
}

/**
 *
 * @param coordinates : Array - Returns reversed coordinates
 * @returns Array
 */
function reverseCoordinates (coordinates) {
    if (coordinates.length === 2) {
        return coordinates.reverse()
    } else {
        const polygon = coordinates[0][0]
        return polygon.map(p => p.reverse())
    }
}

/**
 * Make a GetFeature AJAX request and return the data from the response
 * @param layer : String - The name of the associated layer
 * @returns Object
 */
async function fetchFeatures(layer) {
    const url = `${baseUrl}&REQUEST=GetFeature&TYPENAME=${layer}&OUTPUTFORMAT=GEOJSON`
    const res = await axios.get(url)
    return res.data.features.map(f => {
        f.geometry.coordinates = reverseCoordinates(f.geometry.coordinates)
        return f
    })
}

/**
 * Make a DescribeFeature AJAX request and return a list of descriptions
 * @returns Array
 */
async function fetchAllFeatureDescriptions() {
    const url = `${baseUrl}&REQUEST=DescribeFeatureType`
    const res = await axios.get(url)
    return extractAllDescriptions(res.data)
}

function extractAllDescriptions(XMLDescriptions) {
    const descriptions = convert.xml2js(XMLDescriptions, {compact: true})
    return descriptions['schema']['complexType'].map(t => {
        const layer = t['_attributes']['name'].replace('Type', '')
        const attributes = extractAttributes(t['complexContent']['extension']['sequence'])
        return {layer: layer, attributes: attributes}
    })
}

function extractAttributes(sequence) {
    const attributes = sequence.element.map(e => [e['_attributes']['name']], null)
    return Object.fromEntries(attributes)
}

async function sendTransaction(transaction, layer) {
    console.log(transaction)
    const url = `${baseUrl}&REQUEST=Transaction&TYPENAME=${layer}`
    const res = await axios.post(url, transaction)
    console.log(res.data)
}

export default {
    fetchCapabilities,
    extractLayers,
    fetchFeatures,
    fetchAllFeatureDescriptions,
    sendTransaction
}
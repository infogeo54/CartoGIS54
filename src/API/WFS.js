import axios from 'axios'
import * as convert from 'xml-js'
import config from '../config'

const baseUrl = `http://${config.host}?SERVICE=WFS&VERSION=1.1.0`

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
    console.log(capabilities)
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
 * Make a DescribeFeature AJAX request and return a stringified XML document from the response
 * @param layer : String - The name of the associated layer
 * @returns String
 */
async function fetchFeatureDescription(layer) {
    const url = `${baseUrl}&REQUEST=DescribeFeatureType&TYPENAME=${layer}`
    const res = await axios.get(url)
    return extractSchema(res.data)
}

/**
 * Extract a list of property objects from a Feature Description XML document
 * @param descriptionXML : String - Feature Description stringified XML document
 * @returns Array
 */
function extractSchema(descriptionXML) {
    const description = convert.xml2js(descriptionXML, {compact: true})
    const elements = description['schema']['complexType']['complexContent']['extension']['sequence']['element']
    let entries = []
    elements.forEach(e => {
        const attr = e['_attributes']
        if (attr.name !== 'geometry') entries.push([attr.name, null])
    })
    return Object.fromEntries(entries)
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
    fetchFeatureDescription,
    sendTransaction
}
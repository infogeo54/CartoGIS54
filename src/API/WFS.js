import axios from 'axios'
import * as convert from 'xml-js'

//const axios = require('axios')
//const convert = require('xml-js')

const host = 'localhost:8080'
const baseUrl = `http://${host}?SERVICE=WFS&VERSION=1.3.0&OUTPUTFORMAT=GEOJSON`

/**
 * Make a GetCapabilities AJAX request and return a stringified XML document from the response
 * @param host - The request's target
 * @returns String
 */
async function getCapabilities() {
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
 * Make a GetFeature AJAX request and return the data from the response
 * @param layer : String - The name of the associated layer
 * @returns Object
 */
async function getFeatures(layer) {
    const url = `${baseUrl}&REQUEST=GetFeature&TYPENAME=${layer}`
    const res = await axios.get(url)
    return res.data
}

/**
 * Make a DescribeFeature AJAX request and return a stringified XML document from the response
 * @param layer : String - The name of the associated layer
 * @returns String
 */
async function getFeatureDescription(layer) {
    const url = `${baseUrl}&REQUEST=DescribeFeatureType&TYPENAME=${layer}`
    const res = await axios.get(url)
    return res.data
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


export default {
    getCapabilities,
    extractLayers,
    getFeatures,
    getFeatureDescription,
    extractSchema
}

//module.exports = {getFeatureDescription, extractAttributes}
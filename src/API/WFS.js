import axios from 'axios'
import * as convert from 'xml-js'
import { server } from '@/app.config.json'

const defaultQueryParams = server.queryParams.map(param => `${param.key}=${param.value}`).join('&')
const baseUrl = `http://${server.host}?${defaultQueryParams}&SERVICE=WFS&VERSION=1.1.0`

/**
 * Make a GetCapabilities AJAX request and return a stringified XML document from the response
 * @returns String
 */
const fetchLayers = async () => {
    const url = `${baseUrl}&REQUEST=GetCapabilities`
    const res = await axios.get(url)
    return extractLayers(res.data)
}

/**
 * Extract a list of layers from a Capabilities XML document
 * @param capabilitiesXML : String - Capabilities stringified XML document
 */
const extractLayers = capabilitiesXML => {
    const capabilities = convert.xml2js(capabilitiesXML, {compact: true})
    return capabilities['WFS_Capabilities']['FeatureTypeList']['FeatureType']
}

/**
 *
 * @param coordinates : Array - Returns reversed coordinates
 * @returns Array
 */
const reverseCoordinates = geometry => {

    if (geometry.type === 'Point') {
        return geometry.coordinates.reverse()
    } else if(geometry.type === 'MultiPolygon'){
        const polygon = geometry.coordinates[0][0]
        return polygon.map(p => p.reverse())
    } else if(geometry.type === 'MultiLineString'){
        const polyline = geometry.coordinates[0]
        return polyline.map(p => p.reverse())
    }
}

/**
 * Make a GetFeature AJAX request and return the data from the response
 * @param layer : String - The name of the associated layer
 * @returns Object
 */
const fetchFeatures = async layer => {
    const url = `${baseUrl}&REQUEST=GetFeature&TYPENAME=${layer}&OUTPUTFORMAT=GEOJSON`
    const res = await axios.get(url)
    return res.data.features.map(f => {
        f.geometry.coordinates = reverseCoordinates(f.geometry)
        return f
    })
}

/**
 * Make a DescribeFeature AJAX request and return a list of descriptions
 * @returns Array
 */
const fetchAllFeatureDescriptions = async () => {
    const url = `${baseUrl}&REQUEST=DescribeFeatureType`
    const res = await axios.get(url)
    return extractAllDescriptions(res.data)
}

const extractDescription = complexType => {
    const layer = complexType['_attributes']['name'].replace('Type', '')
    const attributes = extractAttributes(complexType['complexContent']['extension']['sequence'])
    const shape = extractShape(complexType['complexContent']['extension']['sequence'])
    return { layer: layer, attributes: attributes, shape: shape }
}

const extractAllDescriptions = XMLDescriptions => {
    const descriptions = convert.xml2js(XMLDescriptions, {compact: true})
    const complexTypes = descriptions['schema']['complexType']
    if (!Array.isArray(complexTypes)) {
        return extractDescription(complexTypes)
    }
    return complexTypes.map(t => {
        return extractDescription(t)
    })
}

const extractAttributes = sequence => {
    const attributes = sequence.element.map(e => {
        const name = e['_attributes']['name']
        const type = e['_attributes']['type']
        return [name, {type: type, value: null}]
    })
    return Object.fromEntries(attributes)
}

const extractShape = sequence => {
    const geometryElement = sequence.element.find(e => e['_attributes']['name'] === 'geometry')
    const geometryType = geometryElement['_attributes']['type']
    if (geometryType === 'gml:PointPropertyType') return 'Point'
    else if(geometryType === 'gml:MultiPolygonPropertyType') return 'Polygon'
    else if(geometryType === 'gml:MultiLineStringPropertyType') return 'Polyline('
}

const sendTransaction = async transaction => {
    console.log(transaction)
    const url = `${baseUrl}&REQUEST=Transaction`
    const res = await axios.post(url, transaction)
    console.log(res.data)
    return convert.xml2js(res.data, {compact: true})
}

export default {
    fetchLayers,
    fetchFeatures,
    fetchAllFeatureDescriptions,
    sendTransaction
}

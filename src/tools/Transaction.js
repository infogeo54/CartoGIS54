/*
    Build a WFS Transaction request body

    The idea is to create a Transaction object from Insert, Update or Delete methods, passing
    a layername and a feature, then converting the instance into a stringified XML document

    The use of 'xml-js' obliges to respect a data format (compact format here)
 */
import * as converter from 'xml-js'
import MapTools from './MapTools'
import Shape from './Shape';

export default class Transaction {

    constructor() {
        this['_declaration'] = {
            '_attributes': {
                'version': '1.0',
                'encoding': 'utf-8'
            }
        }
        this['wfs:Transaction'] = {
            '_attributes':  {
                'version': '1.1.0',
                'xmlns:topp': 'http://www.openplans.org/topp',
                'xmlns:fes': 'http://www.opengis.net/fes',
                'xmlns:gml': 'http://www.opengis.net/gml',
                'xmlns:wfs': 'http://www.opengis.net/wfs',
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
            },
        }
    }

    /**
     * Return an XML converted Transaction
     * @returns String
     */
    toXML () {
        return converter.js2xml(this, {compact: true, spaces: 4})
    }

    /**
     * Create a formatted geometry tag for Transactions
     * @param geometry : Object - The geometry attribute object with coordinates and type
     * @returns Object
     */
    static formattedGeometry (geometry) {
        const coordinates = MapTools.projection.project(geometry)
        switch (geometry.type) {
            case 'gml:PointPropertyType': return (new Shape(coordinates, Shape.POINT)).create;
            case 'gml:MultiPointPropertyType': return (new Shape(coordinates, Shape.MULTIPOINT)).create;
            case 'gml:PolygonPropertyType' : return (new Shape(coordinates, Shape.POLYGON)).create;
            case 'gml:MultiPolygonPropertyType' : return (new Shape(coordinates, Shape.MULTIPOLYGON)).create;
            case 'gml:LineStringPropertyType' : return (new Shape(coordinates, Shape.POLYLINE)).create;
            case 'gml:MultiLineStringPropertyType' : return (new Shape(coordinates, Shape.MULTIPOLYLINE)).create;
            default: break;
        }
    }

    /**
     * Create formatted Properties tags for an Insert Transaction
     * @param props : Object - The properties of the Feature to insert
     * @returns Object
     */
    static toInsertProperties (props) {
        let res = {}
        for (let key in props) {
            if (props[key].value) {
                (key === 'geometry') 
                    ? res.geometry = Transaction.formattedGeometry(props.geometry) 
                    : res[key] = props[key].value
            }
        }
        return res
    }

    /**
     * Create a formatted Property tag for an Update Transaction
     * @param key : String - The property name
     * @param value : String,Number,Boolean
     * @returns Object
     */
    static toUpdateProperty (key, value) {
        return {
            'wfs:Name': {
                '_text': key
            },
            'wfs:Value': { 
                '_text' : value 
            }
        }
    }

    /**
     * Create a formatted Geometry tag for an Update Transaction
     * @param key : String - The property name
     * @param geometry : Object
     * @returns Object
     */
    static toUpdateGeometry (geometry) {
        const wfsValue = Transaction.formattedGeometry(geometry);
        return {
            'wfs:Name': {
                '_text': 'geometry'
            },
            'wfs:Value': wfsValue
        }
    }

    /**
     * Create a list of formatted Property tags for an Update Transaction
     * @param properties : Object - The feature's properties
     * @returns Object
     */
    static toUpdateProperties (properties) {
        let props = []
        for (let key in properties) {
           if (properties[key].value !== null && properties[key].value !== undefined) {
                (key == 'geometry') 
                    ? props.push(Transaction.toUpdateGeometry(properties.geometry))
                    : props.push(Transaction.toUpdateProperty(key, properties[key].value));
           }
        }
        return props
    }

    
    static properties (feature) {
        if (feature.id) return Transaction.toUpdateProperties(feature.properties)
        return Transaction.toInsertProperties(feature.properties)
    }

    /**
     * Create an Insert Transaction
     * @param feature - The feature to insert
     * @return String - A stringified XML Transaction
     */
    static insert (feature) {
        let t = new Transaction()
        t['wfs:Transaction']['wfs:Insert'] = {}
        t['wfs:Transaction']['wfs:Insert'][feature.parent.properties.name] = Transaction.properties(feature)
        return t
    }

    /**
     * Create an Update Transaction
     * @param feature - The feature to insert
     * @return String - A stringified XML Transaction
     */
    static update (feature) {
        let t = new Transaction()
        t['wfs:Transaction']['wfs:Update'] = {}
        const properties = Transaction.properties(feature)
        t['wfs:Transaction']['wfs:Update'] = {
            '_attributes': {
                'typeName': feature.parent.properties.name
            },
            'wfs:Property': properties,
            'ogc:Filter': {
                'ocg:GmlObjectId': {
                    '_attributes': {
                        'gml:id': feature.id
                    }
                }
            }
        }
        return t
    }

    /**
     * Create a Delete Transaction
     * @param feature - The feature to insert
     * @return String - A stringified XML Transaction
     */
    static delete (feature) {
        let t = new Transaction()
        t['wfs:Transaction']['wfs:Delete'] = {
            '_attributes': {
                'typeName': feature.parent.properties.name
            },
            'ogc:Filter': {
                'ocg:GmlObjectId': {
                    '_attributes': {
                        'gml:id': feature.id
                    }
                }
            }
        }
        return t
    }
}

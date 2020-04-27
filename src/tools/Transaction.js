/*
    Build a WFS Transaction request body

    The idea is to create a Transaction object from Insert, Update or Delete methods, passing
    a layername and a feature, then converting the instance into a stringified XML document

    The use of 'xml-js' obliges to respect a data format (compact format here)
 */

//const converter = require ('xml-js')

import converter from 'xml-js'

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
                'version': '1.3.0',
                'xmlns:topp': 'http://www.openplans.org/topp',
                'xmlns:fes': 'http://www.opengis.net/fes/2.0',
                'xmlns:gml': 'http://www.opengis.net/gml/3.2',
                'xmlns:wfs': 'http://www.opengis.net/wfs/2.0',
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
            },
            'wfs:Insert': {},
            'wfs:Update': {},
            'wfs:Delete': {},
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
     * Create a formatted Point geomerty tag
     * @param geometry : Object - The feature's geometry
     * @returns Object
     */
    static point (geometry) {
        const coordinates = geometry.coordinates.join(',')
        return {
            'gml:Point': {
                'gml:coordinates': {
                    '_text': coordinates
                }
            }
        }
    }

    /**
     * Create a formatted Property tag
     * @param key : String - The property name
     * @param value : String,Number,Boolean,Object
     * @returns Object
     */
    static property (key, value) {
        return {
            'wfs:Property': {
                'wfs:ValueReference': {
                    '_text': key
                },
                'wfs:Value': {
                    '_text': value
                }
            }
        }
    }

    /**
     * Create a list of formatted Property tags
     * @param props : Object - The feature's properties
     * @returns Object
     */
    static properties (props) {
        return props.map(key => Transaction.property(key, props[key]))
    }

    /**
     * Create a formatted MultiPolygon tag
     * @param geomerty : Object - The feature's geometry
     * @returns Object
     */
    static polygon (geomerty) {
        let coordinates = ''
        const coordinatesList = geomerty.coordinates[0][0]
        coordinatesList.forEach(c => {
            coordinates += `${c.join(',')} `
        })
        return {
            'gml:MultiPolygon': {
               'polygonMember': {
                   'Polygon': {
                       'gml:outerBoundaryIs': {
                           'gml:LinearRing': {
                               'gml:coordinates': {
                                   '_text': coordinates
                               }
                           }
                       }
                   }
               }
            }
        }
    }

    /**
     * Create an Insert Transaction
     * @param layer : String - The associated layer name
     * @param feature - The feature to insert
     * @return String - A stringified XML Transaction
     */
    static insert (layer, feature) {
        let t = new Transaction()
        const properties = feature.properties
        if (feature.geometry.coordinates.length === 2) {
            properties['geometry'] = Transaction.point(feature.geometry)
        } else {
            properties['geometry'] = Transaction.polygon(feature.geometry)
        }
        t['wfs:Transaction']['wfs:Insert'][layer] = properties
        return t
    }

    /**
     * Create an Update Transaction
     * @param layer : String - The associated layer name
     * @param feature - The feature to insert
     * @return String - A stringified XML Transaction
     */
    static update (layer, feature) {
        let t = new Transaction()
        const properties = Transaction.properties(feature.properties)
        t['wfs:Transaction']['wfs:Update'] = {
            '_attributes': {
                'typeName': layer
            },
            'wfs:Property': properties,
            'fes:Filter': {
                'fes:ResourceId': {
                    '_attributes': {
                        'rid': feature.id
                    }
                }
            }
        }
        return t
    }

    /**
     * Create a Delete Transaction
     * @param layer : String - The associated layer name
     * @param feature - The feature to insert
     * @return String - A stringified XML Transaction
     */
    static delete (layer, feature) {
        let t = new Transaction()
        t['wfs:Transaction']['wfs:Delete'] = {
            '_attributes': {
                'typeName': layer
            },
            'fes:Filter': {
                'fes:ResourceId': {
                    '_attributes': {
                        rid: feature.id
                    }
                }
            }
        }
        return t
    }
}
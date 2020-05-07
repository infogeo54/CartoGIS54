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
                'version': '1.1.0',
                'xmlns:topp': 'http://www.openplans.org/topp',
                'xmlns:fes': 'http://www.opengis.net/fes',
                'xmlns:gml': 'http://www.opengis.net/gml',
                'xmlns:wfs': 'http://www.opengis.net/wfs',
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
            }
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
        const x = geometry.coordinates.x
        const y = geometry.coordinates.y
        const pos = `${x} ${y}`
        return {
            'gml:Point': {
                '_attributes': {
                    'srsName': "EPSG:2154"
                },
                'gml:pos': {
                    '_attributes': {
                        'srsDimension': 2
                    },
                    '_text': pos
                }
            }
        }
    }

    static toInsertProperties (props) {
        let res = {}
        for (let key in props) {
            if (props[key]) res[key] = props[key]
        }
        return res
    }

    /**
     * Create a formatted Property tag
     * @param key : String - The property name
     * @param value : String,Number,Boolean,Object
     * @returns Object
     */
    static property (key, value) {
        return {
            'wfs:Name': {
                '_text': key
            },
            'wfs:Value': {
                '_text': value
            }
        }
    }

    /**
     * Create a list of formatted Property tags
     * @param properties : Object - The feature's properties
     * @returns Object
     */
    static properties (properties) {
        let props = []
        for (let key in properties) {
           if (properties[key]) {
               props.push(Transaction.property(key, properties[key]))
           }
        }
        return props
    }

    /**
     * Create a formatted MultiPolygon tag
     * @param geomerty : Object - The feature's geometry
     * @returns Object
     */
    static polygon (geomerty) {
        let coordinates = ''
        const coordinatesList = geomerty.coordinates
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
     * @param feature - The feature to insert
     * @return String - A stringified XML Transaction
     */
    static insert (feature) {
        let t = new Transaction()
        t['wfs:Transaction']['wfs:Insert'] = {}
        const properties = Transaction.toInsertProperties(feature.properties)
        if (feature.geometry.coordinates.length === 2) {
            properties.geometry = Transaction.point(feature.getConvertedGeometry())
        } else {
            properties.geometry = Transaction.polygon(feature.getConvertedGeometry())
        }
        t['wfs:Transaction']['wfs:Insert'][feature.parent] = properties
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
        const properties = Transaction.properties(feature.properties)
        t['wfs:Transaction']['wfs:Update'] = {
            '_attributes': {
                'typeName': feature.parent
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
                'typeName': feature.parent
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
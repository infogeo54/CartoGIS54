/*
    Build a WFS Transaction request body

    The idea is to create a Transaction object from Insert, Update or Delete methods, passing
    a layername and a feature, then converting the instance into a stringified XML document

    The use of 'xml-js' obliges to respect a data format (compact format here)
 */
import * as converter from 'xml-js'
import MapTools from './MapTools'

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
     * Create a formatted Point geomerty tag
     * @param coordinates : Object - The point's coordinates
     * @returns Object
     */
    static point (coordinates) {
        const x = coordinates.x
        const y = coordinates.y
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

    /**
     * Create a formatted MultiPolygon tag
     * @param coordinates : Array<Array> - The polygon's coordinates
     * @returns Object
     */
    static polygon (coordinates) {
        coordinates = coordinates.concat(coordinates[0]) // Closing polygon
        const coordinatesList = coordinates.map(c => [c.x, c.y])
        return {
            'gml:MultiPolygon': {
                '_attributes': {
                    'srsName': "EPSG:2154"
                },
                'gml:polygonMember': {
                    'gml:Polygon': {
                        '_attributes': {
                            'srsName': "EPSG:2154"
                        },
                        'gml:exterior': {
                            'gml:LinearRing': {
                                '_attributes': {
                                    'srsName': "EPSG:2154"
                                },
                                'gml:posList': {
                                    '_attributes': {
                                        'srsDimension': 2
                                    },
                                    '_text': coordinatesList.flat().join(' ')
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Create a formatted geometry tag for Insert and Update Transactions
     * @param geometry
     * @returns Object
     */
    static formattedGeometry (geometry) {
        const coordinates = MapTools.projection.project(geometry.coordinates)
        if (Array.isArray(coordinates)) return Transaction.polygon(coordinates)
        return Transaction.point(coordinates)
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
                if (key === 'geometry') {
                    res.geometry = Transaction.formattedGeometry(props.geometry.value)
                } else {
                    res[key] = props[key].value
                }
            }
        }
        return res
    }

    /**
     * Create a formatted Property tag for an Update Transaction
     * @param key : String - The property name
     * @param value : String,Number,Boolean,Object
     * @returns Object
     */
    static toUpdateProperty (key, value) {
        let wfsValue = key === 'geometry' ? Transaction.formattedGeometry(value) : { '_text' : value }
        return {
            'wfs:Name': {
                '_text': key
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
           if (properties[key].value) {
               props.push(Transaction.toUpdateProperty(key, properties[key].value))
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

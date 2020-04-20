/*
    Build a Transaction
 */

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
     * Create a Point geomerty format
     * @param geometry : Object - The feature's geometry
     * @returns Object
     */
    static point (geometry) {
        const coordinates = geometry.coordinates.split(',')
        return {
            'gml:Point': {
                'gml:coordinates': {
                    '_text': coordinates
                }
            }
        }
    }

    /**
     * Create a Polygon geomerty format
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
        if (feature.geometry.length === 2) {
            properties['geometry'] = Transaction.point(feature.geometry)
        } else {
            properties['geometry'] = Transaction.polygon(feature.geometry)
        }
        t['wfs:Transaction']['wfs:Insert'][layer] = properties
        return converter.js2xml(t, {compact: true, spaces: 4})
    }

    static update (layer, feature) {
    }

    static delete (feature) {

    }
}
/*
    Build the geometry part of a WFS Transaction request body
 */
export default class Shape {

    _attributes = {
        'srsName': "EPSG:2154"
    }      

    /**
     * Create an Shape Instance
     * 
     * @param { Array|Array<Array>|object } coordinates - The coordinate(s) of the shape
     * @param { ('POINT'|'POLYGON'|'POLYLINE'|'MULTIPOINT'|'MULTIPOLYGON'|'MULTIPOLYLINE') } type - The type of shape, you can use the static attributes
     */
    constructor(coordinates, type){
        this.coordinates = coordinates
        this.type = type
    }

    /**
     * Return A WFS geometry tag as on object depending on the Shape type
     * 
     * @returns { object } A WFS geometry tag
     */
    get create() {
        switch (this.type) {
            case 'POINT': return this._point()
            case 'MULTIPOINT': return this._multiPoint()
            case 'POLYGON': return this._polygon()
            case 'MULTIPOLYGON': return this._multiPolygon()    
            case 'POLYLINE': return this._polyline()
            case 'MULTIPOLYLINE': return this._multiPolyline()   
            default : return new Error('Type not accepted');  
        }
    }

    _point () {
        const x = this.coordinates.x
        const y = this.coordinates.y
        const pos = `${x} ${y}`
        return {
            'gml:Point': {
                '_attributes': this._attributes,
                'gml:pos': {
                    '_attributes': {
                        'srsDimension': 2
                    },
                    '_text': pos
                }
            }
        }
    }

    _multiPoint () {
        const point = this._point()
        return {
            'gml:MultiPoint': {
                '_attributes': this._attributes,
                'gml:pointMember' : {
                    point
                }
            }
        }
    }



    _polygon () {
        const closedPolygon = this.coordinates.concat(this.coordinates[0]) // Closing multiPolygon
        const coordinatesList = closedPolygon.map(c => [c.x, c.y]).flat().join(' ')
        return {
            'gml:Polygon': {
                '_attributes': this._attributes,
                'gml:exterior': {
                    'gml:LinearRing': {
                        '_attributes': this._attributes,
                        'gml:posList': {
                            '_attributes': {
                                'srsDimension': 2
                            },
                            '_text': coordinatesList
                        }
                    }
                }
            }
        }
    }

    _multiPolygon () {
        const polygon = this._polygon()
        return {
            'gml:MultiPolygon': {
                '_attributes': this._attributes,
                'gml:polygonMember': {
                    polygon
                }
            }
        }
    }

    _polyline () {
        const coordinatesList = this.coordinates.map(c => [c.x, c.y])
        return {
            'gml:LineString': {
                '_attributes': this._attributes,
                'gml:exterior': {
                    'gml:LinearRing': {
                        '_attributes': this._attributes,
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

    _multiPolyline () {
        const polyline = this._polyline()
        return {
            'gml:MultiLineString': {
                '_attributes': this._attributes,
                'gml:lineStringMember': {
                    polyline
                }
            }
        }
    }
} 
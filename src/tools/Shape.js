export default class Shape {

    static POINT = 0;
    static POLYGON = 1;
    static POLYLINE = 2;
    static MULTIPOINT = 3;
    static MULTIPOLYGON = 4;
    static MULTIPOLYLINE = 5;

    _attributes = {
        'srsName': "EPSG:2154"
    }
        

    constructor(coordinates, type){
        this.coordinates = coordinates
        this.type = type
    }

    get create() {
        switch (this.type) {
            case Shape.POINT: return this.point()
            case Shape.MULTIPOINT: return this.multiPoint()
            case Shape.POLYGON: return this.polygon()
            case Shape.MULTIPOLYGON: return this.multiPolygon()    
            case Shape.POLYLINE: return this.polyline()
            case Shape.MULTIPOLYLINE: return this.multiPolyline()        
        }
        return this.type
    }

    point () {
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

    multiPoint () {
        const point = this.point()
        return {
            'gml:MultiPoint': {
                '_attributes': this._attributes,
                'gml:pointMember' : {
                    point
                }
            }
        }
    }



    polygon () {
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

    multiPolygon () {
        const polygon = this.polygon()
        return {
            'gml:MultiPolygon': {
                '_attributes': this._attributes,
                'gml:polygonMember': {
                    polygon
                }
            }
        }
    }

    polyline () {
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

    multiPolyline () {
        const polyline = this.polyline()
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
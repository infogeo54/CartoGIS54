/*
    Tools to help managing the map
 */

import L from 'leaflet'
import proj4 from 'proj4'
import 'leaflet-editable'
import path from "path"
import 'leaflet-measure-path/leaflet-measure-path'
require('leaflet-measure-path/leaflet-measure-path.css')
import 'leaflet-draw'
import 'leaflet-geometryutil/src/leaflet.geometryutil'

// Adding EPSG:2154 to proj4 projections
proj4.defs("EPSG:2154", "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs")


export default {
    map: {
        /**
         * Create a Leaflet map instance
         * @param x : number - The longitude of the point where the map will be centered
         * @param y : number - The latitude of the point where the map will be centered
         * @param minZoom : number - The minimum zoom of the map
         * @param isLimited : boolean - If the map is limited by the maxbounds (disable the free roaming)
         * 
         * @returns Object
         */
        create (x, y, minZoom, isLimited, layers) {
            const map = L.map('map', { editable: true})
            const center = L.latLng(y, x);
            map.setView(center, minZoom)
            map.doubleClickZoom.disable()
            
            // set the Layers
            let baseLayers = {};
            let defaultLayer=null;
            if (layers.length) {
                layers.forEach((layer) => {
                    baseLayers[layer.name] = L.tileLayer(layer.uri, {
                        attribution: layer.attribution,
                        minZoom: minZoom,
                        maxZoom: 18
                    })
                    if(layer.default) defaultLayer = layer.name;
                })
            }else {
                baseLayers = {
                    Satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                        attribution: 'données © ESRI.WorldImagery',
                        minZoom: minZoom,
                        maxZoom: 18
                    })
                }
                defaultLayer = 'Satellite'
            }
            if(defaultLayer==null) defaultLayer = Object.keys(baseLayers)[0]
            baseLayers[defaultLayer].addTo(map)
            
            L.control.layers(baseLayers).addTo(map);
            L.control.scale().addTo(map);

            // Diable the free roaming <=> you can't go outside the town
            if (isLimited) map.setMaxBounds(map.getBounds());

            map.setZoom(minZoom+1)

            return map
        },
        /**
         * Add representations to a map
         * @param map : L.map - A Leaflet map instance
         * @param representations : Array<Object>
         */
        representations (map, representations) {
            representations.forEach(r => r.addTo(map))
        },
    },
    representation: {
        /**
         * Build a feature's representation (marker or polygon)
         * @param f : Feature - The feature to represent
         * @param cb : Function - The function to trigger when the representation is clicked
         * @returns Leaflet Layer
         */
        create (f, cb) {
            let rep = null
            switch (f.type) {
                case 'point': rep = this.marker(f)
                    break;

                case 'polygon': rep = this.polygon(f)
                    break;
            
                case 'polyline': rep = this.polyline(f)
                    break;                    
            }

            rep.on('click', (e) => {
                L.DomEvent.stopPropagation(e) // Avoid map clicked event when a feature is clicked
                cb()
            })
                return rep
        },
        /**
         * Create a Leaflet marker representation
         * @param f : Feature - The feature to represent
         * @returns Leaflet Layer
         */
        marker (f) {
            const icon = this.icon(f)
            let marker = L.marker(f.coordinates, {icon: icon})
            return marker
        },
        /**
         * Create a Leaflet polygon representation
         * @param f : Feature
         * @returns Leaflet Layer
         */
        polygon (f) {
            let color = 'blue'
            let fillColor = 'blue'
            let strokeWidth = 2
            let lineJoin = 'bevel'

            if(f.style){
                color = f.style.polygonSymbolizer.stroke.color
                fillColor = f.style.polygonSymbolizer.fill.svgParameter[0]
                strokeWidth = f.style.polygonSymbolizer.stroke.width * 2
                lineJoin = f.style.polygonSymbolizer.stroke.join
            }
            return L.polygon(f.coordinates, {
                fillColor,
                color,
                lineJoin,
                fillOpacity: 0.5,
                weight: strokeWidth,

            })
        },

        /**
         * Create a Leaflet polyline representation
         * @param f : Feature
         * @returns Leaflet Layer
         */
        polyline (f) { 
            let color = 'blue'
            let strokeWidth = 2
            let lineJoin = 'round'
            let lineCap = 'round'
            
            if(f.style){
                color = f.style.lineSymbolizer.stroke.color
                strokeWidth = f.style.lineSymbolizer.stroke.width * 2
                lineJoin = f.style.lineSymbolizer.stroke.join
                lineCap = f.style.lineSymbolizer.stroke.lineCap
            }
            return L.polyline(f.coordinates, {
                color,
                lineJoin,
                lineCap,
                weight: strokeWidth
            })
        },

        /**
         * Create a Leaflet marker custom icon
         * @param f : Feature - The feature to represent
         * @returns layers: 'layer/list',
         */
        icon (f) {
            let icon
            if(f.style && f.style.pointSymbolizer.graphic.externalGraphic){
                const url = f.style.pointSymbolizer.graphic.externalGraphic[1].onlineResource.href
                const basename = path.basename(url)
                icon = require(`../../public/img/icons/${basename}`)
            }

            if(!icon){
                try { icon = require(`@/assets/icons/${f.properties.type.value}.svg`) }
                catch { icon = require('@/assets/icons/poi.svg') }
            } 
            return L.icon({
                iconUrl: icon,
                iconSize: [50, 50],
                iconAnchor: [28, 55],
                popupAnchor: [-3, -76],
            })
        },
    },
    projection: {
        /**
         * Project a Point's coordinates from EPSG:900913 to EPSG:2154
         * @param coordinates : Array - Point's coordinates
         * @returns Object - A proj4 Point instance
         */
        point (coordinates) {
            const latlng = L.latLng(coordinates)
            const projection = L.Projection.SphericalMercator.project(latlng)
            return proj4('EPSG:900913', 'EPSG:2154', projection)
        },
        /**
         * Project a Polygon or a Polyline's coordinates from EPSG:900913 to EPSG:2154
         * @param coordinates : Array - list of points
         * @returns Array - A list of proj4 Point instance
         */
        multiplePoints (coordinates) {
            return coordinates.map(c => this.point(c))
        },
        /**
         * Project coordinates from EPSG:900913 to EPSG:2154
         * @param coordinates : Array - Feature's coordinates
         * @returns Array | Object - A list or an instance of proj4 Point
         */
        project (geometry) {
            const coordinates = (geometry.coordinates) ? geometry.coordinates : geometry.value.coordinates
            if (Array.isArray(coordinates[0])) {
                return this.multiplePoints(coordinates)
            }
            return this.point(coordinates)
        }
    },
    
}

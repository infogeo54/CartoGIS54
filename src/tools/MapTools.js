/*
    Tools to help managing the map
 */

import L, { Map, Icon, Marker, Polygon, Polyline} from 'leaflet'
import { bus } from '@/main.js' 
import proj4 from 'proj4'
import 'leaflet-editable'
import path from "path"
import 'leaflet-measure-path/leaflet-measure-path'
require('leaflet-measure-path/leaflet-measure-path.css')
import 'leaflet-draw'
import 'leaflet-geometryutil/src/leaflet.geometryutil'
import Feature from '@/models/Feature'

// Adding EPSG:2154 to proj4 projections
proj4.defs("EPSG:2154", "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs")

export default {
    map: {
        /**
         * Create a Leaflet map instance
         * 
         * @param { number } x - The longitude of the point where the map will be centered
         * @param { number } y - The latitude of the point where the map will be centered
         * @param { number } minZoom - The minimum zoom on the map
         * @param { boolean } isLimited - Is the map limited by the maxbounds (it disables the free roaming)
         * @param { Array<object> } layers - The layers for the selection of the background map
         * 
         * @returns { Map } The leaflet Map instance
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
         * 
         * @param { Map } map - A Leaflet map instance
         * @param { Array<object> } representations : A list of representations
         */
        representations (map, representations) {
            representations.forEach(r => r.addTo(map))
        },
    },
    representation: {

        /**
         * Build a feature's representation (marker, polygon or polyline)
         *
         * 
         * @param { Feature } f - The feature to represent
         * @param { Function } cb - The callback that handles click
         * 
         * 
         * @returns { (Marker|Polygon|Polyline) } A Leaflet Vector Layer
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

            rep.on('dragend', function(e){
                bus.$emit('draggedMarker', e.target._latlng);
            })
            return rep
        },


        /**
         * Create a Leaflet marker representation
         * 
         * @param { Feature } f - The feature to represent
         * 
         * @returns { Marker } A Leaflet Marker
         */
        marker (f) {
            const icon = this.icon(f)
            let marker = L.marker(f.coordinates, {icon: icon})
            return marker
        },
        /**
         * Create a Leaflet polygon representation
         * 
         * @param { Feature } f - The feature to represent
         * 
         * @returns { Polygon } A Leaflet Polygon
         * 
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
         * 
         * @param { Feature } f - The feature to represent
         * 
         * @returns { Polyline } A Leaflet Polyline
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
         * 
         * @param { Feature } f - The feature to represent
         * 
         * @returns { Icon }: A Leaflet Icon
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
         * 
         * @param { Array<number> } coordinates - The point's coordinates
         * 
         * @returns { Array<number> } The point's coordinates projected
         */
        point (coordinates) {
            const latlng = L.latLng(coordinates)
            const projection = L.Projection.SphericalMercator.project(latlng)
            return proj4('EPSG:900913', 'EPSG:2154', projection)
        },
        /**
         * Project a multi-vertexes shape's coordinates from EPSG:900913 to EPSG:2154
         * 
         * @param { Array<Array<number>> } coordinates - The shape's coordinates, as a list
         * 
         * @returns { Array<number> } The shape's coordinates projected, as a list
         */
        multiplePoints (coordinates) {
            return coordinates.map(c => this.point(c))
        },
        /**
         * Project coordinates from EPSG:900913 to EPSG:2154
         * 
         * @param { object } geometry - The geometry attribute object
         * @param { (Array<number> | Array<Array<number>>) } [geometry.coordinates] - The shape's coordinates
         * @param { object } [geometry.value] - Contains the coordinates
         * @param { (Array<number> | Array<Array<number>>) } geometry.value.coordinates - The shape's coordinates
         * 
         * @returns { (Array<number> | Array<Array<number>>) } The shape's coordinates projected, as a list
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

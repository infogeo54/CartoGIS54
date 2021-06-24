/*
    Tools to help managing the map
 */

import L from 'leaflet'
import proj4 from 'proj4'
import 'leaflet-editable'
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
         * @param center : Array<number> - The point where the map will be centered
         * @returns Object
         */
        create (center) {
            const map = L.map('map', { editable: true})
            map.setView(center, 14)
            map.doubleClickZoom.disable()
            const baseLayers = {
                Carte : L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
                    attribution: 'données © OpenStreetMap/ODbL - rendu OSM France',
                    minZoom: 14,
                    maxZoom: 18
                }),
                Satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'données © ESRI.WorldImagery',
                    minZoom: 14,
                    maxZoom: 18
                })
            }

            baseLayers.Satellite.addTo(map)
            
            L.control.layers(baseLayers).addTo(map);
            L.control.scale().addTo(map);

            //Can't go outside the bounds (here the town);
            map.setMaxBounds(map.getBounds());

            map.setZoom(15)

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

            switch (f.properties.geometry.type) {
                case 'gml:PointPropertyType':
                    rep = this.marker(f)
                    break;

                case 'gml:MultiPolygonPropertyType':
                    rep = this.polygon(f)
                    break;
            
                case 'gml:MultiLineStringPropertyType':
                    rep = this.polyline(f)
                    break;
                    
                default:
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
            return L.polygon(f.coordinates, {fillOpacity: 0.5})
        },
        /**
         * Create a Leaflet polyline representation
         * @param f : Feature
         * @returns Leaflet Layer
         */
        polyline (f) {
            return L.polyline(f.coordinates, {fillOpacity: 0.5})
        },
        /**
         * Create a Leaflet marker custom icon
         * @param f : Feature - The feature to represent
         * @returns layers: 'layer/list',
         */
        icon (f) {
            let icon
            try { icon = require(`@/assets/icons/${f.properties.type.value}.svg`) }
            catch { icon = require('@/assets/icons/poi.svg') }
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
         * @param coordinates : Array - Polygon/Polyline's list of points
         * @returns Array - A list of proj4 Point instance
         */
        polygonPolyline (coordinates) {
            return coordinates.map(c => this.point(c))
        },
        

        /**
         * Project coordinates from EPSG:900913 to EPSG:2154
         * @param coordinates : Array - Feature's coordinates
         * @returns Array | Object - A list or an instance of proj4 Point
         */
        project (coordinates) {
            if (Array.isArray(coordinates[0])) {
                return this.polygonPolyline(coordinates)
            }
            return this.point(coordinates)
        }
    },
    
}

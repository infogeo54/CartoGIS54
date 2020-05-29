/*
    Tools to help managing the map
 */

import L from 'leaflet'
import proj4 from 'proj4'

// Adding EPSG:2154 to proj4 projections
proj4.defs("EPSG:2154", "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs")

export default {
    map: {
        /**
         * Create a Leaflet map instance
         * @param center : Array<number> - The point where the map will be centered
         * @returns Object
         */
        create: function (center) {
            const map = L.map('map').setView(center, 15)
            L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
                attribution: 'données © OpenStreetMap/ODbL - rendu OSM France',
                minZoom: 1,
                maxZoom: 20
            }).addTo(map)
            return map
        },
        /**
         * Add representations to a map
         * @param map : L.map - A Leaflet map instance
         * @param representations : Array<Object>
         */
        representations: function (map, representations) {
            representations.forEach(r => r.addTo(map))
        }
    },
    representation: {
        /**
         * Build a feature's representation (marker or polygon)
         * @param f : Feature - The feature to represent
         * @param cb : Function - The function to trigger when the representation is clicked
         * @returns Leaflet Layer
         */
        create: function (f, cb) {
            const rep = f.parent.shape === 'Point' ? this.marker(f) :  this.polygon(f)
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
        marker: function (f) {
            const icon = this.icon(f)
            return L.marker(f.coordinates, {icon: icon})
        },
        /**
         * Create a Leaflet poylgon representation
         * @param f : Feature
         * @returns Leaflet Layer
         */
        polygon: function (f) {
            return L.polygon(f.coordinates, {fillOpacity: 0.5})
        },
        /**
         * Create a Leaflet marker custom icon
         * @param f : Feature - The feature to represent
         * @returns layers: 'layer/list',
         */
        icon: function (f) {
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
        point: function (coordinates) {
            const latlng = L.latLng(coordinates)
            const projection = L.Projection.SphericalMercator.project(latlng)
            return proj4('EPSG:900913', 'EPSG:2154', projection)

        },
        /**
         * Project a Polygon's coordinates from EPSG:900913 to EPSG:2154
         * @param coordinates : Array - Polygon's list of points
         * @returns Array - A list of proj4 Point instance
         */
        polygon: function (coordinates) {
            return coordinates.map(c => this.point(c))
        },

        /**
         * Project coordinates from EPSG:900913 to EPSG:2154
         * @param coordinates : Array - Feature's coordinates
         * @returns Array | Object - A list or an instance of proj4 Point
         */
        project: function (coordinates) {
            if (Array.isArray(coordinates[0])) {
                return this.polygon(coordinates)
            }
            return this.point(coordinates)
        }
    }
}

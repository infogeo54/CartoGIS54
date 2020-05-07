/*
    Tools to help managing the map
 */

import L from 'leaflet'
import proj4 from 'proj4'

// Adding EPSG:2154 to proj4 projections
proj4.defs("EPSG:2154", "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs")

export default {
    createIcon: function (feature) {
        let icon
        try { icon = require(`@/assets/icons/${feature.properties.type}.svg`) }
        catch { icon = require('@/assets/icons/poi.svg') }
        return L.icon({
            iconUrl: icon,
            iconSize: [50, 50],
            iconAnchor: [28, 55],
            popupAnchor: [-3, -76],
        })
    },
    /**
     * Create a Leaflet marker representation
     */
    createMarker: function (feature, coordinates) {
        const icon = this.createIcon(feature)
        return L.marker(coordinates, {icon: icon})
    },
    /**
     * Create a Leaflet poylgon representation
     */
    createPolygon: function (coordinates) {
        return L.polygon(coordinates, {fillOpacity: 0.5})
    },
    /**
     * Build a feature's representation (marker or polygon)
     */
    representation: function (f, cb) {
        const coord = f.geometry.coordinates
        const rep = coord.length === 2 ? this.createMarker(f, coord) :  this.createPolygon(coord)
        if (cb) rep.on('click', () => cb(f))
        return rep
    },

    /**
     * Project a Point's coordinates from EPSG:900913 to EPSG:2154
     * @param coordinates : Array - Point's coordinates
     * @returns Object - A proj4 Point instance
     */
    projectPoint: function (coordinates) {
        const latlng = L.latLng(coordinates)
        const projection = L.Projection.SphericalMercator.project(latlng)
        return proj4('EPSG:900913', 'EPSG:2154', projection)

    },
    /**
     * Project a Polygon's coordinates from EPSG:900913 to EPSG:2154
     * @param coordinates : Array - Polygon's list of points
     * @returns Array - A list of proj4 Point instance
     */
    projectPolygon: function (coordinates) {
        return coordinates.map(c => this.projectPoint(c))
    },

    /**
     * Project coordinates from EPSG:900913 to EPSG:2154
     * @param coordinates : Array - Feature's coordinates
     * @returns Array | Object - A list or an instance of proj4 Point
     */
    project: function (coordinates) {
        if (Array.isArray(coordinates[0])) {
            return this.projectPolygon(coordinates)
        }
        return this.projectPoint(coordinates)
    }


}

/*
    Tools to help managing the map
 */

import L from 'leaflet'
import proj4 from 'proj4'
import feature from '@/store/modules/feature'

// Adding EPSG:2154 to proj4 projections
proj4.defs("EPSG:2154", "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs")

export default {
    /**
     * Create a Leaflet map instance
     * @param center : Array<number> - The point where the map will be centered
     * @returns Object
     */
    createMap: function (center) {
        const map = L.map('map').setView(center, 15)
        L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            attribution: 'données © OpenStreetMap/ODbL - rendu OSM France',
            minZoom: 1,
            maxZoom: 20
        }).addTo(map)
        return map
    },
    /**
     * Create a Leaflet marker custom icon
     * @param feature : Feature - The feature to represent
     * @returns layers: 'layer/list',
     */
    createIcon: function (feature) {
        let icon
        try { icon = require(`@/assets/icons/${feature.properties.type.value}.svg`) }
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
     * @param feature : Feature - The feature to represent
     * @param coordinates : Array
     * @returns Leaflet Layer
     */
    createMarker: function (feature, coordinates) {
        const icon = this.createIcon(feature)
        return L.marker(coordinates, {icon: icon})
    },
    createPoint: function(coordinates) {
        const icon = L.icon({
            iconUrl: require('@/assets/icons/dot.svg'),
            iconSize: [10, 10]
        })
        return L.marker(coordinates, {icon: icon})
    },
    /**
     * Create a Leaflet poylgon representation
     * @param coordinates : Array<Array>
     * @returns Leaflet Layer
     */
    createPolygon: function (coordinates) {
        return L.polygon(coordinates, {fillOpacity: 0.5})
    },
    /**
     * Build a feature's representation (marker or polygon)
     * @param f : Feature - The feature to represent
     * @returns Leaflet Layer
     */
    createRepresentation: function (f) {
        const coord = f.properties.geometry.value.coordinates
        const rep = coord.length === 2 ? this.createMarker(f, coord) :  this.createPolygon(coord)
        rep.on('click', (e) => {
            L.DomEvent.stopPropagation(e) // Avoid map clicked event when a feature is clicked
            feature.mutations.setOgProperties(feature.state, f.copyProperties()) // Copying original properties
            feature.mutations.setSelected(feature.state, f)
        })
        return rep
    },
    /**
     * Add representations to a map
     * @param map : L.map - A Leaflet map instance
     * @param representations : Array<Object>
     */
    addRepresentations: function (map, representations) {
        representations.forEach(r => r.addTo(map))
    },
    handlePoint: function (feature, point) {
        feature.coordinates = point
        return feature.createRepresentation()
    },
    handlePolygon: function (feature, point) {
        console.log(point)
    },
    manageFeature: function (feature, point) {
        if (feature.representation) feature.representation.remove() // Removing existing representation
        if (feature.parent.shape === 'Point') return this.handlePoint(feature, point)
        else return this.handlePolygon(feature, point)
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

/*
    Tools to help managing the map
 */

import L from 'leaflet'

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
    representation: function (feature) {
        const coordinates = feature.geometry.coordinates // WFS sends reversed coordinates
        if (coordinates.length === 2) {
            return this.createMarker(feature, coordinates)
        }
        return this.createPolygon(coordinates)
    }
}

/*
    Tools to help managing the map
 */

import L from 'leaflet'

export default {
    createIcon: function (feature) {
        let icon
        try {
            icon = require(`../assets/icons/${feature.properties.type}.svg`)
        } catch (e) {
            console.log(e)
            icon = require('../assets/icons/poi.svg')
        }
        return L.icon({
            iconUrl: icon,
            iconSize: [48, 105],
            iconAnchor: [30, 102],
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
        let polygon = coordinates[0][0] // WFS sends an array of reversed coordinates
        let points = []
        for (let p of polygon) {
            p = p.reverse()
            points.push(p)
        }
        return L.polygon(points, {fillOpacity: 0.5})
    },
    /**
     * Create a representation's popup
     */
    createPopUp: function (feature) {
        const props = feature.properties
        return `<h3>${props.nom}</h3>
                <table>
                    <tr>
                        <th>Type</th>
                        <td>${props.type}</td>
                    </tr>
                </table>`
    },
    /**
     * Build a feature's representation (marker or polygon)
     */
    representation: function (feature) {
        let rep
        const coordinates = feature.geometry.coordinates.reverse() // WFS sends reversed coordinates
        if (coordinates.length === 2) {
            rep = this.createMarker(feature, coordinates)
        } else {
            rep = this.createPolygon(coordinates)
        }
        const popup = this.createPopUp(feature)
        return rep.bindPopup(popup)
    }
}

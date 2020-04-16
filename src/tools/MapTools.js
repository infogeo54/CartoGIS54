/*
    Tools to help managing the map
 */

import L from 'leaflet'

export default {
    createMarker: function (feature) {
        return L.marker(feature.geometry.coordinates.reverse()) // WFS sends reversed coordinates
    },
    createPolygon: function (coordinates) {
        let polygon = coordinates[0][0] // WFS sends an array of reversed coordinates
        let points = []
        for (let p of polygon) {
            p = p.reverse()
            points.push(p)
        }
        return L.polygon(points, {fillOpacity: 0.5})
    },
    createPopUp: function (feature) {
        const props = feature.properties
        return `<h3>${props.nom}</h3>
                <table>
                    <tr>
                        <th>Type</th>
                        <td>${props.type}</td>
                    </tr>
                </table>`
    }
}

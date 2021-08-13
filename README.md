# CartoGIS54

A **GIS Web client** that helps you to manage geodata provided by a WMS/WFS Server like QGIS Server or GeoServer.

## Stack

The interface is developed with [Vue.js](https://github.com/vuejs/vue.git) and the state is managed thanks to [Vuex](https://github.com/vuejs/vuex.git).

The map is integrated using [Leaflet](https://github.com/Leaflet/Leaflet).

HTTP requets are made using [axios](https://github.com/axios/axios).

## Map 

The Map can be configure with 4 parameters : 
- `x` : the latitude of the center,
- `y` : the longitude of the center,
- `minZoom` : the minimum zoom on the map (== at this value, we can't zoom out more),
- `isLimited` : is the map blocked by the map's bounds, or can we roam outside.

Even if the default parameters can be changed in the `app.config.json` file. You can change them at any moment by in the URL as GET parameters add the ones you want to change and assign them a new value. For exemples: 
- myCartogis.app/?x=50&y=50&minZoom=10&isLimited=false
- myCartogis.app/?isLimited=false
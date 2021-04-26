import L from 'leaflet';

export default {
    namespaced: true,
    state: {
        type: null,
        feature: null,
        latlngs: [],
    },
    getters: {
        type: state => state.type,
        feature: state => state.feature,
        latlngs: state => state.latlngs,
        quickMeasure: (state) => {
            return { type : state.type, latlngs : state.latlngs };
        },
    },
    mutations: {
        setType: function (state, type = null) {
            switch (type) {
                case 'polygon':
                case 'polyline':
                    state.type = type;
                    break;
            
                default:
                    break;
            }
        },

        addLatLng: function (state, latlng){
            state.latlngs.push(latlng);
        },

        spliceLatlng: function (state, { index, size, point }){
            if (point == null) state.latlngs.splice(index, size);
            else state.latlngs.splice(index, size, point);
        },

        cancel: function (state){
            if(state.feature != null) state.feature.remove();
            state.feature = null;
            state.type = null;
            state.latlngs = [];
        },

    },
    actions: {
        addToMap: function ({state, rootGetters}){
            if (state.feature != null) {
                state.feature.remove();
            }
            switch (state.type) {
                case 'polygon':
                    state.feature = L.polygon(state.latlngs, {color: 'red'});
                    break;
                
                case 'polyline':
                    state.feature = L.polyline(state.latlngs, {color: 'red'});
                    break;
                
                default:
                    break;
            }
            state.feature.addTo(rootGetters.map).showMeasurements();
        },

        addLatlng: function ({commit, dispatch}, latlng){
            commit('addLatLng', latlng);
            dispatch('addToMap');

        },


        spliceVertex: function ({commit, dispatch }, { index, size, point = null} ){
            commit('spliceLatlng', { index, size, point });
            dispatch('addToMap');
        },


    }
};
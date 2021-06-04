import Vue from 'vue'
import Vuex from 'vuex'

import layer from './modules/layer'
import feature from './modules/feature'
import form from './modules/form'
import quickMeasure from './modules/quickMeasure'
import { bus } from '@/main.js'


Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        map: null,
    },
    getters: {
        map: state => state.map,
        isDrawing: () => {
            if ((feature.state.selected && (feature.state.editable || feature.state.selected.id == undefined)) 
                || quickMeasure.state.type != null) {
                return true;
            }  
            return false
        },
    },
    mutations: {
        setMap: function (state, map) {
            state.map = map
        },
    },
    actions: {
        reset: function ({commit}) {
            bus.$emit('resetIsMeasuring', null)
            commit('feature/reset')
            commit('layer/setSelected', null)
            commit('form/setVisibility', false)
            commit('feature/setEditable', false)
        },
        centerOnFeature: function ({ state }) {
            let c = (feature.state.selected.coordinates[0].length) 
            ? feature.state.selected.representation.getBounds().getCenter() 
            : c = feature.state.selected.coordinates;
            state.map.panTo(c);
        }
    },
    modules : {
        layer,
        feature,
        form,
        quickMeasure,
    },
})

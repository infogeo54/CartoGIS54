import Vue from 'vue'
import Vuex from 'vuex'

import layer from './modules/layer'
import feature from './modules/feature'
import map from './modules/map'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
    },
    getters: {
    },
    mutations: {
    },
    actions: {
        reset: function ({dispatch}) {
            dispatch('map/reset')
            dispatch('feature/reset')
        }
    },
    modules : {
        layer,
        feature,
        map
    }
})
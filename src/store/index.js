import Vue from 'vue'
import Vuex from 'vuex'

import layer from './modules/layer'
import feature from './modules/feature'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        map: null,
    },
    getters: {
        map: state => state.map,
    },
    mutations: {
        setMap: function (state, map) {
            state.map = map
        }
    },
    actions: {
        reset: function ({commit}) {
            commit('feature/reset')
            commit('layer/setSelected', null)
        }
    },
    modules : {
        layer,
        feature,
    }
})

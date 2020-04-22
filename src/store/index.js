import Vue from 'vue'
import Vuex from 'vuex'

import layer from './modules/layer'
import feature from './modules/feature'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        capabilities: null,
    },
    getters: {
        capabilities: state => { return state.capabilities },
    },
    mutations: {
        setCapabilities: function (state, capabilities) {
            state.capabilities = capabilities
        }
    },
    actions: {
    },
    modules : {
        layer,
        feature
    }
})
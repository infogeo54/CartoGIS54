import Feature from '../../models/Feature'

export default {
    namespaced: true,
    state: {
        selected: new Feature(),
        type: null
    },
    getters: {
        selected: state => state.selected,
        type: state => state.type
    },
    mutations: {
        setSelected: function (state, feature) {
            state.selected = feature
        },
        setType: function (state, type) {
            state.type = type
        }
    },
    actions: {
        createFeature: async function ({commit}, params) {
            const f = new Feature(params)
            commit('setSelected', f)
        },
        reset: function ({commit}) {
            commit('setSelected', new Feature())
        }
    }
}
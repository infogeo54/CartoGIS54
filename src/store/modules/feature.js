//import Feature from '../../models/Feature'

export default {
    namespaced: true,
    state: {
        layer: null,
        selected: {}
    },
    getters: {
        selected: state => { return state.selected }
    },
    mutations: {
        setLayer: function (state, layerName) {
            state.layer = layerName
        },
        setSelected: function (state, feature) {
            state.selected = feature
        },
        setSelectedGeometry: function (state, geometry) {
            state.selected.geometry = geometry
        },
        setSelectedId: function (state, id) {
            state.selected.id = id
        }
    },
    actions: {
        reset: function ({commit}) {
            commit('setLayer', null)
            commit('setSelected', {})
        }
    }
}
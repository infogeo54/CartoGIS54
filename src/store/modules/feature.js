//import Feature from '../../models/Feature'

export default {
    namespaced: true,
    state: {
        selected: {}
    },
    getters: {
        selected: state => { return state.selected }
    },
    mutations: {
        setSelected: function (state, feature) {
            state.selected = feature
        },
        setSelectedGeometry: function (state, geometry) {
            state.selected.geometry = geometry
        },
        setSelectedCoordinates: function (state, coordinates) {
          state.selected.setGeometryFromCoordinates(coordinates)
        },
        setSelectedId: function (state, id) {
            state.selected.id = id
        }
    },
    actions: {
        reset: function ({commit}) {
            commit('setSelected', {})
        }
    }
}
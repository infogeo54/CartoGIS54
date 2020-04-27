import Feature from '../../models/Feature'
import WFS from '../../API/WFS'

export default {
    namespaced: true,
    state: {
        layer: null,
        selected: new Feature()
    },
    getters: {
        layerName: state => { return state.layer },
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
        getSchema: async function ({commit}, params) {
            const description = await WFS.getFeatureDescription(params.layer)
            let schema = WFS.extractSchema(description)
            schema.type = params.type
            commit('setSelected', new Feature(schema))
        },
        reset: function ({commit}) {
            commit('setLayer', null)
            commit('setSelected', new Feature())
        }
    }
}
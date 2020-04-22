import WFS from '../../API/WFS'

export default {
    namespaced: true,
    state: {
        layer: null,
        selected: null
    },
    getters: {
        layerName: state => { return state.layer },
        selected: state => { return state.selected }
    },
    mutations: {
        setType: function (state, layerName) {
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
        getSchema: async function ({commit}, layerName) {
            const description = await WFS.getFeatureDescription(layerName)
            const properties = WFS.extractSchema(description)
            let schema = { geometry: {}, properties: {}, id: null }
            properties.forEach(prop => {
                const name = prop.name
                if (name !== 'geometry') schema.properties[name] = null
            })
            commit('setSelected', schema)
        }
    }
}
import WFS from "../../API/WFS";

export default {
    state : {
        capabilities: null,
        layers: []
    },
    getters : {
        capabilities: state => { return state.capabilities },
        layers: state => { return state.layers }
    },
    mutations: {
        setCapabilities: function (state, capabilities) {
            state.capabilities = capabilities
        },
        setLayers: function (state, layers) {
            state.layers = layers
        },
        addLayer: function (state, layer) {
            state.layers.push(layer)
        },
        removeLayer: function (state, layer) {
            const index = state.layers.indexOf(layer)
            state.layers.splice(index, 1)
        }
    },
    actions: {
        getLayers: async function ({commit}) {
            const capabilities = await WFS.getCapabilities()
            const layers = WFS.extractLayers(capabilities)
            for (const l of layers) {
                l.entities = await WFS.getFeatures(l.Name._text)
            }
            commit('setCapabilities', capabilities)
            commit('setLayers', layers)
        }
    },
}
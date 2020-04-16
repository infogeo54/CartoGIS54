import WFS from '../../API/WFS'
import WMS from '../../API/WMS'

export default {
    namespaced: true,
    state : {
        list: []
    },
    getters : {
        list: state => { return state.list }
    },
    mutations: {
        setList: function (state, layers) {
            state.list = layers
        },
        addLayer: function (state, layer) {
            state.list.push(layer)
        },
        removeLayer: function (state, layer) {
            const index = state.list.indexOf(layer)
            state.list.splice(index, 1)
        }
    },
    actions: {
        getLayers: async function ({commit}) {
            const capabilities = await WFS.getCapabilities()
            const layers = WFS.extractLayers(capabilities)
            for (const l of layers) {
                l.entities = await WFS.getFeatures(l.Name._text)
                l.styles = await WMS.getStyles(l.Name._text)
            }
            commit('setCapabilities', capabilities, {root: true})
            commit('setList', layers)
        }
    },
}

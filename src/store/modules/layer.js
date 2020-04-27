import WFS from '../../API/WFS'
import WMS from '../../API/WMS'

export default {
    namespaced: true,
    state : {
        list: [],
        selected: null
    },
    getters : {
        list: state => state.list,
        selected: state => state.selected ,
        selectedName: state => state.selected['Name']['_text'],
        selectedTitle: state => state.selected['Title']['_text']
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
        },
        setSelected: function (state, layer) {
            state.selected = layer !== state.selected ? layer : null
        }
    },
    actions: {
        getLayers: async function ({commit}) {
            const capabilities = await WFS.getCapabilities()
            const layers = WFS.extractLayers(capabilities)
            for (const l of layers) {
                const name = l['Name']['_text']
                l.entities = await WFS.getFeatures(name)
                l.styles = await WMS.getStyles(name)
            }
            commit('setCapabilities', capabilities, {root: true})
            commit('setList', layers)
        }
    },
}

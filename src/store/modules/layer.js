import WFS from '../../API/WFS'
import Layer from '../../models/Layer'

export default {
    namespaced: true,
    state : {
        list: [],
        selected: {}
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
            const capabilities = await WFS.fetchCapabilities()
            const layersData = WFS.extractLayers(capabilities)
            const layers = await Promise.all(
                layersData.map(async data => {
                    const layer = new Layer(data)
                    await layer.getFeatures()
                    await layer.getStyles()
                    return layer
                })
            )
            commit('setCapabilities', capabilities, {root: true})
            commit('setList', layers)
        },
        reset: function ({commit}) {
            commit('setList', [])
            commit('setSelected', {})
        }
    },
}

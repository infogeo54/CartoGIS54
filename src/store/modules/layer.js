import WFS from '../../API/WFS'
import Layer from '../../models/Layer'

export default {
    namespaced: true,
    state : {
        list: [],
        selected: {},
    },
    getters : {
        list: state => state.list,
        selected: state => state.selected,
        features: state => state.list.map(l => l.features).flat()
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
        },
        /**
         * After an Insert Transacation, add a feature to it's parent layer
         * @param state
         * @param feature : Feature
         */
        addFeature: function (state, feature) {
            const layer = state.list.find(l => l.name === feature.parent.name)
            layer.features.push(feature)
        },
        /**
         * After a Delete Transaction, remove a feature and it's representation from it's parent layer
         * @param state
         * @param feature : Feature
         */
        removeFeature: function (state, feature) {
            const layer = state.list.find(l => l.name === feature.parent.name)
            const index = layer.features.indexOf(feature)
            feature.representation.remove()
            layer.features.splice(index, 1)
        }
    },
    actions: {
        getLayers: async function ({commit}) {
            const layerList = await WFS.fetchLayers()
            const descriptionList = await WFS.fetchAllFeatureDescriptions()
            const layers = await Promise.all(
                layerList.map(async layerData => {
                    const name = layerData['Name']['_text']
                    const description = descriptionList.find(d => d.layer === name)
                    const layer = new Layer({properties: layerData, description: description})
                    await layer.getFeatures()
                    await layer.getStyles()
                    return layer
                })
            )
            commit('setList', layers)
        },
        reset: function ({commit}) {
            commit('setList', [])
            commit('setSelected', {})
        }
    },
}

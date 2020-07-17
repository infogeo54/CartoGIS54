import Transaction from '@/tools/Transaction'
import WFS from '@/API/WFS'

export default {
    namespaced: true,
    state: {
        selected: null,
        ogProperties: null
    },
    getters: {
        selected: state => state.selected,
        ogProperties: state => state.selected.id ? state.ogProperties : null,
        ogCoordinates: (state, getters) => {
            if (getters.ogProperties) return getters.ogProperties.geometry.value.coordinates
            return null
        }
    },
    mutations: {
        setSelected: function (state, feature) {
            state.selected = feature
        },
        setOgProperties: function (state, properties) {
            state.ogProperties = properties
        },
        updateAttribute: function (state, attribute) {
            state.selected.properties[attribute.name].value = attribute.value
        },
        setId: function (state, id) {
            state.selected.id = id
        },
        reset: function (state) {
            state.selected = null
            state.ogProperties = null
        },
    },
    actions: {
        delete: async function ({state, getters, commit}){
            const t = Transaction.delete(state.selected).toXML()
            await WFS.sendTransaction(t)
            commit('layer/removeFeature', getters.selected, {root: true})

        },
        insert: async function ({state, commit}) {
            const t = Transaction.insert(state.selected).toXML()
            const res = await WFS.sendTransaction(t)
            const id = res['TransactionResponse']['InsertResults']['Feature']['ogc:FeatureId']['_attributes']['fid']
            if (id) {
                commit('setId', id)
                commit('layer/addFeature', state.selected, {root: true})
            }
        },
        update: async function ({state}) {
            const t = Transaction.update(state.selected).toXML()
            return await WFS.sendTransaction(t)
        },
        save: async function ({state, dispatch}) {
            if (state.selected.id) return await dispatch('update')
            return await dispatch('insert')
        },
        cancel ({ getters, rootGetters }) {
            if (getters.selected.representation) {
              getters.selected.deleteRepresentation()
            }
            if (getters.ogProperties) {
                getters.selected.properties = getters.ogProperties
                getters.selected.createRepresentation().addTo(rootGetters.map)
            }
        },
    }
}

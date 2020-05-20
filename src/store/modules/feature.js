import Transaction from '../../tools/Transaction'
import WFS from '../../API/WFS'

export default {
    namespaced: true,
    state: {
        selected: null,
    },
    getters: {
        selected: state => state.selected,
        representation: state => {
            if (state.selected) return state.selected.representation
            return null
        }
    },
    mutations: {
        setSelected: function (state, feature) {
            state.selected = feature
        },
        updateAttribute: function (state, attribute) {
            state.selected.properties[attribute.name].value = attribute.value
        },
        setId: function (state, id) {
            state.selected.id = id
        }
    },
    actions: {
        reset: function ({commit}) {
            commit('setSelected', null)
        },
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
        }
    }
}
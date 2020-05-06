import Transaction from '../../tools/Transaction'
import WFS from '../../API/WFS'

export default {
    namespaced: true,
    state: {
        selected: null,
        type: null
    },
    getters: {
        selected: state => state.selected,
        type: state => state.type,
        representation: state => {
            if (state.selected) return state.selected.representation
            return null
        }
    },
    mutations: {
        setSelected: function (state, feature) {
            state.selected = feature
        },
        setType: function (state, type) {
            state.type = type
        },
        updateAttribute: function (state, attribute) {
            state.selected.properties[attribute.name] = attribute.value
        }
    },
    actions: {
        reset: function ({commit}) {
            commit('setSelected', null)
        },
        delete: async function ({state}){
            const t = Transaction.delete(state.selected).toXML()
            await WFS.sendTransaction(t, state.selected.parent)
        },
        insert: async function ({state}) {
            const t = Transaction.insert(state.selected).toXML()
            await WFS.sendTransaction(t, state.selected.parent)
        },
        update: async function ({state}) {
            const t = Transaction.update(state.selected).toXML()
            await WFS.sendTransaction(t, state.selected.parent)
        },
        save: function ({state, dispatch}, layer) {
            if (state.selected.id) dispatch('update', layer)
            else dispatch('insert', layer)
        }
    }
}
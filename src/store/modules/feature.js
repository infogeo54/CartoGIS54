import Transaction from '../../tools/Transaction'
//import axios from 'axios'

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
        insert: function ({state}, layer) {
            const t = Transaction.insert(layer, state.selected)
            console.log(t)
            console.log(t.toXML())
        },
        update: function () {
        },
        save: function ({state, dispatch}, layer) {
            if (state.selected.id) dispatch('update', layer)
            else dispatch('insert', layer)
        }
    }
}
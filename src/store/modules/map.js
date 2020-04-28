export default {
    namespaced: true,
    state: {
        editing: false,
        representation: null
    },
    getters: {
        editing: state => state.editing,
        representation: state => state.representation
    },
    mutations: {
        setEditing: function (state, editing) {
            state.editing = editing
        },
        setRepresentation: function (state, representation) {
            state.representation = representation
        },
        removeRepresentation: function (state) {
            state.representation.remove()
            state.representation = null
        }
    },
    actions: {
        reset: function ({commit}) {
            commit('setEditing', false)
            commit('removeRepresentation')
        }
    }
}
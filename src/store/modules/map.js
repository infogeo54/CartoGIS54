export default {
    namespaced: true,
    state: {
        editing: false,
    },
    getters: {
        editing: state => state.editing,
    },
    mutations: {
        setEditing: function (state, editing) {
            state.editing = editing
        }
    },
    actions: {
        reset: function ({commit}) {
            commit('setEditing', false)
        }
    }
}
export default {
    namespaced: true,
    state: {
        selected: null,
        type: null
    },
    getters: {
        selected: state => state.selected,
        type: state => state.type
    },
    mutations: {
        setSelected: function (state, feature) {
            state.selected = feature
        },
        setType: function (state, type) {
            state.type = type
        }
    },
    actions: {
        reset: function ({commit}) {
            commit('setSelected', null)
        }
    }
}
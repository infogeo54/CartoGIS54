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
            if (state.selected) return state.selected.representation()
            return null
        }
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
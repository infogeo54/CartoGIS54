export default {
    namespaced: true,
    state: {
        formVisible: false
    },
    getters: {
         formVisible: state => state.formVisible
    },
    mutations: {
        toggleVisibility: function (state) {
            state.formVisible ? state.formVisible = false : state.formVisible = true
        },
        setVisibility: function (state, visibility) {
            state.formVisible = visibility
        }
    }
};
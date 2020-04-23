export default {
    namespaced: true,
    state: {
        editing: false,
        coordinates: null
    },
    getters: {
        editing: state => { return state.editing },
        coordinates: state => { return state.coordinates }
    },
    mutations: {
        setEditing: function (state, editing) {
            state.editing = editing
        },
        setCoordinates: function (state, coordinates) {
            state.coordinates = coordinates
        }
    },
    actions: {

    }
}
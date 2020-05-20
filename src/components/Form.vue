<template>
    <form id="form" @submit.prevent="submitForm">
        <FormGroup v-for="(property, index) in properties"
                   :key="index"
                   :property="{name: property, ...feature.properties[property]}"
                   @changed="onChange"></FormGroup>
        <button name="save">Enregistrer</button>
        <button name="delete">Supprimer</button>
        <button type="button" name="cancel" @click="onCancelClick">Annuler</button>
    </form>
</template>

<script>
    import FormGroup from './FormComponents/FormGroup'
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    export default {
        name: "Form",
        data(){
            return {
                element: null
            }
        },
        computed: {
            ...mapGetters({
                layer: 'layer/selected',
                feature: 'feature/selected',
            }),
            properties: function () {
                return Object.keys(this.feature.properties).sort((a, b) =>
                    a < b ? -1 : a > b ? 1 : 0
                )
            },
        },
        methods: {
            ...mapMutations('feature', ['updateAttribute']),
            ...mapActions([
                'reset',
                'feature/save',
                'feature/delete'
            ]),
            /**
             * Saves changes in the Store
             * @param attribute
             */
            onChange: function (attribute) {
                this.updateAttribute(attribute)
            },
            /**
             * Sends a Transaction request
             */
            onSaveClick: async function () {
                await this['feature/save'](this.layer.name)
                this.$destroy()
            },
            onCancelClick: function () {
                if (!this.feature.id) this.feature.representation.remove()
                this.$destroy()
            },
            onDeleteClick: async function () {
                await this['feature/delete']()
                this.$destroy()
            },
            submitForm: function (e) {
                return e.submitter.name === 'save' ? this.onSaveClick() : this.onDeleteClick()
            }
        },
        mounted() {
            this.element = this.$el
        },
        beforeDestroy() {
            this.reset()
        },
        components: {
            FormGroup
        }

    }
</script>

<style scoped>

</style>
<template>
    <form id="form" @submit.prevent="action">
        <FormGroup v-for="property in properties"
                   :key="property"
                   :property="{name: property, ...feature.properties[property]}"
                   @changed="onChange"
        />
        <button name="save">Enregistrer</button>
        <button name="delete">Supprimer</button>
        <button name="cancel" type="button" @click="onCancelClick">Annuler</button>
    </form>
</template>

<script>
import FormGroup from './FormComponents/FormGroup'
import {mapGetters, mapMutations, mapActions} from 'vuex'

export default {
    name: "Form",
    components: { FormGroup },
    computed: {
        ...mapGetters({
            map: 'map',
            layer: 'layer/selected',
            feature: 'feature/selected',
            ogProperties: 'feature/ogProperties'
        }),
        properties: function () {
            return Object.keys(this.feature.properties).sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
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
         * Call store's save action
         */
        onSaveClick: async function () {
            await this['feature/save'](this.layer.name)
        },
        /**
         * Call store's delete action
         */
        onDeleteClick: async function () {
            await this['feature/delete']()
        },
        /**
         * Cancel the current editing
         * Reset an existing Feature to it's original state
         */
        onCancelClick: function () {
            this.feature.deleteRepresentation()
            if (this.ogProperties) {
                this.feature.properties = this.ogProperties
                this.feature.createRepresentation().addTo(this.map)
            }
            this.$destroy()
        },
        /**
         * Call the appropriated action then destroy the component
         * @param e : Event - An event created by clicking on a form's button
         */
        action: async function (e) {
            switch (e.submitter.name) {
                case 'save':
                    await this.onSaveClick()
                    break
                case 'delete':
                    await this.onDeleteClick()
                    break
            }
            this.$destroy()
        }
    },
    /**
     * Call store's reset action before destroying the component
     */
    beforeDestroy() {
        this.reset()
    }

}
</script>

<style scoped>

</style>

<template>
    <div id="form">
        <FormGroup v-for="(property, index) in properties"
                   :key="index"
                   :property="{name: property, ...feature.properties[property]}"
                   @changed="onChange"></FormGroup>
        <button @click="onSaveClick">Enregistrer</button>
        <button  @click="onCancelClick">Annuler</button>
        <button @click="onDeleteClick">Supprimer</button>
    </div>
</template>

<script>
    import FormGroup from './FormGroup'
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    export default {
        name: "Form",
        computed: {
            ...mapGetters({
                layer: 'layer/selected',
                feature: 'feature/selected',
            }),
            properties: function () {
                return Object.keys(this.feature.properties).sort((a, b) =>
                    a < b ? -1 : a > b ? 1 : 0
                )
            }
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
            }
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
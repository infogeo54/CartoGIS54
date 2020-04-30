<template>
    <div id="form">
        <FormGroup v-for="(value, property, index) in properties"
                   :key="index"
                   :property="property"
                   :value="value"
                   @changed="onChange"></FormGroup>
        <button @click="onSaveClick">Enregistrer</button>
        <button  @click="onCancelClick">Annuler</button>
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
                return this.feature.properties
            }
        },
        methods: {
            ...mapMutations('feature', ['updateAttribute']),
            ...mapActions('feature', ['reset', 'save']),
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
            onSaveClick: function () {
                this.save(this.layer.name)
            },
            onCancelClick: function () {
                if (!this.feature.id) this.feature.representation.remove()
                this.reset()
            }
        },
        components: {
            FormGroup
        }

    }
</script>

<style scoped>

</style>
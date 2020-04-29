<template>
    <div id="form">
        <FormGroup v-for="(value, property) in properties"
                   :key="property"
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
            ...mapGetters('feature', {
                feature: 'selected',
                representation: 'representation'
            }),
            properties: function () {
                return this.feature.properties
            }
        },
        methods: {
            ...mapMutations('feature', ['setSelected']),
            ...mapActions('feature', ['reset']),
            /**
             * Saves changes in the Store
             * @param attribute
             */
            onChange: function (attribute) {
                this.feature.properties[attribute.name] = attribute.value
                this.setSelected(this.feature)
            },
            /**
             * Sends a Transaction request
             */
            onSaveClick: function () {

            },
            onCancelClick: function () {
                this.representation.remove()
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
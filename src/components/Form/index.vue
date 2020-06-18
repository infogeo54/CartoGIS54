<template>
  <form id="form" @submit.prevent="action">
    <div class="groups">
      <Group v-for="property in properties"
             :key="property"
             :property="{name: property, ...feature.properties[property]}"
             @changed="onChange"
      />
    </div>
    <div class="buttons">
      <input type="submit" name="save" value="Enregistrer">
      <input type="submit" name="delete" value="Supprimer" :disabled="!feature.id">
      <input type="button" name="cancel" @click="onCancelClick" value="Annuler">
    </div>
  </form>
</template>

<script>
    import Group from './Group'
    import {mapGetters, mapMutations, mapActions} from 'vuex'

    export default {
        name: "Form",
        components: { Group },
        computed: {
            ...mapGetters({
                map: 'map',
                layer: 'layer/selected',
                feature: 'feature/selected',
                ogProperties: 'feature/ogProperties'
            }),
            properties: function () {
                return Object.keys(this.feature.properties).sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
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

<style lang="sass" scoped>
  #form
    background-color: #D3D3D3
    border-left: solid 1px black
    min-width: 250px
    position: relative
    overflow: hidden
    .groups
      height: 90%
      overflow-x: hidden
      overflow-y: scroll
    .buttons
      height: 10%
      display: flex
      flex-wrap: wrap
      flex: 0 1 49%
      justify-content: space-evenly
      background-color: #808080
      input
        padding: 4px 0
        width: 80px
        margin: auto
        border: solid 1px black
        border-radius: 2px
        &:hover
          cursor: pointer
          &[disabled]
            cursor: not-allowed
        &[name="save"]
          background-color: #00FF0066
        &[name="delete"]
          background-color: #FF000066
        &[name="cancel"]
          background-color: #D3D3D366
</style>

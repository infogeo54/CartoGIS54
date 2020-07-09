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
            feature: 'feature/selected',
        }),
        properties: function () {
            return Object.keys(this.feature.properties).sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
        }
    },
    /**
     * Call store's reset action before destroying the component
     */
    beforeDestroy() {
        this.reset()
    },
    methods: {
        ...mapMutations('feature', ['updateAttribute']),
        ...mapActions([
            'reset',
            'feature/save',
            'feature/delete',
            'feature/cancel'
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
            await this['feature/save']()
        },
        /**
         * Call store's delete action
         */
        onDeleteClick: async function () {
            await this['feature/delete']()
        },
        /**
         * Call store's cancel action
         */
        onCancelClick: function () {
            this['feature/cancel']()
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
                    if (confirm('Êtes-vous sûr.e de vouloir supprimer cette entité ?')) await this.onDeleteClick()
                    break
            }
            this.$destroy()
        }
    }
}
</script>

<style lang="sass" scoped>
  #form
    color: #EBEBEB
    background-color: #2A353B
    border-left: solid 1px black
    min-width: 250px
    position: relative
    overflow: hidden
    .groups
      height: 95%
      overflow-x: hidden
      overflow-y: scroll
      & > *
        margin: 15px 0
    .buttons
      height: 5%
      display: flex
      flex-wrap: wrap
      flex: 0 1 49%
      justify-content: space-evenly
      background-color: #0BB4F5
      input
        padding: 4px 0
        width: 80px
        margin: auto
        border: solid 1px black
        border-radius: 4px
        color: #EFEFEF
        &:hover
          cursor: pointer
          &[disabled]
            cursor: not-allowed
        &[name="save"]
          background-color: #2A353BCC
        &[name="delete"]
          background-color: #2A353BAA
        &[name="cancel"]
          background-color: #2A353B88
</style>

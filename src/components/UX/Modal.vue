<template>
  <div
    v-if="isVisible"
    class="modal-container"
  >
    <div
      :id="`modal-${modal.name}`"
      class="modal"
    >
      <div class="modal-header">
        <h3>{{ modal.title }}</h3>
        <div @click="close">
          <i class="fas fa-times-circle"></i>
        </div>
      </div>
      <div
        class="modal-body"
        v-html="content"
      >
      </div>
      <div class="modal-footer"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modal: { type: Object, default: () => {} }
  },
  data () {
    return {
      content: null
    }
  },
  computed: {
    isVisible () { return this.modal.visible || false },
  },
  mounted () {
    this.content = require(`@/modals/${this.modal.name}`)
  },
  methods: {
    close () {
      this.modal.visible = false
    }
  }
}
</script>

<style lang="sass" scoped>
.modal-container
  z-index: 1000
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  display: flex
  background-color: #2A353BBB

.modal
  position: relative
  align-self: center
  margin: auto
  height: 90%
  width: 50%
  border: solid 1px #EFEFEF
  border-radius: 4px
  color: #EFEFEF
  background-color: #2A353B
  box-shadow: 10px 5px 5px #2A353B

.modal-header, .modal-body, .modal-footer
  padding: 10px

.modal-header, .modal-footer
  background-color: #0BB4F5

.modal-header
  display: flex
  justify-content: space-between
  border-top-left-radius: 4px
  border-top-right-radius: 4px
  h3
    margin: 0
  div
    height: fit-content
    align-self: center
    &:hover
      cursor: pointer

.modal-footer
  position: absolute
  bottom: 0
  left: 0
  right: 0
  border-bottom-left-radius: 4px
  border-bottom-right-radius: 4px
</style>
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
    this.content = require(`@/modals/${this.modal.name}.html`)
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
  z-index: 2500
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
  max-width: 50rem
  min-width: 15rem
  border: solid 1px white
  border-radius: .5rem
  color: #0e0e0e
  background-color: white
  box-shadow: 10px 5px 5px #2A353B

.modal-header, .modal-body, .modal-footer
  padding: 10px
  box-sizing: border-box

.modal-header, .modal-footer
  background-color: #101010
  color: white

.modal-header
  height: 2.5rem
  display: flex
  justify-content: space-between
  align-items: center
  border-top-left-radius: .5rem
  border-top-right-radius: .5rem
  h3
    margin: 0
  div:hover
    cursor: pointer

.modal-footer
  border-bottom-left-radius: .5rem
  border-bottom-right-radius: .5rem
</style>
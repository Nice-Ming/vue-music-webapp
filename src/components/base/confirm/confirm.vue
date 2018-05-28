<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{ promptText }}</p>
          <div class="operate">
            <span class="operate-btn" @click="cancel">{{ cancelBtnText }}</span>
            <span class="operate-btn" @click="confirm">{{ confirmBtnText }}</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Confirm',
  props: {
    promptText: {
      type: String,
      default: ''
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    }
  },

  data() {
    return {
      showFlag: false
    }
  },

  methods: {
    show() {
      this.showFlag = true
    },

    hide() {
      this.showFlag = false
    },

    confirm() {
      this.hide()
      this.$emit('confirm')
    },

    cancel() {
      this.hide()
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import './_confirm.scss';
</style>
<template>
  <div class="loading">
    <img src="./loading.gif" width="24" height="24">
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'loading'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../common/scss/variable.scss';

.loading{
  width: 100%;
  height: 40px;
  text-align: center;
  img {
    margin-top: 15px;
  }
}
</style>

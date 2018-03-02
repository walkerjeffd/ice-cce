<template>
  <select :title="title" data-width="100%">
    <option
      v-for="option in options"
      :key="option[valueField]"
      :value="option[valueField]">
      {{option[textField]}}
    </option>
  </select>
</template>

<script>
import 'bootstrap-select/dist/css/bootstrap-select.min.css';

const $ = require('jquery');
require('bootstrap');
require('bootstrap-select');

export default {
  props: ['config', 'options', 'value', 'textField', 'valueField', 'title', 'multiple'],
  watch: {
    value(value) {
      $(this.$el).selectpicker('val', value).selectpicker('refresh');
    },
  },
  mounted() {
    const vm = this;
    $(this.$el)
      .attr('multiple', this.multiple)
      .selectpicker(this.config)
      .on('loaded.bs.select', function onLoad() {
        $(this).selectpicker('val', this.value);
      })
      .on('changed.bs.select', function onChange() {
        vm.$emit('input', $(this).selectpicker('val'));
      });
  },
  updated() {
    $(this.$el).selectpicker('val', this.value).selectpicker('refresh');
  },
  destroyed: () => $(this.$el).off().selectpicker('destroy'),
};

</script>

<style>
</style>

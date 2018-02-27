<template>
  <div>
    {{ filter.variable.id }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: ['filter'],
  data() {
    return {
      dim: null,
      group: null,
    };
  },
  computed: {
    ...mapGetters(['xf']),
    variable() {
      if (!this.filter) {
        return null;
      }
      return this.filter.variable;
    },
  },
  created() {
    this.dim = this.xf.dimension(d => d[this.filter.variable.id]);

    const interval = (this.variable.scale.max - this.variable.scale.min) / 40;

    this.group = this.dim
      .group(d => (d >= this.variable.max ?
        this.variable.max - interval :
        Math.floor(d / interval) * interval));
  },
};
</script>

<style>
</style>

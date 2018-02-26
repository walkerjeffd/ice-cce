<template>
  <div id="app">
    <button @click="selectVariableById(1)">Select Variable</button>
    <pre>
variable: {{ variable }}
    </pre>
    <pre>
variables: {{ variables }}
    </pre>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'App',
  data() {
    return {
      message: 'Hello world',
    };
  },
  computed: {
    variables() {
      return this.$store.state.variables;
    },
    variable() {
      return this.$store.state.variable;
    },
  },
  created() {
    this.$store.dispatch('setVariables', [
      { id: 1, name: 'one' },
      { id: 2, name: 'two' },
    ]);
  },
  methods: {
    ...mapActions(['selectVariableById']),
  },
};
</script>

<style>
</style>

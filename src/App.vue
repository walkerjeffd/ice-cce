<template>
  <div id="app">
    <b-container>
      <b-form-select
        :value="selected.themeId"
        :options="themes"
        @input="selectThemeById"
        value-field="id"
        text-field="label"
        class="mb-3"
        size="sm" />
      <b-form-select
        :value="selected.variableId"
        :options="variables"
        @input="selectVariableById"
        value-field="id"
        text-field="label"
        class="mb-3"
        size="sm" />
      <ice-map :options="map.options"></ice-map>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios';

import IceMap from './components/IceMap';

export default {
  name: 'App',
  components: {
    IceMap,
  },
  data() {
    return {
      selected: {
        themeId: null,
        variableId: null,
      },
      map: {
        options: {
          center: [48.7996273507997, -114.13696289062501],
          zoom: 7,
          maxZoom: 18,
          minZoom: 5,
        },
      },
    };
  },
  computed: {
    ...mapGetters(['themes', 'theme', 'layer', 'variables', 'variable']),
  },
  watch: {
    theme(theme) {
      this.selected.themeId = theme.id;
    },
    variable(variable) {
      this.selected.variableId = variable.id;
    },
  },
  created() {
    axios.get('config.json')
      .then(response => response.data)
      .then((config) => {
        this.$store.dispatch('setConfig', config)
          .then(() => {
            this.$store.dispatch('selectDefaults');
          });
      });
  },
  methods: {
    ...mapActions(['selectThemeById', 'selectVariableById']),
  },
};
</script>

<style>
</style>

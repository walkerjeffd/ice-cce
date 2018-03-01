<template>
  <div id="app">
    <b-container>
      <b-row>
        <b-col>
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
          <ice-legend></ice-legend>
        </b-col>
        <b-col cols="8">
          <b-form-select
            multiple
            :value="selected.filterVariableIds"
            :options="variables | filterVariable"
            @input="updateFilters"
            value-field="id"
            text-field="label"
            class="mb-3"
            size="sm" />
          <br><br>
          <div v-for="filter in filters" :key="filter.variable.id">
            <ice-filter :filter="filter"></ice-filter>
          </div>
          <br><br>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <ice-map :options="map.options"></ice-map>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios';

import IceMap from './components/IceMap';
import IceLegend from './components/IceLegend';
import IceFilter from './components/IceFilter';

export default {
  name: 'App',
  components: {
    IceMap,
    IceLegend,
    IceFilter,
  },
  data() {
    return {
      selected: {
        themeId: null,
        variableId: null,
        filterVariableIds: [],
      },
      map: {
        options: {
          center: [48.7996273507997, -114.13696289062501],
          zoom: 7,
          maxZoom: 18,
          minZoom: 5,
        },
      },
      value: 25,
    };
  },
  computed: {
    ...mapGetters(['themes', 'theme', 'layer', 'variables', 'variable', 'filters', 'xf']),
  },
  filters: {
    filterVariable: variables => variables.filter(v => v.filter),
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
    ...mapActions(['selectThemeById', 'selectVariableById', 'updateFilters']),
  },
};
</script>

<style>
</style>

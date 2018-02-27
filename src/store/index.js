import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import * as d3 from 'd3';
import * as crossfilter from 'crossfilter2';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {

  },
  state: {
    config: null,
    layer: null,
    theme: null,
    variable: null,
    filterVariable: null,
    data: [],
    map: new Map(),
    xf: null,
    filters: [],
  },
  getters: {
    config: state => state.config,
    // eslint-disable-next-line arrow-body-style
    themes: (state) => { return state.config ? state.config.themes : []; },
    theme: state => state.theme,
    layer: state => state.layer,
    // eslint-disable-next-line arrow-body-style
    variables: (state) => { return state.theme ? state.theme.variables : []; },
    variable: state => state.variable,
    xf: state => state.xf,
    filters: state => state.filters,
    valuesById: state => id => state.map.get(id),
    crossfilter: state => state.xf,
  },
  mutations: {
    SET_CONFIG(state, config) {
      state.config = config;
    },
    SET_THEME(state, theme) {
      state.theme = theme;
    },
    SET_LAYER(state, layer) {
      state.layer = layer;
    },
    SET_VARIABLE(state, variable) {
      state.variable = variable;
    },
    SET_FILTER_VARIABLE(state, variable) {
      state.filterVariable = variable;
    },
    SET_DATA(state, data) {
      state.data = data;
      state.xf = crossfilter(data);
    },
    SET_DATAMAP(state, map) {
      state.map = map;
    },
    ADD_FILTER(state, filter) {
      state.filters.push(filter);
    },
    REMOVE_FILTER(state, filter) {
      const index = state.filters.indexOf(filter);
      state.filters.splice(index, 1);
    },
  },
  actions: {
    setConfig({ commit }, config) {
      commit('SET_CONFIG', config);
    },
    selectDefaults({ dispatch, state }) {
      dispatch('selectThemeById', state.config.defaults.theme)
        .then(() => dispatch('selectVariableById', state.config.defaults.variable));
    },
    selectThemeById({ commit, getters }, themeId) {
      if (!getters.themes || getters.themes.length === 0) return;

      const theme = getters.themes.find(d => d.id === themeId);

      return axios.get(theme.layer) // eslint-disable-line consistent-return
        .then(response => response.data)
        .then((layer) => {
          axios.get(theme.dataset.url)
            .then(response => response.data)
            .then((string) => {
              // parse CSV
              const data = d3.csvParse(string, (d) => {
                const o = {
                  id: d[theme.dataset.columns.id],
                  area: +d[theme.dataset.columns.area],
                };

                theme.variables.forEach((v) => {
                  o[v.id] = +d[v.id];
                });

                return o;
              });

              const dataMap = new Map(data.map(d => [d.id, d]));

              commit('SET_THEME', theme);
              commit('SET_VARIABLE', theme.variables[0]);
              commit('SET_LAYER', layer);
              commit('SET_DATA', data);
              commit('SET_DATAMAP', dataMap);
            });
        });
    },
    selectVariableById({ commit, getters }, id) {
      if (getters.variables.length > 0) {
        const variable = getters.variables.find(v => v.id === id);
        commit('SET_VARIABLE', variable);
      }
    },
    addFilterByVariableId({ commit, getters }, variableId) {
      if (getters.variables.length > 0) {
        const variable = getters.variables.find(v => v.id === variableId);
        commit('ADD_FILTER', { variable });
      }
    },
    removeFilter({ commit }, filter) {
      commit('REMOVE_FILTER', filter);
    },
    updateFilters({ state, getters, dispatch }, variableIds) {
      if (getters.variables.length > 0) {
        // remove existing filters no longer selected
        const removeFilters = state.filters
          .filter(f => (variableIds.indexOf(f.variable.id) <= -1));
        removeFilters.forEach((filter) => {
          dispatch('removeFilter', filter);
        });

        // add new filters now selected
        const addFilters = variableIds
          .filter(id => (state.filters.map(f => f.variable.id).indexOf(id) <= -1));
        addFilters.forEach((id) => {
          dispatch('addFilterByVariableId', id);
        });
      }
    },
  },
});

export default store;

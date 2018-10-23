import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import * as d3 from 'd3';
import * as crossfilter from 'crossfilter2';

Vue.use(Vuex);

const xf = crossfilter();
const map = new Map();
const featureSet = new Set();

const store = new Vuex.Store({
  state: {
    config: null,
    layer: null,
    theme: null,
    variable: null,
    filterVariable: null,
    data: [],
    filters: [],
    totalCount: 0,
    activeCount: 0,
    selectedFeature: null,
  },
  getters: {
    config: state => state.config,
    themes: state => (state.config ? state.config.themes : []),
    theme: state => state.theme,
    layer: state => state.layer,
    variables: state => (state.theme ? state.theme.variables : []),
    variable: state => state.variable,
    variableById: state => id => (
      state.theme ? state.theme.variables.find(v => v.id === id) : undefined
    ),
    variableGroups: state => (state.theme ? state.theme.variableGroups : []),
    filters: state => state.filters,
    data: state => state.data,
    xf: () => xf,
    featureSet: () => featureSet,
    isFeatureFiltered: () => id => featureSet.has(id),
    selectedFeature: state => state.selectedFeature,
    valuesById: () => id => map.get(id),
    totalCount: state => state.totalCount,
    activeCount: state => state.activeCount,
    getFilteredVariableMeanValue: () =>
      variableId => d3.mean(xf.allFiltered(), d => d[variableId]),
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
    },
    ADD_FILTER(state, filter) {
      state.filters.push(filter);
    },
    REMOVE_FILTER(state, filter) {
      const index = state.filters.indexOf(filter);
      state.filters.splice(index, 1);
    },
    SET_TOTAL_COUNT(state, count) {
      state.totalCount = count;
    },
    SET_ACTIVE_COUNT(state, count) {
      state.activeCount = count;
    },
    SELECT_FEATURE(state, feature) {
      state.selectedFeature = feature;
    },
    UNSELECT_FEATURE(state) {
      state.selectedFeature = null;
    },
  },
  actions: {
    setConfig({ commit }, config) {
      commit('SET_CONFIG', config);
    },
    selectThemeById({ commit, getters }, themeId) {
      if (!getters.themes || getters.themes.length === 0 || !themeId) return;

      const theme = getters.themes.find(d => d.id === themeId);

      if (!theme) return;

      return axios.get(`${theme.layer}`) // eslint-disable-line consistent-return
        .then(response => response.data)
        .then((layer) => { // eslint-disable-line
          return axios.get(`${theme.dataset.url}`)
            .then(response => response.data)
            .then((string) => {
              // parse CSV
              const data = d3.csv.parse(string, (d) => {
                const o = {
                  id: d[theme.dataset.columns.id],
                  label: d[theme.dataset.columns.label],
                  area: +d[theme.dataset.columns.area],
                };

                theme.variables.forEach((v) => {
                  o[v.id] = d[v.id] === '' ? null : +d[v.id];
                });

                return o;
              });

              map.clear();
              data.forEach(d => map.set(d.id, d));

              xf.remove();
              xf.add(data);

              featureSet.clear();
              xf.groupAll().reduce(
                (p, v) => {
                  featureSet.add(v.id);
                  return p++;
                },
                (p, v) => {
                  featureSet.delete(v.id);
                  return p--;
                },
                () => 0,
              ).value();


              commit('SET_THEME', theme);
              commit('SET_VARIABLE', theme.variables[0]);
              commit('SET_LAYER', layer);
              commit('SET_DATA', data);
              commit('SET_TOTAL_COUNT', data.length);
              commit('SET_ACTIVE_COUNT', data.length);
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

        // add new filters that are now selected
        const addFilters = variableIds
          .filter(id => (state.filters.map(f => f.variable.id).indexOf(id) <= -1));
        addFilters.forEach((id) => {
          dispatch('addFilterByVariableId', id);
        });
      }
    },
    setTotalCount({ commit }, count) {
      commit('SET_TOTAL_COUNT', count);
    },
    setActiveCount({ commit }, count) {
      commit('SET_ACTIVE_COUNT', count);
    },
    updateActiveCount({ commit }) {
      commit('SET_ACTIVE_COUNT', xf.groupAll().value());
    },
    selectFeature({ commit }, feature) {
      if (feature) {
        commit('SELECT_FEATURE', feature);
      } else {
        commit('UNSELECT_FEATURE');
      }
    },
  },
});

export default store;

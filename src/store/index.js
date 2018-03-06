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
    featureSet: new Set(),
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
    xf: state => state.xf,
    featureSet: state => state.featureSet,
    isFeatureFiltered: state => id => state.featureSet.has(id),
    selectedFeature: state => state.selectedFeature,
    valuesById: state => id => state.map.get(id),
    totalCount: state => state.totalCount,
    activeCount: state => state.activeCount,
    getFilteredVariableMeanValue: state =>
      variableId => d3.mean(state.xf.allFiltered(), d => d[variableId]),
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
    SET_DATAMAP(state, map) {
      state.map = map;
    },
    SET_CROSSFILTER(state, xf) {
      state.xf = xf;
    },
    SET_FEATURE_SET(state, featureSet) {
      state.featureSet = featureSet;
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
    selectDefaults({ dispatch, state }) {
      return dispatch('selectThemeById', state.config.defaults.theme)
        .then(() => dispatch('selectVariableById', state.config.defaults.variable));
    },
    selectThemeById({ commit, getters }, themeId) {
      if (!getters.themes || getters.themes.length === 0) return;

      const theme = getters.themes.find(d => d.id === themeId);

      return axios.get(`api/${theme.layer}`) // eslint-disable-line consistent-return
        .then(response => response.data)
        .then((layer) => {
          axios.get(`api/${theme.dataset.url}`)
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
                  o[v.id] = +d[v.id];
                });

                return o;
              });

              const dataMap = new Map(data.map(d => [d.id, d]));

              const xf = crossfilter(data);

              const featureSet = new Set();
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
              commit('SET_DATAMAP', dataMap);
              commit('SET_CROSSFILTER', xf);
              commit('SET_FEATURE_SET', featureSet);
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
    updateActiveCount({ commit, state }) {
      if (state.xf) {
        commit('SET_ACTIVE_COUNT', state.xf.groupAll().value());
      } else {
        commit('SET_ACTIVE_COUNT', 0);
      }
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

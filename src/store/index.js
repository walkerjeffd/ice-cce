import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import * as d3 from 'd3';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {

  },
  state: {
    config: null,
    layer: null,
    theme: null,
    variable: null,
    data: [],
    map: new Map(),
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
    valuesById: state => id => state.map.get(id),
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
    SET_DATA(state, data) {
      state.data = data;
    },
    SET_DATAMAP(state, map) {
      state.map = map;
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
      if (getters.themes.length > 0) {
        const theme = getters.themes.find(d => d.id === themeId);

        axios.get(theme.layer)
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
      }
    },
    selectVariableById({ commit, getters }, variableId) {
      if (getters.variables.length > 0) {
        const variable = getters.variables.find(v => v.id === variableId);
        commit('SET_VARIABLE', variable);
      }
    },
  },
});

export default store;

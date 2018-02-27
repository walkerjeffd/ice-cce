import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {

  },
  state: {
    config: null,
    layer: null,
    theme: null,
    variable: null,
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
        setTimeout(() => {
          const layer = require('../../api/' + theme.layer); // eslint-disable-line
          commit('SET_THEME', theme);
          commit('SET_VARIABLE', theme.variables[0]);
          commit('SET_LAYER', layer);
        }, 200);
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

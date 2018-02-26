import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {

  },
  state: {
    variables: [],
    variable: null,
  },
  getters: {
  },
  mutations: {
    SET_VARIABLES(state, variables) {
      state.variables = variables;
    },
    SET_VARIABLE(state, variable) {
      state.variable = variable;
    },
  },
  actions: {
    setVariables({ commit }, variables) {
      commit('SET_VARIABLES', variables);
    },
    selectVariableById({ commit, state }, variableId) {
      const variable = state.variables.find(v => v.id === variableId);
      commit('SET_VARIABLE', variable);
    },
  },
});

export default store;

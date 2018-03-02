<template>
  <div id="app" class="full">
    <ice-header></ice-header>

    <div class="ice-container">
      <div class="ice-left-sidebar">
        <div class="ice-box">
          <div class="ice-box-title">Menu</div>
          <b-button-group size="sm">
            <b-button><i class="fa fa-question-circle"></i> About</b-button>
            <b-button><i class="fa fa-table"></i> Dataset</b-button>
            <b-button><i class="fa fa-share"></i> Share</b-button>
            <b-button><i class="fa fa-download"></i> Download</b-button>
          </b-button-group>
        </div>
        <div class="ice-box">
          <div class="ice-box-title">Species</div>
          <b-form-select
            :value="selected.themeId"
            :options="themes"
            @input="selectThemeById"
            value-field="id"
            text-field="label"
            class="mb-3"
            size="sm" />
        </div>
        <div class="ice-box">
          <div class="ice-box-title">Map Variable</div>
          <b-form-select
            :value="selected.variableId"
            :options="variables"
            @input="selectVariableById"
            value-field="id"
            text-field="label"
            class="mb-3"
            size="sm" />
          <ice-legend></ice-legend>
        </div>
      </div>
      <div class="ice-right-sidebar">
        <div class="ice-box">
          <div class="ice-box-title">Filters and Histograms</div>
          <b-form-select
            multiple
            :value="selected.filterVariableIds"
            :options="variables | filterVariable"
            @input="updateFilters"
            value-field="id"
            text-field="label"
            class="mb-3"
            size="sm" />
          <p># Patches Selected: {{ activeCount }} of {{ totalCount }}</p>
          <div class="ice-filter-container">
            <ice-filter
              v-for="filter in filters"
              :key="filter.variable.id"
              :filter="filter"
              :xf="xf"
              width="360"
              @brush="brushed"
              @destroy="destroyFilter">
            </ice-filter>
          </div>

          <!-- <select-picker
            :config="config.filters.charts.config"
            :options="config.filters.charts.options"
            :selected="state.filters.charts"
            v-on:input="selectFiltersCharts"
            label="label"
            value="id"
            title="Select filter variables..."
            multiple="true">
          </select-picker>
          <div class="ice-filter-container">
            <div
              is="ice-filter"
              v-for="filter in state.xf.filters"
              :key="filter.id"
              :id="filter.id"
              :range="filter.range"
              :variable="filter.variable"
              :selected="state.selected"
              :get-dim="filter.getDim"
              :get-selected-dim="filter.getSelectedDim"
              v-on:brush="setFilter"
              v-on:destroy="removeFilter">
            </div>
          </div> -->
        </div>
      </div>
      <!-- <ice-status :message="state.message" v-show="state.message"></ice-status> -->
      <ice-map :options="map.options"></ice-map>
      <!-- <div class="ice-loading" v-show="show.loading">
        <h1>Loading</h1>
        <div><i class="fa fa-spinner fa-spin fa-5x fa-fw"></i></div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios';

import EventBus from './event-bus';

import IceHeader from './components/IceHeader';
import IceMap from './components/IceMap';
import IceLegend from './components/IceLegend';
import IceFilter from './components/IceFilter';

export default {
  name: 'App',
  components: {
    IceHeader,
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
    };
  },
  computed: {
    ...mapGetters(['themes', 'theme', 'layer', 'variables', 'variable', 'filters', 'xf', 'activeCount', 'totalCount']),
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

    EventBus.$on('filter', () => {
      this.$store.dispatch('updateActiveCount');
    });
  },
  methods: {
    ...mapActions(['selectThemeById', 'selectVariableById', 'updateFilters']),
    brushed() {
      EventBus.$emit('filter');
    },
    destroyFilter(event) {
      const index = this.selected.filterVariableIds.indexOf(event);
      this.selected.filterVariableIds.splice(index, 1);
    },
  },
};
</script>

<style>
body {
  padding: 0px;
  margin: 0px;
  font-family: "proxima-nova-alt", Helvetica, Arial, sans-serif;
}

a {
  cursor: pointer;
}

.ice-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.ice-left-sidebar {
  display: inline;
  position: absolute;
  top: 60px;
  left: 0px;
  width: 345px;
  z-index: 1000;
}

.ice-right-sidebar {
  display: inline;
  position: absolute;
  top: 60px;
  right: 0px;
  width: 420px;
  z-index: 1000;
}

.ice-box {
  padding: 10px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  border-bottom-right-radius: 2px;
  box-shadow: 0px 0px 3px 0px #aaa;
}

.ice-box-title {
  font-weight: bold;
  font-size: 1.1em;
  font-variant: small-caps;
  margin-bottom: 5px;
}
/*
.ice-select-box {
  position: absolute;
  right: 435px;
  padding: 5px 5px;
  background: #fff;
  font-size: 12px;
  border-radius: 5px;
  box-shadow: 0 1px 5px rgba(0,0,0,0.4);
  z-index: 1000;
}

.ice-select-box.aggregation {
  top: 70px;
}

.ice-select-box.catchment {
  top: 140px;
}

.ice-select-box-title {
  font-size: 1.2em;
}

.ice-select-box-body {
  width: 100%;
  margin-top: 5px;
}
*/

/*.ice-loading {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  padding-top: 50px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
  text-align: center;
  color: #f5f5f5;
}
*/

</style>

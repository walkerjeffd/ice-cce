<template>
  <div id="app" class="full">
    <ice-header></ice-header>

    <div class="ice-container">
      <div class="ice-left-sidebar">
        <div class="ice-box">
          <button class="btn btn-default" @click="modals.about = true">
              <i class="fa fa-question-circle"></i> About
            </button>
            <button class="btn btn-default" @click="modals.dataset = true">
              <i class="fa fa-table"></i> Dataset
            </button>
        </div>
        <div class="ice-box">
          <div class="ice-box-title">Select Species</div>
          <select-picker
            :config="{}"
            :options="themes"
            :value="selected.themeId"
            :multiple="false"
            @input="selectThemeById"
            value-field="id"
            text-field="label"
            title="Select layer...">
          </select-picker>
        </div>
        <div class="ice-box">
          <div class="ice-box-title">Select Variable</div>
          <select-picker
            :config="{}"
            :options="variables"
            :value="selected.variableId"
            :multiple="false"
            :groups="variableGroups"
            @input="selectVariableById"
            value-field="id"
            text-field="label"
            title="Select variable...">
          </select-picker>
          <ice-legend></ice-legend>
        </div>
      </div>
      <div class="ice-right-sidebar">
        <div class="ice-box">
          <div class="ice-box-title">Histograms and Filters</div>
          <select-picker
            :config="{}"
            :options="variables | filterVariable"
            :value="selected.filters"
            :multiple="true"
            :groups="variableGroups"
            @input="updateFilters"
            value-field="id"
            text-field="label"
            title="Select variable(s)...">
          </select-picker>
          <div class="ice-filter-selected">
            # Patches Selected: {{ activeCount }} of {{ totalCount }}
          </div>
          <div class="ice-filter-container" :style="{'max-height': maxHeight + 'px'}">
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
        </div>
      </div>
      <ice-select-info
        :selected="selectedFeature"
        @zoomTo="zoomToFeature"
        @unselect="selectFeature"
        v-if="selectedFeature">
      </ice-select-info>
      <ice-map
        :options="map.options"
        :selectedFeature="selectedFeature"
        @selectFeature="selectFeature">
      </ice-map>
      <div class="ice-loading" v-show="loading">
        <h1>Loading</h1>
        <div><i class="fa fa-spinner fa-spin fa-5x fa-fw"></i></div>
      </div>
    </div>
    <modal :show="modals.about" @close="modals.about = false" size="lg">
      <span slot="title">About the Interactive Catchment Explorer</span>
      <div slot="body">
        <p>The <strong>Interactive Catchment Explorer (ICE)</strong> is an interactive data visualization tool for exploring geospatial environmental datasets.</p>
        <p>Given a set of polygon features (e.g. habitat patches), ICE allows users to:</p>
        <ol>
          <li>View spatial patterns of each variable by color-coding the features according to their values</li>
          <li>View the statistical distribution of each variable through a histogram</li>
          <li>Filter the dataset by specifying one or more criteria using the interactive histograms in order to select only the features meeting those criteria</li>
        </ol>
        <p>The following sections provide a brief set of instructions on how to use ICE.</p>
        <hr>
        <h3>Map</h3>
        <p>The map displays a basemap (satellite or street map), one or more tiled layers (CCE boundary, streams, lakes, etc.), and the local population patches for the selected species, which are colored by the selected variable.</p>
        <p>Use the map control bar to:</p>
        <ol>
          <li>Zoom in/out</li>
          <li>Change the transparency of the population patches</li>
          <li>Switch the basemap and turn on or off the tiled layers</li>
        </ol>
        <img src="/static/img/map-controls.png" alt="Map Controls" class="img-rounded">
        <hr>
        <h3>Histograms and Filters</h3>
        <p></p>
        <hr>
        <h3>Development</h3>
        <p>ICE was developed as part of the Spatial Hydro-Ecological Decision System (SHEDS) project by:</p>
        <ul>
          <li>Dr. Jeffrey D. Walker, <a href="https://walkerenvres.com" target="_blank">Walker Environmental Research LLC</a></li>
          <li>Dr. Ben Letcher, <a href="http://www.lsc.usgs.gov/?q=cafb-ben-letcher" target="_blank">USGS Conte Anadromous Fish Lab</a> and UMass Amherst</li>
        </ul>
        <p>ICE was built using a number of open-source frameworks and libraries including <a href="https://vuejs.org" target="_blank">VueJS</a>, <a href="https://d3js.org" target="_blank">d3.js</a>, <a href="http://leafletjs.com" target="_blank">Leaflet</a>, and <a href="https://getbootstrap.com/" target="_blank">Bootstrap</a>.</p>
      </div>
    </modal>
    <modal :show="modals.dataset" @close="modals.dataset = false">
      <span slot="title">About the Crown of the Continent Ecosystem Dataset</span>
      <div slot="body">Information about the dataset, link to download?</div>
    </modal>
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
import IceSelectInfo from './components/IceSelectInfo';
import Modal from './components/Modal';
import SelectPicker from './components/SelectPicker';

export default {
  name: 'App',
  components: {
    IceHeader,
    IceMap,
    IceLegend,
    IceFilter,
    IceSelectInfo,
    Modal,
    SelectPicker,
  },
  data() {
    return {
      selected: {
        themeId: null,
        variableId: null,
        filters: [],
      },
      map: {
        options: {
          center: [48.7996273507997, -114.13696289062501],
          zoom: 7,
          maxZoom: 18,
          minZoom: 5,
        },
      },
      loading: true,
      maxHeight: 200,
      modals: {
        about: false,
        dataset: false,
      },
    };
  },
  computed: {
    ...mapGetters(['themes', 'theme', 'layer', 'variables', 'variable', 'variableGroups', 'filters', 'xf', 'activeCount', 'totalCount', 'selectedFeature']),
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
      .then(config => this.$store.dispatch('setConfig', config))
      .then(() => this.$store.dispatch('selectDefaults'))
      .then(() => {
        this.loading = false;
      })
      .catch((error) => {
        alert('Uh oh! An error occurred. Please refresh and try again. If the problem persists please contact Jeff Walker at jeff@walkerenvres.com');
        console.log(error);
      });

    EventBus.$on('filter', () => {
      this.$store.dispatch('updateActiveCount');
    });

    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  methods: {
    ...mapActions(['selectVariableById', 'selectFeature']),
    handleResize() {
      this.maxHeight = window.innerHeight - 220;
    },
    zoomToFeature(feature) {
      EventBus.$emit('zoomToFeature', feature);
    },
    selectThemeById(id) {
      this.loading = true;
      this.selectFeature();
      this.updateFilters([]);
      this.$store.dispatch('selectThemeById', id)
        .then(() => {
          this.loading = false;
        })
        .catch((error) => {
          alert('Uh oh! An error occurred. Please refresh and try again. If the problem persists please contact Jeff Walker at jeff@walkerenvres.com');
          console.log(error);
        });
    },
    updateFilters(ids) {
      this.$store.dispatch('updateFilters', ids);
      this.selected.filters = ids;
    },
    brushed() {
      EventBus.$emit('filter');
    },
    destroyFilter(id) {
      const index = this.selected.filters.indexOf(id);
      this.selected.filters.splice(index, 1);
      this.$store.dispatch('updateFilters', this.selected.filters);
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
  width: 420px;
  z-index: 5000;
}

.ice-right-sidebar {
  display: inline;
  position: absolute;
  top: 60px;
  right: 0px;
  width: 425px;
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

.ice-filter-container {
  margin-top: 5px;
  overflow-y: auto;
  overflow-x: hidden;
}

.ice-filter-selected {
  font-size: 0.9em;
  margin-top: 10px;
  margin-bottom: 20px;
}

.ice-loading {
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


</style>

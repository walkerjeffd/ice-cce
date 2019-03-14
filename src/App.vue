<template>
  <div
    id="app"
    class="full">
    <ice-header/>

    <div class="ice-container">
      <div class="ice-left-sidebar">
        <div class="ice-box">
          <button
            class="btn btn-default"
            @click="modals.about = true">
            <i class="fa fa-question-circle"/> About ICE
          </button>
          <button
            class="btn btn-default"
            @click="modals.dataset = true">
            <i class="fa fa-table"/> About the Data
          </button>
          <!-- <button
            class="btn btn-default"
            @click="modals.download = true">
            <i class="fa fa-download"/> Download
          </button> -->
          <button
            class="btn btn-default"
            @click="modals.contact = true">
            <i class="fa fa-envelope"/> Contact Us
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
            title="Select layer..."
          />
        </div>
        <div class="ice-box">
          <div class="ice-box-title">Select Variable</div>
          <select-picker
            :config="{}"
            :options="variables"
            :value="selected.variableId"
            :multiple="false"
            :groups="variableGroups"
            @input="selectVariable"
            value-field="id"
            text-field="label"
            title="Select variable..."
          />
          <div v-show="variable">
            <button
              class="btn btn-xs btn-default pull-right"
              style="margin-top:10px"
              :class="{active: showLegendOptions}"
              @click="showLegendOptions = !showLegendOptions">
              Colors
            </button>
          </div>
          <div v-show="variable">
            <ice-legend
              id="legend"
              :width="340"
              :height="40"
              :margins="{left: 10, right: 20}"
              :n-bins="5"
              :type="legend.type"
              :colors="legend.scale.colors"
              :hcl="legend.scale.hcl"
              ticks
              style="margin-top:10px;"/>
          </div>
        </div>
        <div class="ice-box" v-if="showLegendOptions">
          <div class="pull-right">
            <button class="btn btn-xs" @click="showLegendOptions = false">×</button>
          </div>
          <div class="ice-box-title">Select Color Scale</div>
          <div>
            <div class="row">
              <div class="col-xs-3" style="margin-top:5px;">Scale Type:</div>
              <div class="col-xs-6">
                <select-picker
                  :config="{}"
                  :options="legendTypes"
                  :value="legend.type"
                  @input="selectLegendType"
                  value-field="id"
                  text-field="label"
                  title="Select legend type..."
                  />
              </div>
            </div>
          </div>
          <div class="row" style="margin-top:5px">
            <div class="col-xs-12">
              <p>Color Palettes:</p>
              <div
                class="ice-color-bar-select"
                v-for="scale in colorScales"
                :key="scale.id"
                @click="selectScale(scale)">
                <ice-legend
                  :width="340"
                  :height="40"
                  :margins="{left: 10, right: 20}"
                  :n-bins="5"
                  :type="legend.type"
                  :id="scale.id"
                  :colors="scale.colors"
                  :hcl="scale.hcl"
                  ticks/>
              </div>
            </div>
          </div>
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
            title="Select variable(s)..."
          />
          <div class="ice-filter-selected">
            # Patches Selected: {{ activeCount }} of {{ totalCount }}
          </div>
          <div
            class="ice-filter-container"
            :style="{'max-height': maxHeight + 'px'}">
            <ice-filter
              v-for="filter in filters"
              :key="filter.variable.id"
              :filter="filter"
              width="360"
              @brush="brushed"
              @destroy="destroyFilter"
            />
          </div>
        </div>
      </div>
      <ice-select-info
        :selected="selectedFeature"
        @zoomTo="zoomToFeature"
        @unselect="selectFeature"
        v-if="selectedFeature"
      />
      <ice-map
        :options="map.options"
        :selected-feature="selectedFeature"
        :legend-type="legend.type"
        :colors="legend.scale.colors"
        :hcl="legend.scale.hcl"
        @selectFeature="selectFeature"
      />
      <div
        class="ice-loading"
        v-show="loading">
        <h1>Loading</h1>
        <div><i class="fa fa-spinner fa-spin fa-5x fa-fw" /></div>
      </div>
    </div>
    <modal
      :show="modals.about"
      @close="modals.about = false"
      size="lg">
      <span slot="title">About the Interactive Catchment Explorer</span>
      <div slot="body">
        <about-modal></about-modal>
      </div>
    </modal>
    <modal
      :show="modals.dataset"
      @close="modals.dataset = false"
      size="lg">
      <span slot="title">About the Dataset</span>
      <div slot="body">
        <data-modal></data-modal>
      </div>
    </modal>
    <modal
      :show="modals.download"
      @close="modals.download = false"
      size="lg">
      <span slot="title">Download Data</span>
      <div slot="body">
        <download-modal></download-modal>
      </div>
    </modal>
    <modal
      :show="modals.contact"
      @close="modals.contact = false"
      size="md">
      <span slot="title">Contact Us</span>
      <div slot="body">
        <contact-modal></contact-modal>
      </div>
  </modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios';

import EventBus from './event-bus';

import IceHeader from './components/IceHeader.vue';
import IceMap from './components/IceMap.vue';
import IceLegend from './components/IceLegend.vue';
import IceFilter from './components/IceFilter.vue';
import IceSelectInfo from './components/IceSelectInfo.vue';
import Modal from './components/Modal.vue';
import SelectPicker from './components/SelectPicker.vue';
import ContactModal from './modals/Contact.vue';
import DataModal from './modals/Data.vue';
import DownloadModal from './modals/Download.vue';
import AboutModal from './modals/About.vue';

export default {
  name: 'app',
  components: {
    IceHeader,
    IceMap,
    IceLegend,
    IceFilter,
    IceSelectInfo,
    Modal,
    SelectPicker,
    ContactModal,
    DataModal,
    DownloadModal,
    AboutModal
  },
  data() {
    const colorScales = [
      {
        id: 'GYR',
        colors: ['#6BB844', '#F7EB48', '#EF4545'],
        hcl: true,
      }, {
        id: 'BY',
        colors: ['hsl(222,30%,20%)', 'hsl(62,100%,90%)'],
        hcl: true,
      }, {
        id: 'BR',
        colors: ['steelblue', 'orangered'],
        hcl: false,
      },
    ];

    const legendTypes = [
      {
        id: 'continuous',
        label: 'Continuous',
      }, {
        id: 'quantile',
        label: 'Quantile Bins',
      }, {
        id: 'quantize',
        label: 'Equal Width Bins',
      },
    ];

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
      legend: {
        type: legendTypes[0].id,
        scale: colorScales[0],
      },
      loading: true,
      maxHeight: 200,
      modals: {
        about: false,
        dataset: false,
        download: false,
        contact: false,
      },
      colorScales,
      legendTypes,
      showLegendOptions: false,
    };
  },
  computed: {
    ...mapGetters(['config', 'themes', 'theme', 'layer', 'variables', 'variable', 'variableGroups', 'filters', 'activeCount', 'totalCount', 'selectedFeature']),
  },
  filters: {
    filterVariable: variables => variables.filter(v => v.filter),
  },
  watch: {
    theme(theme) {
      this.selected.themeId = theme.id;
    },
    variable(variable) {
      if (!variable) return;
      this.selected.variableId = variable.id;
      this.selectLegendType(this.variable.scale.type);
    },
  },
  created() {
    axios.get('config.json')
      .then(response => response.data)
      .then(config => this.$store.dispatch('setConfig', config))
      .then(() => this.selectThemeById(this.config.defaults.theme))
      .then(() => {
      //   this.selectScale(this.colorScales[0]);
        // this.loading = false;
      })
      .catch((error) => {
        alert('Uh oh! An error occurred. Please refresh and try again. If the problem persists please contact Jeff Walker at jeff@walkerenvres.com');
        // eslint-disable-next-line
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
    selectScale(scale) {
      this.legend.scale = scale;
    },
    handleResize() {
      this.maxHeight = window.innerHeight - 220;
    },
    zoomToFeature(feature) {
      EventBus.$emit('zoomToFeature', feature);
    },
    selectLegendType(type) {
      this.legend.type = type;
    },
    selectVariable(id) {
      return this.selectVariableById(id);
    },
    selectThemeById(id) {
      // console.log('app:selectThemeById', id);

      this.selectFeature();
      this.updateFilters([]);

      if (!id) return;

      this.loading = true;
      this.$store.dispatch('selectThemeById', id)
        .then(() => {
          this.loading = false;
          return this.selectVariable(this.config.defaults.variable);
        })
        .catch((error) => {
          alert('Uh oh! An error occurred. Please refresh and try again. If the problem persists please contact Jeff Walker at jeff@walkerenvres.com');
          // eslint-disable-next-line
          console.log(error);
        });
    },
    updateFilters(ids) {
      // console.log('app:updateFilters()', ids);
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
    }
  }
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
  width: 440px;
  z-index: 3000;
}

.ice-right-sidebar {
  display: inline;
  position: absolute;
  top: 60px;
  right: 0px;
  width: 475px;
  z-index: 3000;
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
  margin-bottom: 0;
}

.ice-loading {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  padding-top: 50px;
  z-index: 5000;
  background: rgba(0, 0, 0, 0.7);
  text-align: center;
  color: #f5f5f5;
}

.ice-color-bar-select {
  box-sizing: border-box;
  cursor: pointer;
  border-top: 1px solid transparent;
  padding-top: 5px;
  padding-bottom: 0px;
  width: 360px;
}

.ice-color-bar-select:hover {
  border: 1px solid #aaa;
}
</style>

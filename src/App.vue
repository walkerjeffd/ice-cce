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
            @input="selectVariableById"
            value-field="id"
            text-field="label"
            title="Select variable..."
          />
          <div v-show="variable">
            <ice-color-bar
              :width="340"
              :height="40"
              :margins="{left: 10, right: 20}"
              :colors="selected.scale.colors"
              :hcl="selected.scale.hcl"
              :id="'legend'"
              ticks
              style="margin-top:10px;"/>
            <button
              class="btn btn-xs btn-default pull-right"
              style="margin-top:10px"
              :class="{active: showColorScales}"
              @click="showColorScales = !showColorScales">
              Colors
            </button>
          </div>
        </div>
        <div class="ice-box" v-if="showColorScales">
          <div class="pull-right">
            <button class="btn btn-xs" @click="showColorScales = false">×</button>
          </div>
          <div class="ice-box-title">Select Color Scale</div>
          <div
            class="ice-color-bar-select"
            v-for="scale in colorScales"
            :key="scale.id"
            @click="selectScale(scale)">
            <ice-color-bar
              :width="340"
              :height="20"
              :margins="{left: 10, right: 10}"
              :id="scale.id"
              :colors="scale.colors"
              :hcl="scale.hcl"/>
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
              :xf="xf"
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
        :colors="selected.scale.colors"
        :hcl="selected.scale.hcl"
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
        <div class="row">
          <div class="col-md-6">
            <p>
              The <strong>Interactive Catchment Explorer (ICE)</strong> is a data
              visualization tool for exploring geospatial environmental datasets.
            </p>
            <p>ICE is designed to:</p>
            <ol>
              <li>
                Identify spatial patterns among local population patches of the individual
                covariates and vulnerability assessment risk scores for each species,
              </li>
              <li>
                View the distribution of values for each variable using histograms,
              </li>
              <li>
                Apply dynamic and interactive filters to identify which patches meet one or more
                specific criteria and to discover relationships between individual variables.
              </li>
            </ol>
          </div>
          <div class="col-md-6">
            <img
              src="static/img/about/filter-animation-400x250.gif"
              alt="Filter Animation"
              class="img-rounded img-center">
          </div>
        </div>
        <hr>
        <h3>Map</h3>
        <p>
          The map shows a basemap (satellite or street map), one or more tiled layers (CCE
          boundary, streams, lakes, etc.), and the local population patches for the selected
          species, which are colored according to their values for the selected variable.
        </p>
        <h4>Map Controls</h4>
        <div class="row">
          <div class="col-md-6">
            <p>
              Use the map controls to zoom in and out, adjust the transparency of the patches layer,
              and to switch basemaps or show/hide individual layers.
            </p>
          </div>
          <div class="col-md-6">
            <img
              src="static/img/about/map-controls-400x275.png"
              alt="Map Controls"
              class="img-rounded">
          </div>
        </div>
        <h4>Select a Patch</h4>
        <div class="row">
          <div class="col-md-6">
            <p>
              Click on a population patch to select it. This will open a new box showing the name
              and ID of the selected patch, and providing additional options to view the data for
              all variables, to zoom in to, or to unselect this patch.
            </p>
          </div>
          <div class="col-md-6">
            <img
              src="static/img/about/select-patch-400x200.png"
              alt="Selected Patch Options"
              class="img-rounded">
          </div>
        </div>
        <hr>
        <h3>Histograms and Filters</h3>
        <p>
          Each histogram shows the distribution of values for the population patches of the selected
          species. The histograms also act as interactive filters to identify which patches
          have values within a specific range of one or more variables.
        </p>
        <h4>View Histogram</h4>
        <div class="row">
          <div class="col-md-6">
            <p>
              Select one or more variables from the drop down menu to show the corresponding
              histogram(s). Each histogram shows the distribution of values over all patches (
              assuming no filters have been set as explained below in the Filtering with Multiple
              Histograms section). The vertical blue line shows the mean value of the distribution.
            </p>
          </div>
          <div class="col-md-6">
            <img
              src="static/img/about/histogram-400x250.png"
              alt="Histogram of Selected Variable"
              class="img-rounded">
          </div>
        </div>
        <h4>Set Filter</h4>
        <div class="row">
          <div class="col-md-6">
            <p>
              Click and drag over a histogram to set a filter for that variable. When a
              filter is set, the map will only show patches that have values within the range of the
              filter.
            </p>
            <p>
              For example, this screenshot shows which patches have the highest overall risk by
              setting a filter from 50 to 100 on the Overall Risk (RCP 4.5, 2035) histogram. The
              mean value has now changed from 36.6 to 63.5 because it is computed only from patches
              with values within this filtered range.
            </p>
            <p>
              To reset (or clear) a filter, click the (reset) link or simply click once anywhere
              outside the current filter range on the histogram itself.
            </p>
          </div>
          <div class="col-md-6">
            <img
              src="static/img/about/filter-400x248.png"
              alt="Histogram of Selected Variable"
              class="img-rounded">
          </div>
        </div>
        <h4>Filtering with Multiple Histograms</h4>
        <div class="row">
          <div class="col-md-6">
            <p>
              When more than one histogram are being shown, setting a filter on one variable will
              affect the histograms of all other variables. The histograms for these other variables
              will show the distributions based on only patches that have values within the range of
              the filter.
            </p>
            <p>
              For example, on the left no filters are set and thus both histograms show their
              distributions based on all 497 patches. But on the right, a filter has been set from
              50 to 100 for the Overall Risk Score (RCP 4.5, 2035). Because of this filter, the
              distribution (and mean) of the Historical Mean August Stream Temperature are now
              based only on the 127 (out of 497) patches that have an Overall Risk greater than 50.
            </p>
          </div>
          <div class="col-md-6">
            <img
              src="static/img/about/multiple-histograms-400x229.png"
              alt="Multiple Histograms"
              class="img-rounded">
          </div>
        </div>
        <h4>Applying Multiple Filters</h4>
        <div class="row">
          <div class="col-md-6">
            <p>
              Filters can be set on more than one variable to identify which patches meet
              multiple criteria simultaneously.
            </p>
            <p>
              In this example, only patches with Overall Risk (RCP 4.5, 2035) greater
              than 50 <em>AND</em> a Historical Mean August Stream Temperature greater than 10 degC
              are now being shown on the map.
            </p>
          </div>
          <div class="col-md-6">
            <img
              src="static/img/about/multiple-filters-400x256.png"
              alt="Multiple Filters"
              class="img-rounded">
          </div>
        </div>
        <hr>
        <h3>Dynamic Interaction</h3>
        <div class="row">
          <div class="col-md-6">
            <p>
              ICE was designed to provide a highly interactive user experience and
              thus facilitate new and exciting ways of performaing geospatial data exploration.
            </p>
            <p>
              Each filter can be dynamically dragged and resized resulting in real-time updates to
              the map and histograms of other variables as shown in the example below.
            </p>
            <p>
              By observing how changes in the filter of one variable affects the distributions of
              other variables as well as which patches appear on the map, the user can discover
              relationships between variables and apply multivariate criteria to identify specific
              patches that have certain characteristics.
            </p>
            <p>
              In this example, when the filter for Overall Risk is dragged from left to right
              to increase the range of values, the histogram for the Historical Mean August Stream
              Temperature also shifts from left to right. This indicates that patches with higher
              overall risk scores tend to have higher mean August stream temperatures and vice
              versa, as expected.
            </p>
          </div>
          <div class="col-md-6">
            <img
              src="static/img/about/filter-animation-400x250.gif"
              alt="Filter Animation"
              class="img-rounded">
          </div>
        </div>
        <hr>
        <h3>Development Team</h3>
        <p>
          ICE is part of the <a href="http://ecosheds.org" target="_blank">Spatial
          Hydro-Ecological Decision System (SHEDS)</a> project and is developed by:
        </p>
        <ul>
          <li>
            Dr. Jeffrey D. Walker,
            <a href="https://walkerenvres.com" target="_blank">
              Walker Environmental Research LLC
            </a>
          </li>
          <li>
            Dr. Benjamin Letcher,
            <a href="http://www.lsc.usgs.gov/?q=cafb-ben-letcher" target="_blank">
              USGS Conte Anadromous Fish Lab
            </a> and
            <a href="https://eco.umass.edu/people/faculty/letcher-ben/" target="_blank">
              UMass Amherst
            </a>
          </li>
        </ul>
        <p>
          This version of ICE was developed with funding from the
          <a href="https://www.usgs.gov/centers/norock" target="_blank">
            USGS Northern Rocky Mountain Science Center
          </a>
          to support the Vulnerability Assessment of Westslope Cutthroat Trout and Bull Trout in
          the Crown of the Continent Ecosystem.
        </p>
        <p>
          ICE was built using numerous open-source frameworks and libraries including
          <a href="https://vuejs.org" target="_blank">VueJS</a>,
          <a href="https://d3js.org" target="_blank">d3.js</a>,
          <a href="http://crossfilter.github.io/crossfilter" target="_blank">crossfilter.js</a>,
          <a href="http://leafletjs.com" target="_blank">LeafletJS</a>, and
          <a href="https://getbootstrap.com/" target="_blank">Bootstrap</a>, among others.
        </p>
        <hr>
        <h3>Contact Us</h3>
        <p>
          If you have questions about this application or are interested in using ICE with your
          own dataset, please feel free to contact us using this form.
        </p>
        <form class="form-horizontal contact" action="https://formspree.io/jeff@walkerenvres.com" method="POST">
          <div class="form-group">
            <label for="inputName" class="col-sm-2 control-label">Name</label>
            <div class="col-sm-6">
              <input type="text" name="name" class="form-control" id="inputName" placeholder="Name">
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail" class="col-sm-2 control-label">E-mail</label>
            <div class="col-sm-6">
              <input
                type="email"
                name="email"
                class="form-control"
                id="inputEmail"
                placeholder="E-mail">
            </div>
          </div>
          <div class="form-group">
            <label for="inputMessage" class="col-sm-2 control-label">Message</label>
            <div class="col-sm-6">
              <textarea
                name="message"
                class="form-control"
                id="inputMessage"
                rows="8"
                placeholder="Your message"></textarea>
            </div>
          </div>
          <input type="text" name="_gotcha" style="display:none">
          <input type="hidden" name="_subject" value="ICE CCE Contact Submission">
          <div class="form-group">
            <div class="col-sm-offset-2 col-sm-6">
              <input type="submit" class="btn btn-default" value="Send">
            </div>
          </div>
        </form>
      </div>
    </modal>
    <modal
      :show="modals.dataset"
      @close="modals.dataset = false">
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
import IceColorBar from './components/IceColorBar';
import IceFilter from './components/IceFilter';
import IceSelectInfo from './components/IceSelectInfo';
import Modal from './components/Modal';
import SelectPicker from './components/SelectPicker';

export default {
  name: 'App',
  components: {
    IceHeader,
    IceMap,
    IceColorBar,
    IceFilter,
    IceSelectInfo,
    Modal,
    SelectPicker,
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

    return {
      selected: {
        themeId: null,
        variableId: null,
        filters: [],
        scale: colorScales[0],
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
      colorScales,
      showColorScales: false,
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
        this.selectScale(this.colorScales[0]);
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
    selectScale(scale) {
      this.selected.scale = scale;
      this.showColorScales = false;
    },
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

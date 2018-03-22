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
          boundary, basins, streams, lakes, etc.), and the local population patches for the selected
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
      </div>
    </modal>
    <modal
      :show="modals.dataset"
      @close="modals.dataset = false"
      size="lg">
      <span slot="title">About the Dataset</span>
      <div slot="body">
        <h3>Overview</h3>
        <p>
          This application presents a Vulnerability Assessment for Westslope Cutthroat Trout and
          Bull Trout in the Crown of the Continent Ecosystem (CCE). This assessment
          was performed by the <a href="https://www.usgs.gov/centers/norock" target="_blank">USGS
          Northern Rocky Mountain Science Center</a> with support from
          <a href="https://walkerenvres.com">Walker Environmental Research LLC</a>.
        </p>
        <p>
          The dataset shown in this application includes two sets of variables
        </p>
        <ol>
          <li>
            <strong>Vulnerability Risk Scores</strong>: results of the vulnerability assessment
            scaled from 0 to 100 across the CCE and within each major basin.
          </li>
          <li>
            <strong>Covariates (Input Variables)</strong>: include species hybridization,
            demographics, presence/absence, habitat characteristics and climate exposure.
          </li>
        </ol>
        <p>
          The following sections provide more details about each set of variables.
        </p>
        <p>
          The data may be referenced using the following citation:
        </p>
        <blockquote>
          Muhlfeld, C. C., V. S. D'Angelo, and R. P. Kovach. USGS unpublished data, Glacier National
          Park, West Glacier, Montana 59936; cmuhlfeld@usgs.gov.
        </blockquote>
        <hr>
        <h3>Vulnerability Risk Scores</h3>
        <p>
          The vulnerability risk scores were developed using a conceptual climate change
          vulnerability framework that incorporates the sensitivity, exposure and adaptive capacity
          of each of the two species (Westslope Cutthroat Trout and Bull Trout). Wade et al. (2017;
          see citations list below) provide an example of this type of approach, which was further
          refined for this study using additional data and improved understanding of the underlying
          relationships.
        </p>
        <p>
          For each species, a set of vulnerability risk scores were computed for each local
          population path under four potential future scenarios (
            <a
              href="https://en.wikipedia.org/wiki/Representative_Concentration_Pathways"
              target="_blank">RCP 4.5 and 8.5 greenhouse gas concentration trajectories</a>
          for years 2035 and 2075).
          The scores are scaled from 0 to 100 (higher values = greater vulnerability) across 1) all
          patches within the CCE region, and 2) across all patches within each major basin. The
          overall risk score is based on the average across the individual scores for each component
          (i.e. Climate, Habitat, Demographic, Genetic).
        </p>
        <table class="table table-condensed table-striped" style="width:100%">
          <thead>
            <tr>
              <th class="col-md-4">Variable</th>
              <th class="col-md-6">Description</th>
              <th class="col-md-1 text-center">Westslope Cutthroat Trout</th>
              <th class="col-md-1 text-center">Bull Trout</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="col-md-4">Overall Risk</td>
              <td class="col-md-6">
                Overall risk based on the average across the individual components below.
              </td>
              <td class="col-md-1 text-center">X</td>
              <td class="col-md-1 text-center">X</td>
            </tr>
            <tr>
              <td class="col-md-4">Climate Risk</td>
              <td class="col-md-6">
                Risk associated with exposure to changes in climate.
              </td>
              <td class="col-md-1 text-center">X</td>
              <td class="col-md-1 text-center">X</td>
            </tr>
            <tr>
              <td class="col-md-4">Demographic Risk</td>
              <td class="col-md-6">
                Risk associated with the demographics of each population (Westslope Cutthroat
                Trout only).
              </td>
              <td class="col-md-1 text-center">X</td>
              <td class="col-md-1 text-center"></td>
            </tr>
            <tr>
              <td class="col-md-4">Genetic Risk</td>
              <td class="col-md-6">
                Risk associated with the genetics of each population (Westslope Cutthroat
                Trout only).
              </td>
              <td class="col-md-1 text-center">X</td>
              <td class="col-md-1 text-center"></td>
            </tr>
            <tr>
              <td class="col-md-4">Demographic/Genetic Risk</td>
              <td class="col-md-6">
                Risk associated with both the demographics and genetics of each population (Bull
                Trout only).
              </td>
              <td class="col-md-1 text-center"></td>
              <td class="col-md-1 text-center">X</td>
            </tr>
            <tr>
              <td class="col-md-4">Habitat Risk</td>
              <td class="col-md-6">
                Risk associated with habitat quantity and quality for each population.
              </td>
              <td class="col-md-1 text-center">X</td>
              <td class="col-md-1 text-center">X</td>
            </tr>
          </tbody>
        </table>
        <hr>
        <h3>Hybridization Covariates</h3>
        <table class="table table-condensed table-striped" style="width:100%">
          <thead>
            <tr>
              <th class="col-md-4">Variable</th>
              <th class="col-md-6">Description</th>
              <th class="col-md-1 text-center">Westslope Cutthroat Trout</th>
              <th class="col-md-1 text-center">Bull Trout</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="col-md-4">Hybridization Threat Index (HTI)</td>
              <td class="col-md-6">
                Hybrid Threat Index describes risk of admixture via connectivity to other admixed
                populations. HTI is calculated using a weighted (by fluvial distance) summation of
                admixture among all interconnected populations.
              </td>
              <td class="col-md-1 text-center">X</td>
              <td class="col-md-1 text-center"></td>
            </tr>
            <tr>
              <td class="col-md-4">Maximum Rainbow Trout Admixture</td>
              <td class="col-md-6">
                Maximum rainbow trout admixture (0 to 100) observed within a patch. Used also as
                component of the HTI variable.
              </td>
              <td class="col-md-1 text-center">X</td>
              <td class="col-md-1 text-center"></td>
            </tr>
          </tbody>
        </table>
        <hr>
        <h3>Demographic Covariates</h3>
        <table class="table table-condensed table-striped" style="width:100%">
          <thead>
            <tr>
              <th class="col-md-4">Variable</th>
              <th class="col-md-6">Description</th>
              <th class="col-md-1 text-center">Westslope Cutthroat Trout</th>
              <th class="col-md-1 text-center">Bull Trout</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="col-md-4">Average Abundance (2000-2017)</td>
              <td class="col-md-6">
                Average number of redds over 2000-2017 based on either 1) at least five years of
                data, or 2) model predictions using the methodology by Kovach et al. (2016).
              </td>
              <td class="col-md-1 text-center"></td>
              <td class="col-md-1 text-center">X</td>
            </tr>
            <tr>
              <td class="col-md-4">Average Abundance Based on Model Predictions</td>
              <td class="col-md-6">
                Indicates whether the Average Abundance (2000-2017) was based on model predictions
                (1) or at least five years of data (0).
              </td>
              <td class="col-md-1 text-center"></td>
              <td class="col-md-1 text-center">X</td>
            </tr>
            <tr>
              <td class="col-md-4">Invasive Species Distance Index</td>
              <td class="col-md-6">
                Composite statistic (from 0 to 6) that includes distance data for invasive brook
                trout, brown trout, and lake trout. "0" means no invasive species connected to
                population, "6" means all three species are present in the core population patch.
              </td>
              <td class="col-md-1 text-center">X</td>
              <td class="col-md-1 text-center">X</td>
            </tr>
            <tr>
              <td class="col-md-4">Isolation Status</td>
              <td class="col-md-6">
                Isolation status (1 = isolated, 0 = not isolated) of each patch based on 1) the
                presence of upstream barriers or 2) by distance and poor habitat when verified by
                biologists.
              </td>
              <td class="col-md-1 text-center">X</td>
              <td class="col-md-1 text-center">X</td>
            </tr>
            <tr>
              <td class="col-md-4">Disjunct Population Status</td>
              <td class="col-md-6">
                Disjunct population status (1 = disjunt, 0 = not disjunt) indicating whether
                population does not interact with other populations due to physical barriers, low
                population, poor migration corridor habitat, or known/assumed reproductive
                isolation. Similar to Isolation Status but includes these other factors in addition
                to physical barriers. If a population is disjunct then the Number of Connected
                Populations will also be zero.
              </td>
              <td class="col-md-1 text-center"></td>
              <td class="col-md-1 text-center">X</td>
            </tr>
            <tr>
              <td class="col-md-4">Number of Connected Populations</td>
              <td class="col-md-6">
                Number of other populations connected to each patch.
              </td>
              <td class="col-md-1 text-center">X</td>
              <td class="col-md-1 text-center">X</td>
            </tr>
          </tbody>
        </table>
        <hr>
        <h3>Presence/Absence Covariates</h3>
        <table class="table table-condensed table-striped" style="width:100%">
          <thead>
            <tr>
              <th class="col-md-4">Variable</th>
              <th class="col-md-6">Description</th>
              <th class="col-md-1 text-center">Westslope Cutthroat Trout</th>
              <th class="col-md-1 text-center">Bull Trout</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="col-md-4">Presence of Westslope Cutthroat Trout</td>
              <td class="col-md-6">
                Presence (1) or absence (0) of Westslope Cutthroat Trout within each patch.
              </td>
              <td class="col-md-1 text-center">X</td>
              <td class="col-md-1 text-center"></td>
            </tr>
            <tr>
              <td class="col-md-4">Presence of Bull Trout</td>
              <td class="col-md-6">Presence (1) or absence (0) of Bull Trout within each patch.</td>
              <td class="col-md-1 text-center">X</td>
              <td class="col-md-1 text-center"></td>
            </tr>
            <tr>
              <td class="col-md-4">Presence of Lake Trout</td>
              <td class="col-md-6">Presence (1) or absence (0) of Lake Trout within each patch.</td>
              <td class="col-md-1 text-center">X</td>
              <td class="col-md-1 text-center">X</td>
            </tr>
            <tr>
              <td class="col-md-4">Presence of Brown Trout</td>
              <td class="col-md-6">
                Presence (1) or absence (0) of Brown Trout within each patch.
              </td>
              <td class="col-md-1 text-center">X</td>
              <td class="col-md-1 text-center">X</td>
            </tr>
            <tr>
              <td class="col-md-4">Presence of Brook Trout</td>
              <td class="col-md-6">
                Presence (1) or absence (0) of Brook Trout within each patch.
              </td>
              <td class="col-md-1 text-center">X</td>
              <td class="col-md-1 text-center">X</td>
            </tr>
          </tbody>
        </table>
        <hr>
        <h3>Habitat Covariates</h3>
        <table class="table table-condensed table-striped" style="width:100%">
          <thead>
            <tr>
              <th class="col-md-4">Variable</th>
              <th class="col-md-6">Description</th>
              <th class="col-md-1 text-center">Westslope Cutthroat Trout</th>
              <th class="col-md-1 text-center">Bull Trout</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="col-md-4">Patch Area (km2)</td>
              <td class="col-md-6">Total area (sq km) of each patch.</td>
              <td class="col-md-1 text-center">X</td>
              <td class="col-md-1 text-center">X</td>
            </tr>
            <tr>
              <td class="col-md-4">Stream Length (km)</td>
              <td class="col-md-6">Total stream length (km) within each patch.</td>
              <td class="col-md-1 text-center">X</td>
              <td class="col-md-1 text-center"></td>
            </tr>
            <tr>
              <td class="col-md-4">
                Stream Length with Critical Spawning &amp; Rearing Habitat (km)
              </td>
              <td class="col-md-6">
                Total stream length (km) providing critical spawning and rearing habitat within each
                patch.
              </td>
              <td class="col-md-1 text-center"></td>
              <td class="col-md-1 text-center">X</td>
            </tr>
            <tr>
              <td class="col-md-4">Road Length per Unit Patch Area (km/km2)</td>
              <td class="col-md-6">
                Total length of roads (km) within the entire drainage area of each patch divided by
                total patch area (km2). Note that the drainage areas of some patches are larger than
                the patches themselves due to upstream barriers.
              </td>
              <td class="col-md-1 text-center">X</td>
              <td class="col-md-1 text-center">X</td>
            </tr>
            <tr>
              <td class="col-md-4">Frac. Patch Area as Valley Bottom</td>
              <td class="col-md-6">Fraction (0 to 1) of patch area representing valley bottom.</td>
              <td class="col-md-1 text-center">X</td>
              <td class="col-md-1 text-center">X</td>
            </tr>
          </tbody>
        </table>
        <hr>
        <h3>Climate Exposure Covariates</h3>
        <p>
          For each of the following variables, values are provided based on historical conditions
          (1985-2005) and four potential future scenarios
            (<a
              href="https://en.wikipedia.org/wiki/Representative_Concentration_Pathways"
              target="_blank">RCP 4.5 and 8.5 greenhouse gas concentration trajectories</a>
          for years 2035 and 2075).
        </p>
        <table class="table table-condensed table-striped" style="width:100%">
          <thead>
            <tr>
              <th class="col-md-4">Variable</th>
              <th class="col-md-6">Description</th>
              <th class="col-md-1 text-center">Westslope Cutthroat Trout</th>
              <th class="col-md-1 text-center">Bull Trout</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="col-md-4">Mean Aug. Stream Temp, degC</td>
              <td class="col-md-6">
                Average of the mean August stream temperature (degC) across all streams within each
                patch. Average is computed by weighting the mean August temperature of each stream
                segment by its length (i.e. this is a length-weighted average across all streams).
              </td>
              <td class="col-md-1 text-center">X</td>
              <td class="col-md-1 text-center"></td>
            </tr>
            <tr>
              <td class="col-md-4">Max Aug. Stream Temp, degC</td>
              <td class="col-md-6">
                Maximum of the mean August stream temperature (degC) among all streams within each
                patch.
              </td>
              <td class="col-md-1 text-center">X</td>
              <td class="col-md-1 text-center"></td>
            </tr>
            <tr>
              <td class="col-md-4">Frac. Stream Length with Mean Aug Temp > 15 degC</td>
              <td class="col-md-6">
                Fraction (0 to 1) of the total stream length with mean August temperatures exceeding
                15 degC within each patch.
              </td>
              <td class="col-md-1 text-center">X</td>
              <td class="col-md-1 text-center"></td>
            </tr>
            <tr>
              <td class="col-md-4">Frac. S/R Habitat Length with Mean Aug Temp > 15 degC</td>
              <td class="col-md-6">
                Fraction (0 to 1) of the total spawning &amp; rearing habitat length with mean
                August temperatures exceeding 15 degC within each patch.
              </td>
              <td class="col-md-1 text-center"></td>
              <td class="col-md-1 text-center">X</td>
            </tr>
            <tr>
              <td class="col-md-4">May Precipitation, mm</td>
              <td class="col-md-6">
                Average total precipitation (mm) in the month of May. Computed from continuous grids
                (i.e. rasters) using spatial averaging across each patch.
              </td>
              <td class="col-md-1 text-center">X</td>
              <td class="col-md-1 text-center"></td>
            </tr>
          </tbody>
        </table>
        <hr>
        <h3>Related Citations</h3>
        <ul>
          <li>
            Muhlfeld, C.C., R.P. Kovach, R. Al-Chokhachy and 12 co-authors. 2017 Legacy
            introductions and climatic variation explain spatiotemporal patterns of invasive
            hybridization in a native trout. Global Change Biology 2017;00:1–11.
            https://doi.org/10.1111/gcb.13681
          </li>
          <li>
            Kovach, R.P., Al-Chokhachy, R., Whited, D., Dux, A., and Schmetterling, Dux, A.M.,
            &amp; Muhlfeld, C.C. 2016 Climate, invasive species, and land-use drive population
            dynamics of a coldwater specialist. Journal of Applied Ecology.
            doi: 10.1111/1365-2664.12766
          </li>
          <li>
            Wade, A.A., Hand, B.K., Kovach, R.P., Luikart, G., Whited, D.C. &amp; Muhlfeld, C.C.
            2017 Accounting for adaptive capacity and uncertainty in assessments of species’
            climate-change vulnerability. Conservation Biology 31: 136-149.
          </li>
          <li>
            Giersch, J.J., Jordan, S., Luikart, G., Jones, L.A., Hauer, F.R. &amp; Muhlfeld, C.C.
            2015 Climate-induced range contraction of a rare alpine aquatic invertebrate. Freshwater
            Science 34: 53-65.
          </li>
          <li>
            Muhlfeld, C.C., Kovach, R.P., Jones, L.A., Al-Chokhachy, R., Boyer, M.C., Leary, R.F.,
            Lowe, W.H., Luikart, G. &amp; Allendorf, F.W. 2014 Invasive hybridization in a
            threatened species is accelerated by climate change. Nature Climate Change 4: 620-624.
          </li>
          <li>
            Hauer, F.R., Locke, H., Dreitz, V.J., Hebblewhite, M., Lowe, W.H., Muhlfeld, C.C.,
            Nelson, C.R., Proctor, M.F. &amp; Rood, S.B. 2016 Gravel-bed river floodplains are the
            ecological nexus of glaciated mountain landscapes. Science Advances 2: e1600026.
          </li>
          <li>
            Muhlfeld, C.C., D'Angelo, V.S., Downs, C., Powell, J., Amish, S., Luikart, G., Kovach,
            R., Boyer, M. &amp; Kalinowski, S. 2016 Genetic status and conservation of westslope
            cutthroat trout in Glacier National Park. Transactions of the American Fisheries Society
            145: 1093-1109.
          </li>
          <li>
            Kovach, R.P., Hand, B.K., Hohenlohe, P.A., Cosart, T.F., Boyer, M.C., Neville, H.H.,
            Muhlfeld, C.C., Amish, S.J., Carim, K., Narum, S.R., Lowe, W.H., Allendorf, F.W. &amp;
            Luikart, G. 2016 Vive la résistance: genome-wide selection against introduced alleles in
            invasive hybrid zones. Proceedings of the Royal Society B-Biological Sciences 283:
            20161380.
          </li>
          <li>
            Kovach, R.P., Muhlfeld, C.C., Wade, A.A., Hand, B.K., Whited, D.C., DeHaan, P.W.,
            Al-Chokhachy, R. &amp; Luikart, G. 2015 Genetic diversity is related to climatic
            variation and vulnerability in threatened bull trout. Global Change Biology 21:
            2510-2524.</li>
          <li>
            Kovach, R.P., Muhlfeld, C.C., Boyer, M.C., Lowe, W.H., Allendorf, F.W. &amp; Luikart, G.
            2015 Dispersal and selection mediate hybridization between a native and invasive
            species. Proceedings of the Royal Society B-Biological Sciences 282: 9.
          </li>
          <li>
            Bean, J.R., Wilcox, A.C., Woessner, W.W. &amp; Muhlfeld, C.C. 2015 Multiscale
            hydrogeomorphic influences on bull trout (Salvelinus confluentus) spawning habitat.
            Canadian Journal of Fisheries and Aquatic Sciences 72: 514-526.
          </li>
          <li>
            Muhlfeld, C.C., Kovach, R.P., Jones, L.A., Al-Chokhachy, R., Boyer, M.C., Leary, R.F.,
            Lowe, W.H., Luikart, G. &amp; Allendorf, F.W. 2014 Invasive hybridization in a
            threatened species is accelerated by climate change. Nature Climate Change 4: 620-624.
          </li>
          <li>
            Jones, L.A., Muhlfeld, C.C., Marshall, L.A., McGlynn, B.L. &amp; Kershner, J.L. 2014
            Estimating thermal regimes of bull trout and assessing the potential effects of climate
            warming on critical habitats. River Research and Applications 30: 204-216.
          </li>
          <li>
            Al-Chokhachy, R., Muhlfeld, C.C., Boyer, M.C., Jones, L.A., Steed, A. &amp; Kershner,
            J.L. 2014 Quantifying the effectiveness of conservation measures to control the spread
            of anthropogenic hybridization in stream salmonids: a climate adaptation case study.
            North American Journal of Fisheries Management 34: 642-652.
          </li>
          <li>
            Hohenlohe, P.A., Day, M.D., Amish, S.J., Miller, M.R., Kamps-Hughes, N., Boyer, M.C.,
            Muhlfeld, C.C., Allendorf, F.W., Johnson, E.A. &amp; Luikart, G. 2013 Genomic patterns
            of introgression in rainbow and westslope cutthroat trout illuminated by overlapping
            paired-end RAD sequencing. Molecular ecology 22: 3002-3013.
          </li>
          <li>
            D'Angelo, V.S. &amp; Muhlfeld, C.C. 2013 Factors Influencing the distribution of native
            bull trout and westslope cutthroat trout in streams of western Glacier National Park,
            Montana. Northwest Science 87: 1-11.
          </li>
          <li>
            Muhlfeld, C.C., McMahon, T.E., Boyer, M.C. &amp; Gresswell, R.E. 2009 Local habitat,
            watershed, and biotic factors influencing the spread of hybridization between native
            westslope cutthroat trout and introduced rainbow trout. Transactions of the American
            Fisheries Society 138: 1036-1051.
          </li>
          <li>
            Muhlfeld, C.C., McMahon, T.E., Belcer, D. &amp; Kershner, J.L. 2009 Spatial and temporal
            spawning dynamics of native westslope cutthroat trout, Oncorhynchus clarkii lewisi,
            introduced rainbow trout, Oncorhynchus mykiss, and their hybrids. Canadian Journal of
            Fisheries and Aquatic Sciences 66: 1153-1168.
          </li>
          <li>
            Muhlfeld, C.C., Kalinowski, S.T., McMahon, T.E., Taper, M.L., Painter, S., Leary, R.F.
            &amp; Allendorf, F.W. 2009 Hybridization rapidly reduces fitness of a native trout in
            the wild. Biology Letters 5: 328-331.
          </li>
          <li>
            Boyer, M.C., Muhlfeld, C.C. &amp; Allendorf, F.W. 2008 Rainbow trout (Oncorhynchus
            mykiss) invasion and the spread of hybridization with native westslope cutthroat trout
            (Oncorhynchus clarkii lewisi). Canadian Journal of Fisheries and Aquatic Sciences 65:
            658-669.
          </li>
          <li>
            Hitt, N.P., Frissell, C.A., Muhlfeld, C.C. &amp; Allendorf, F.W. 2003 Spread of
            hybridization between native westslope cutthroat trout, Oncorhynchus clarki lewisi, and
            nonnative rainbow trout, Oncorhynchus mykiss. Canadian Journal of Fisheries and Aquatic
            Sciences 60: 1440-1451.
          </li>
        </ul>
      </div>
    </modal>
    <modal
      :show="modals.contact"
      @close="modals.contact = false"
      size="md">
      <span slot="title">Contact Us</span>
      <div slot="body">
        <p>
          If you have questions about this application, discovered any bugs, or are interested in
          using ICE with your own dataset, please feel free to contact us using this form.
        </p>
        <hr>
        <form class="form-horizontal contact" action="https://formspree.io/jeff@walkerenvres.com" method="POST">
          <div class="form-group">
            <label for="inputName" class="col-sm-2 control-label">Name</label>
            <div class="col-sm-10">
              <input type="text" name="name" class="form-control" id="inputName" placeholder="Name">
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail" class="col-sm-2 control-label">E-mail</label>
            <div class="col-sm-10">
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
            <div class="col-sm-10">
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
        contact: false,
      },
      colorScales,
      legendTypes,
      showLegendOptions: false,
    };
  },
  computed: {
    ...mapGetters(['config', 'themes', 'theme', 'layer', 'variables', 'variable', 'variableGroups', 'filters', 'xf', 'activeCount', 'totalCount', 'selectedFeature']),
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
        this.loading = false;
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
      this.loading = true;
      this.selectFeature();
      this.updateFilters([]);
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

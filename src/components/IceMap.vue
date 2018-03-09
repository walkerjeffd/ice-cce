<template>
  <div class="ice-map">
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as d3 from 'd3';
import 'leaflet/dist/leaflet.css';

import EventBus from '../event-bus';

require('../leaflet/controlTransparency');
require('leaflet-bing-layer');

export default {
  props: {
    options: {
      type: Object,
      required: true,
    },
    selectedFeature: {
      type: Object,
      required: false,
    },
    colors: {
      type: Array,
      default: () => ['steelblue', 'orangered'],
      required: false,
    },
    hcl: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      map: null,
      tooltip: null,
      disableClick: false,
    };
  },
  mounted() {
    this.map = L.map(this.$el, {
      ...this.options,
    });

    L.control.transparency({ position: 'topleft' }).addTo(this.map);
    L.control.scale({ position: 'bottomleft' }).addTo(this.map);

    const basemaps = {
      'Bing Satellite': L.tileLayer.bing('AvSDmEuhbTKvL0ui4AlHwQNBVuDI2QBBoeODy1vwOz5sW_kDnBx3UMtUxbjsZ3bN').addTo(this.map),
      'Open Street Map': L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      }),
      'No Basemap': L.tileLayer(''),
    };

    const overlays = [
      {
        layer: 'norock:boundary',
        label: 'CCE Boundary',
        opacity: 1,
        visible: true,
      }, {
        layer: 'norock:basins_wct',
        label: 'Westslope Cutthroat Trout Basins',
        opacity: 1,
        visible: false,
      }, {
        layer: 'norock:lakes',
        label: 'Lakes',
        opacity: 1,
        visible: false,
      }, {
        layer: 'norock:streams',
        label: 'Streams',
        opacity: 1,
        visible: false,
      }, {
        layer: 'norock:streams_blt_sr',
        label: 'Bull Trout S/R Habitat',
        opacity: 1,
        visible: false,
      }, {
        layer: 'norock:valley',
        label: 'Valley Bottom',
        opacity: 1,
        visible: false,
      },
    ];
    const overlayLayers = {};
    overlays.forEach((d) => {
      const key = '<img src="http://ecosheds.org:8080/geoserver/wms?' +
        'REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png' +
        `&WIDTH=20&HEIGHT=20&LAYER=${d.layer}` +
        `&LEGEND_OPTIONS=fontAntiAliasing:true;forceLabels:off"> ${d.label}`;

      overlayLayers[key] = L.tileLayer.wms('http://ecosheds.org:8080/geoserver/wms', {
        layers: d.layer,
        format: 'image/png',
        transparent: true,
        opacity: d.opacity || 0.5,
        minZoom: d.minZoom || -Infinity,
        maxZoom: d.maxZoom || Infinity,
      });

      if (d.visible) overlayLayers[key].addTo(this.map);
    });

    L.control.layers(basemaps, overlayLayers, {
      position: 'topleft',
      collapsed: true,
    }).addTo(this.map);

    const svg = d3.select(this.map.getPanes().overlayPane).append('svg');
    const g = svg.append('g').attr('class', 'leaflet-zoom-hide');

    g.append('g').classed('fill', true);
    g.append('g').classed('aggregation-mouse', true);

    this.tooltip = d3.select(this.$el).append('div').attr('class', 'ice-map-tooltip hidden');

    let moveTimeout;
    this.map.on('movestart', () => {
      window.clearTimeout(moveTimeout);
      this.disableClick = true;
    });
    this.map.on('moveend', () => {
      // this.setView([map.getCenter().lat, map.getCenter().lng], map.getZoom());
      moveTimeout = setTimeout(() => {
        this.disableClick = false;
      }, 100);
    });
    this.map.on('zoomend', () => {
      // this.setView([map.getCenter().lat, map.getCenter().lng], map.getZoom());
      this.resizeSvg();
      this.render();
    });

    EventBus.$on('filter', this.renderFiltered);
    EventBus.$on('zoomToFeature', this.zoomToFeature);
  },
  computed: {
    path() {
      const vm = this;
      function projectPoint(x, y) {
        const point = vm.map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
      }
      const transform = d3.geo.transform({ point: projectPoint });
      const path = d3.geo.path().projection(transform);
      return path;
    },
    svg() {
      return d3.select(this.map.getPanes().overlayPane).select('svg');
    },
    min() {
      return this.variable ? this.variable.scale.min : 0;
    },
    max() {
      return this.variable ? this.variable.scale.max : 0;
    },
    colorScale() {
      let domain = [this.min, this.max];
      if (this.colors.length === 3) {
        domain = [this.min, (this.min + this.max) / 2, this.max];
      }

      return d3.scale.linear()
        .domain(domain)
        .range(this.colors)
        .interpolate(this.hcl ? d3.interpolateHcl : d3.interpolate);
    },
    ...mapGetters(['layer', 'variable', 'isFeatureFiltered']),
  },
  watch: {
    layer(layer) {
      if (!layer) return;

      this.resizeSvg();

      // clear existing features
      this.svg
        .select('g.fill')
        .selectAll('path.fill')
        .remove();

      this.render();
    },
    variable() {
      this.renderFill();
    },
    colors() {
      this.renderFill();
    },
    hcl() {
      this.renderFill();
    },
    selectedFeature() {
      this.renderSelected();
    },
  },
  methods: {
    zoomToFeature(feature) {
      if (!feature) return;

      const geoJson = L.geoJson(feature);
      this.map.fitBounds(geoJson.getBounds());
    },
    tooltipHtml(d) {
      const values = this.$store.getters.valuesById(d.properties.id);
      if (!values) {
        return 'N/A';
      }

      const value = values[this.variable.id];
      const label = values.label;
      const format = d3.format(this.variable.formats.text);
      const formattedValue = value === null ? 'N/A' : format(value);

      return `<span>Patch: ${label} (${d.properties.id})</span><br><span>${this.variable.label} = ${formattedValue}</span>`;
    },
    resizeSvg() {
      if (!this.layer) return;

      const svg = d3.select(this.map.getPanes().overlayPane).select('svg');
      const bounds = this.path.bounds(this.layer);
      const topLeft = bounds[0];
      const bottomRight = bounds[1];

      svg.attr('width', bottomRight[0] - topLeft[0])
        .attr('height', bottomRight[1] - topLeft[1])
        .style('left', `${topLeft[0]}px`)
        .style('top', `${topLeft[1]}px`);

      svg.select('g').attr('transform', `translate(${-topLeft[0]},${-topLeft[1]})`);
    },
    render() {
      if (!this.layer) return;

      const vm = this;
      const features = this.layer.features;

      // bottom layer that only shows the color of each feature
      const paths = this.svg
        .select('g.fill')
        .selectAll('path.fill')
        .data(features, d => d.properties.id);

      paths.enter()
        .append('path')
        .classed('fill', true)
        .style('cursor', 'pointer')
        .style('pointer-events', 'visible');

      paths.attr('d', this.path)
        .on('mousemove', function mousemove(d) {
          const mouse = d3.mouse(vm.$el).map(p => parseInt(p, 10));

          d3.select(this)
            .style('stroke', 'red');

          d3.select(vm.$el)
            .select('.ice-map-tooltip')
            .classed('hidden', false)
            .attr('style', `left:${(mouse[0] + 25)}px;top:${(mouse[1] - 25)}px`)
            .html(() => vm.tooltipHtml(d));
        })
        .on('mouseout', function mouseout() {
          d3.select(this)
            .style('stroke', null);
          d3.select(vm.$el)
            .select('.ice-map-tooltip')
            .classed('hidden', true);
        })
        .on('click', (d) => {
          if (this.disableClick) return;

          if (this.selectedFeature === d) {
            this.$emit('selectFeature');
          } else {
            this.$emit('selectFeature', d);
          }
        });

      paths.exit().remove();

      this.renderFiltered();
      this.renderFill();
      this.renderSelected();
    },
    renderFiltered() {
      this.svg
        .select('g.fill')
        .selectAll('path.fill')
        .style('display', d => (this.isFeatureFiltered(d.properties.id) ? 'inline' : 'none'));
    },
    renderFill() {
      this.svg
        .select('g.fill')
        .selectAll('path.fill')
        .style('fill', (d) => {
          const values = this.$store.getters.valuesById(d.properties.id);
          if (!values) return;

          const value = values[this.variable.id];
          return value === null ? '#eee' : this.colorScale(value); // eslint-disable-line consistent-return
        });
    },
    renderSelected() {
      this.svg
        .select('g.fill')
        .selectAll('path.fill')
        .classed('selected', d => this.selectedFeature && this.selectedFeature === d);
    },
  },
};
</script>

<style>
.ice-map {
  width: 100%;
  height: 100vh;
}

path.fill {
  fill: rgb(200,200,200);
  stroke: rgb(0, 0, 0);
  stroke-width: 0.5;
}

path.fill.selected {
  stroke: red;
}

div.leaflet-top.leaflet-left {
  margin-left: 450px;
  margin-top: 60px;
}

.leaflet-touch .leaflet-control-layers-toggle {
  width: 30px !important;
  height: 30px !important;
}

.ice-map.leaflet-container {
  background-color: white;
}

.ice-map-control-transparency {
  width: 34px;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 5px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 5px rgba(0,0,0,0.4);
}

.ice-map-control-transparency-slider {
  height: 100px;
  display: inline-block;
}

.ice-map-tooltip {
  position: absolute;
  padding: .5em;
  color: #222;
  background: #fff;
  text-shadow: #f5f5f5 0 1px 0;
  border-radius: 2px;
  box-shadow: 0px 0px 2px 2px #a6a6a6;
  opacity: 0.9;
  z-index: 3000;
}
</style>

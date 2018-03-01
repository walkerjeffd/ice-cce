<template>
  <div class="ice-map">
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as d3 from 'd3';
import leaflet from 'leaflet/dist/leaflet';
import 'leaflet/dist/leaflet.css';

import colorScaleMixin from '../mixins/colorScale';

const L = leaflet;

export default {
  mixins: [colorScaleMixin],
  props: ['options'],
  data() {
    return {
      map: null,
    };
  },
  mounted() {
    this.map = L.map(this.$el, {
      ...this.options,
    });

    L.control.scale({ position: 'bottomleft' }).addTo(this.map);

    const basemap = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    });
    basemap.addTo(this.map);

    const svg = d3.select(this.map.getPanes().overlayPane).append('svg');
    const g = svg.append('g').attr('class', 'leaflet-zoom-hide');

    g.append('g').classed('fill', true);
    g.append('g').classed('aggregation-mouse', true);

    // // tooltip
    // this.tooltip = d3.select(this.$el).append('div').attr('class', 'ice-map-tooltip hidden');

    // let moveTimeout;
    // map.on('movestart', () => {
    //   window.clearTimeout(moveTimeout);
    //   this.disableClick = true;
    // });
    // map.on('moveend', () => {
    //   // this.setView([map.getCenter().lat, map.getCenter().lng], map.getZoom());
    //   moveTimeout = setTimeout(() => {
    //     this.disableClick = false;
    //   }, 100);
    // });
    this.map.on('zoomend', () => {
      // this.setView([map.getCenter().lat, map.getCenter().lng], map.getZoom());
      this.resizeSvg();
      this.render();
    });
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
    ...mapGetters(['layer', 'variable']),
  },
  watch: {
    layer(layer) {
      if (!layer) return;

      this.resizeSvg();
      const svg = d3.select(this.map.getPanes().overlayPane).select('svg');

      // clear existing features
      svg.select('g.fill')
        .selectAll('path.fill')
        .remove();

      this.render();
    },
    variable() {
      this.renderFill();
    },
  },
  methods: {
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

      const svg = d3.select(this.map.getPanes().overlayPane).select('svg');
      const features = this.layer.features;

      // bottom layer that only shows the color of each feature
      const fillPaths = svg.select('g.fill')
        .selectAll('path.fill')
        .data(features, d => d.properties.id);

      fillPaths.enter()
        .append('path')
        .classed('fill', true)
        .style('cursor', 'pointer')
        .style('pointer-events', 'visible');

      fillPaths.attr('d', this.path)
        .on('mousemove', function mousemove() {
          d3.select(this)
            .style('stroke', 'red');
        })
        .on('mouseout', function mouseout() {
          d3.select(this)
            .style('stroke', null);
        });

      fillPaths.exit().remove();

      this.renderFill();
    },
    renderFill() {
      const svg = d3.select(this.map.getPanes().overlayPane).select('svg');
      svg.select('g.fill')
        .selectAll('path.fill')
        .style('fill', (d) => {
          const values = this.$store.getters.valuesById(d.properties.id);
          if (!values) return;

          const value = values[this.variable.id];
          return value === null ? '#eee' : this.colorScale(value); // eslint-disable-line consistent-return
        });
    },
  },
};
</script>

<style>
  .ice-map {
    width: 100%;
    height: 600px;
  }

  path.fill {
    fill: rgb(200,200,200);
    stroke: rgb(0, 0, 0);
    stroke-width: 0.5;
  }

</style>

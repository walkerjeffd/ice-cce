<template>
  <div class="ice-legend" v-show="variable">
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as d3 from 'd3';

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      default: 400,
      required: true,
    },
    height: {
      type: Number,
      default: 20,
      required: false,
    },
    margins: {
      type: Object,
      default() {
        return {
          left: 20,
          right: 20,
        };
      },
      required: false,
    },
    type: {
      type: String,
      required: 'true',
    },
    nBins: {
      type: Number,
      default: 5,
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
    ticks: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    ...mapGetters(['data', 'variable']),
    formatter() {
      return d3.format(this.variable ? this.variable.formats.text : ',.1f');
    },
    min() {
      // return this.variable ? this.variable.scale.min : 0;
      return d3.min(this.data.map(d => d[this.variable.id]));
    },
    max() {
      // return this.variable ? this.variable.scale.max : 0;
      return d3.max(this.data.map(d => d[this.variable.id]));
    },
    interpColors() {
      const domain = d3.range(0, 1, 1 / (this.colors.length - 1));
      domain.push(1);

      return d3.scale.linear()
        .domain(domain)
        .range(this.colors)
        .interpolate(this.hcl ? d3.interpolateHcl : d3.interpolate);
    },
    colorBins() {
      const values = [...d3.range(0, 1, 1 / (this.nBins - 1)), 1];
      return values.map(this.interpColors);
    },
    domain() {
      if (this.variable) {
        return this.data.map(d => d[this.variable.id]);
      }
      return [0, 1];
    },
    quantileScale() {
      return d3.scale.quantile()
        .domain(this.domain)
        .range(this.colorBins);
    },
    quantiles() {
      const quantiles = [this.min, ...this.quantileScale.quantiles(), this.max];
      return quantiles;
    },
  },
  mounted() {
    const svg = d3.select(this.$el).append('svg')
      .attr('width', this.width + this.margins.left + this.margins.right)
      .attr('height', this.height);

    if (this.ticks) {
      svg.append('g')
        .attr('class', 'legend-ticks');
      svg.append('g')
        .attr('class', 'legend-tick-labels');
    }

    this.render();
  },
  watch: {
    variable() {
      this.render();
    },
    colors() {
      this.render();
    },
    hcl() {
      this.render();
    },
    type() {
      this.render();
    },
  },
  methods: {
    render() {
      this.clear();

      switch (this.type) {
        case 'quantile':
          this.renderQuantile();
          break;
        case 'quantize':
          this.renderQuantize();
          break;
        case 'continuous':
          this.renderContinuous();
          break;
        default:
          this.renderQuantile();
      }
    },
    clear() {
      const svg = d3.select(this.$el).select('svg');

      svg.select('g.legend-ticks').selectAll('rect').remove();
      svg.select('g.legend-tick-labels').selectAll('text').remove();

      svg.select('defs').remove();

      svg.selectAll('rect').remove();
    },
    renderTicks(tickValues) {
      if (!this.ticks) return;

      const svg = d3.select(this.$el).select('svg');

      const gTicks = svg.select('g.legend-ticks');
      const gTickLabels = svg.select('g.legend-tick-labels');

      const ticks = gTicks.selectAll('rect')
        .data(tickValues);

      const tickOffset = this.width / (tickValues.length - 1);
      ticks.enter()
        .append('rect')
        .attr('width', 1)
        .attr('height', 5)
        .attr('x', (d, i) => this.margins.left + (tickOffset * i))
        .attr('y', this.ticks ? this.height - 20 : this.height)
        .style('fill', 'gray');

      gTickLabels.selectAll('text')
        .data(tickValues)
        .enter()
        .append('text')
        .attr('x', (d, i) => this.margins.left + (tickOffset * i))
        .attr('y', this.ticks ? this.height - 15 : this.height)
        .attr('dy', '1em')
        .attr('font-face', 'arial')
        .attr('font-size', '10')
        .attr('text-anchor', 'middle')
        .text(d => this.formatter(d));
    },
    renderQuantile() {
      const svg = d3.select(this.$el).select('svg');
      const rect = svg.selectAll('rect')
        .data(this.colorBins);

      const rectWidth = this.width / this.nBins;
      rect.enter()
        .append('rect')
        .attr('width', rectWidth)
        .attr('height', this.ticks ? this.height - 20 : this.height)
        .attr('x', (d, i) => this.margins.left + (i * rectWidth))
        .style('fill', d => d);

      svg.selectAll('rect')
        .data(this.colorBins)
        .style('fill', d => d);

      this.renderTicks(this.quantiles);
    },
    renderQuantize() {
      const svg = d3.select(this.$el).select('svg');
      const rect = svg.selectAll('rect')
        .data(this.colorBins);

      const rectWidth = this.width / this.nBins;
      rect.enter()
        .append('rect')
        .attr('width', rectWidth)
        .attr('height', this.ticks ? this.height - 20 : this.height)
        .attr('x', (d, i) => this.margins.left + (i * rectWidth))
        .style('fill', d => d);

      svg.selectAll('rect')
        .data(this.colorBins)
        .style('fill', d => d);

      const interval = (this.max - this.min) / this.nBins;
      this.renderTicks(d3.range(this.min, this.max + interval, interval));
    },
    renderContinuous() {
      const svg = d3.select(this.$el).select('svg');

      const defs = svg.append('defs');

      const linearGradient = defs.append('linearGradient')
        .attr('id', `linear-gradient-${this.id}`);

      linearGradient
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%');

      svg.append('rect')
        .attr('width', this.width)
        .attr('height', this.ticks ? this.height - 20 : this.height)
        .attr('x', this.margins.left)
        .style('fill', `url(#linear-gradient-${this.id}`);

      const offsets = d3.range(0, 1.1, 0.1);

      linearGradient.selectAll('stop')
        .data(offsets)
        .enter()
        .append('stop')
        .attr('offset', d => d)
        .attr('stop-color', d => this.interpColors(d));

      const interval = (this.max - this.min) / 4;
      this.renderTicks(d3.range(this.min, this.max + interval, interval));
    },
  },
};
</script>

<style>
.legend ul {
  list-style-type: none;
}

.legend .legend-item {
  width: 20%;
  text-align: center;
}

.legend .legend-item span {
  position: relative;
  top: 20px;
}
</style>

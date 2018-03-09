<template>
  <div class="ice-color-bar" v-show="variable"></div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as d3 from 'd3';

// http://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient.html
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
      default: 40,
      required: false,
    },
    ticks: {
      type: Boolean,
      default: false,
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
  computed: {
    ...mapGetters(['variable']),
    formatter() {
      return d3.format(this.variable ? this.variable.formats.text : ',.1f');
    },
    min() {
      return this.variable ? this.variable.scale.min : 0;
    },
    max() {
      return this.variable ? this.variable.scale.max : 0;
    },
    scale() {
      let domain = [this.min, this.max];
      if (this.colors.length === 3) {
        domain = [this.min, (this.min + this.max) / 2, this.max];
      }

      return d3.scale.linear()
        .domain(domain)
        .range(this.colors)
        .interpolate(this.hcl ? d3.interpolateHcl : d3.interpolate);
    },
  },
  mounted() {
    const svg = d3.select(this.$el).append('svg')
      .attr('width', this.width + this.margins.left + this.margins.right)
      .attr('height', this.height);

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
  },
  methods: {
    render() {
      if (!this.variable) return;

      const svg = d3.select(this.$el).select('svg');
      const linearGradient = svg.select('linearGradient');
      linearGradient.selectAll('stop').remove();

      const gTicks = svg.select('g.legend-ticks');
      const gTickLabels = svg.select('g.legend-tick-labels');

      if (this.ticks) {
        gTicks.selectAll('rect').remove();
        gTickLabels.selectAll('text').remove();
      }

      const domain = this.scale.domain();
      const xScale = d3.scale.linear()
        .domain([domain[0], domain[domain.length - 1]])
        .range([0, this.width]);

      const offsets = d3.range(0, 1.1, 0.1);

      linearGradient.selectAll('stop')
        .data(offsets)
        .enter()
        .append('stop')
        .attr('offset', d => d)
        .attr('stop-color', d => this.scale(domain[0] + ((domain[domain.length - 1] - domain[0]) * d)));

      if (this.ticks) {
        const interval = (this.max - this.min) / 4;
        const tickValues = d3.range(this.min, this.max + interval, interval);
        const ticks = gTicks.selectAll('rect')
          .data(tickValues);

        ticks.enter()
          .append('rect')
          .attr('width', 1)
          .attr('height', 5)
          .attr('y', this.ticks ? this.height - 20 : this.height)
          .style('fill', 'gray');

        ticks
          .attr('x', d => this.margins.left + (xScale(d) - 1));

        gTickLabels.selectAll('text')
          .data(tickValues)
          .enter()
          .append('text')
          .attr('x', d => this.margins.left + (xScale(d) - 1))
          .attr('y', this.ticks ? this.height - 15 : this.height)
          .attr('dy', '1em')
          .attr('font-face', 'arial')
          .attr('font-size', '10')
          .attr('text-anchor', 'middle')
          .text(d => this.formatter(d));
        // .text((d) => {
        //   const text = this.formatter(d);
        //   if (this.variable.clamp.right && i === tickValues.length - 1) {
        //     text = '>' + text;
        //   }
        //   if (this.variable.clamp.left && i === 0) {
        //     text = '<' + text;
        //   }
        //   return text;
        // });
      }
    },
  },
};
</script>

<style>
.ice-color-bar {
  display: inline-block;
}
</style>

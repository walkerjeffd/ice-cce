<template>
  <div class="ice-legend" v-show="variable"></div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as d3 from 'd3';

import colorScaleMixin from '../mixins/colorScale';

// http://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient.html
export default {
  mixins: [colorScaleMixin],
  data() {
    return {
      margins: {
        left: 20,
        right: 20,
      },
      width: 350,
    };
  },
  computed: {
    ...mapGetters(['variable']),
    formatter() {
      return d3.format(',.1f');
    },
  },
  mounted() {
    const svg = d3.select(this.$el).append('svg')
      .attr('width', this.width + this.margins.left + this.margins.right)
      .attr('height', 40);

    const defs = svg.append('defs');

    const linearGradient = defs.append('linearGradient')
      .attr('id', 'linear-gradient');

    linearGradient
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    svg.append('rect')
      .attr('width', this.width)
      .attr('height', 20)
      .attr('x', this.margins.left)
      .style('fill', 'url(#linear-gradient)');

    svg.append('g')
      .attr('class', 'legend-ticks');
    svg.append('g')
      .attr('class', 'legend-tick-labels');

    this.render();
  },
  watch: {
    variable() {
      this.render();
    },
    // colorScale () {
    //   this.render();
    // }
  },
  // computed: {
  //   formatter: function () {
  //     if (!this.variable) {
  //       return noop;
  //     }

  //     return d3.format(this.variable.format.axis);
  //   }
  // },
  methods: {
    render() {
      if (!this.variable) return;

      const svg = d3.select(this.$el).select('svg');
      const linearGradient = svg.select('linearGradient');
      const gTicks = svg.select('g.legend-ticks');
      const gTickLabels = svg.select('g.legend-tick-labels');

      linearGradient.selectAll('stop').remove();
      gTicks.selectAll('rect').remove();
      gTickLabels.selectAll('text').remove();

      const domain = this.colorScale.domain();
      const minValue = this.variable.scale.min;
      const maxValue = this.variable.scale.max;
      const interval = (maxValue - minValue) / 4;

      const tickValues = d3.range(minValue, maxValue + interval, interval);
      const xScale = d3.scale.linear().domain(domain).range([0, this.width]);

      const offsets = d3.range(0, 1.1, 0.1);

      linearGradient.selectAll('stop')
        .data(offsets)
        .enter()
        .append('stop')
        .attr('offset', d => d)
        .attr('stop-color', d => this.colorScale(domain[0] + ((domain[1] - domain[0]) * d)));

      const ticks = gTicks.selectAll('rect')
        .data(tickValues);

      ticks.enter()
        .append('rect')
        .attr('width', 1)
        .attr('height', 5)
        .attr('y', 20)
        .style('fill', 'gray');

      ticks
        .attr('x', d => this.margins.left + (xScale(d) - 1));

      gTickLabels.selectAll('text')
        .data(tickValues)
        .enter()
        .append('text')
        .attr('x', d => this.margins.left + (xScale(d) - 1))
        .attr('y', 25)
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
    },
  },
};
</script>

<style>
.ice-legend {
  height: 40px;
  width: 100%;
  margin-top: 10px;
}
.ice-legend ul {
  list-style-type: none;
  margin: 0;
}

.ice-legend .legend-item {
  width: 20%;
  height: 20px;
  text-align: center;
}

.ice-legend .legend-item span {
  position: relative;
  top: 20px;
}
</style>

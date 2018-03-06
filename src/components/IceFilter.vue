<template>
  <div class="ice-filter">
    <div class="title">
      <div class="pull-right"><button class="btn btn-xs" @click="destroy">×</button></div>
      <div>{{ filter.variable.label }}</div>
    </div>
    <div class="stats">
      <div style="display:inline;">
        Filter:
        <span v-if="filterRange">
          {{ filterRange[0] | textFormat(variable.formats.text) }} -
          {{ filterRange[1] | textFormat(variable.formats.text) }}
          <a href="#" @click.prevent="resetFilter">(reset)</a>
        </span>
        <span v-else>None</span>
      </div>
      <div style="display:inline;float:right;">
        Mean:
        <span v-if="meanValue">
          {{ meanValue | textFormat(variable.formats.text) }}
        </span>
        <span v-else>N/A</span>
      </div>
    </div>
    <div class="chart"></div>
  </div>
</template>

<script>
import * as d3 from 'd3';

import EventBus from '../event-bus';

function barChart() {
  if (!barChart.id) barChart.id = 0;

  const id = barChart.id++; // eslint-disable-line no-plusplus
  const axis = d3.svg.axis().orient('bottom');
  const brush = d3.svg.brush();
  let margin = { top: 10, right: 10, bottom: 20, left: 10 };
  let y = d3.scale.linear().range([100, 0]);
  let x;
  let brushDirty;
  let dimension;
  let group;
  let round;
  let meanValue = null;
  let onBrush = () => {};

  function chart(div) {
    const width = x.range()[1];
    const height = y.range()[0];

    y.domain([0, group.top(1)[0].value]);

    function barPath(groups) {
      const path = [];
      const n = groups.length;
      let i = -1;
      let d;
      while (++i < n) { // eslint-disable-line no-plusplus
        d = groups[i];
        path.push('M', x(d.key), ',', height, 'V', y(d.value), 'h9V', height);
      }
      return path.join('');
    }

    function resizePath(d) {
      const e = +(d === 'e');
      const x = e ? 1 : -1; // eslint-disable-line no-shadow
      const y = height / 3; // eslint-disable-line no-shadow

      // eslint-disable-next-line prefer-template
      return 'M' + (0.5 * x) + ',' + y
        + 'A6,6 0 0 ' + e + ' ' + (6.5 * x) + ',' + (y + 6)
        + 'V' + ((2 * y) - 6)
        + 'A6,6 0 0 ' + e + ' ' + (0.5 * x) + ',' + (2 * y)
        + 'Z'
        + 'M' + (2.5 * x) + ',' + (y + 8)
        + 'V' + ((2 * y) - 8)
        + 'M' + (4.5 * x) + ',' + (y + 8)
        + 'V' + ((2 * y) - 8);
    }

    div.each(function eachDiv() {
      const div = d3.select(this); // eslint-disable-line no-shadow
      let g = div.select('g');

      // Create the skeletal chart.
      if (g.empty()) {
        div.select('.title').append('a')
          .attr('href', `javascript:reset(${id})`)
          .attr('class', 'reset')
          .text('reset')
          .style('display', 'none');

        g = div.append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);

        g.append('clipPath')
          .attr('id', `clip-${id}`)
          .append('rect')
          .attr('width', width)
          .attr('height', height);

        g.selectAll('.bar')
          .data(['background', 'foreground'])
          .enter().append('path')
          .attr('class', d => `${d} bar`)
          .datum(group.all());

        g.selectAll('.foreground.bar')
          .attr('clip-path', `url(#clip-${id})`);

        g.append('g')
          .attr('class', 'axis')
          .attr('transform', `translate(0,${height})`)
          .call(axis);

        // Initialize the brush component with pretty resize handles.
        const gBrush = g.append('g').attr('class', 'brush').call(brush);
        gBrush.selectAll('rect').attr('height', height);
        gBrush.selectAll('.resize').append('path').attr('d', resizePath);
      }

      // Only redraw the brush if set externally.
      if (brushDirty) {
        brushDirty = false;
        g.selectAll('.brush').call(brush);
        div.select('.title a').style('display', brush.empty() ? 'none' : null);
        if (brush.empty()) {
          g.selectAll(`#clip-${id} rect`)
            .attr('x', 0)
            .attr('width', width);
        } else {
          const extent = brush.extent();
          g.selectAll(`#clip-${id} rect`)
            .attr('x', x(extent[0]))
            .attr('width', x(extent[1]) - x(extent[0]));
        }
      }

      g.selectAll('.bar').attr('d', barPath);

      if (meanValue != null) {
        const meanLine = g.selectAll('.mean')
          .data([meanValue]);
        meanLine.enter()
          .append('line')
          .attr('class', 'mean')
          .attr('y1', y.range()[0])
          .attr('y2', y.range()[1]);
        meanLine
          .style('display', null)
          .attr('x1', d => x(d))
          .attr('x2', d => x(d));
      } else {
        g.selectAll('.mean').style('display', 'none');
      }
    });
  }

  brush.on('brushstart.chart', function () {
    const div = d3.select(this.parentNode.parentNode.parentNode);
    div.select('.title a').style('display', null);
  });

  brush.on('brush.chart', function () {
    const g = d3.select(this.parentNode);
    let extent = brush.extent();

    if (round) {
      g.select('.brush')
        .call(brush.extent(extent = extent.map(round)))
        .selectAll('.resize')
        .style('display', null);
    }
    g.select(`#clip-${id} rect`)
      .attr('x', x(extent[0]))
      .attr('width', x(extent[1]) - x(extent[0]));
    dimension.filterRange(extent);
    onBrush(extent);
  });

  brush.on('brushend.chart', function () {
    if (brush.empty()) {
      const div = d3.select(this.parentNode.parentNode.parentNode);
      div.select('.title a').style('display', 'none');
      div.select(`#clip-${id} rect`).attr('x', null).attr('width', '100%');
      dimension.filterAll();
      onBrush(null);
    }
  });

  chart.margin = function (_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.x = function (_) {
    if (!arguments.length) return x;
    x = _;
    axis.scale(x);
    brush.x(x);
    return chart;
  };

  chart.y = function (_) {
    if (!arguments.length) return y;
    y = _;
    return chart;
  };

  chart.dimension = function (_) {
    if (!arguments.length) return dimension;
    dimension = _;
    return chart;
  };

  chart.filter = function (_) {
    if (_) {
      brush.extent(_);
      dimension.filterRange(_);
    } else {
      brush.clear();
      dimension.filterAll();
    }
    brushDirty = true;
    return chart;
  };

  chart.group = function (_) {
    if (!arguments.length) return group;
    group = _;
    return chart;
  };

  chart.round = function (_) {
    if (!arguments.length) return round;
    round = _;
    return chart;
  };

  chart.meanValue = function (_) {
    if (!arguments.length) return meanValue;
    meanValue = _;
    return chart;
  };

  chart.getExtent = () => brush.extent();

  chart.onBrush = function (_) {
    if (!arguments.length) return onBrush;
    onBrush = _;
    return chart;
  };

  return d3.rebind(chart, brush, 'on');
}

export default {
  props: ['filter', 'xf', 'width'],
  data() {
    return {
      chart: null,
      dim: null,
      group: null,
      filterRange: null,
      meanValue: null,
    };
  },
  computed: {
    variable() {
      if (!this.filter) {
        return null;
      }
      return this.filter.variable;
    },
  },
  filters: {
    textFormat: (value, format) => d3.format(format)(value),
  },
  mounted() {
    const interval = (this.variable.scale.max - this.variable.scale.min) / 40;

    this.dim = this.xf.dimension(d => d[this.filter.variable.id]);
    this.group = this.dim
      .group((d) => {
        if (d >= this.variable.scale.max) {
          return this.variable.scale.max - interval;
        } else if (d < this.variable.scale.min) {
          return this.variable.scale.min;
        }
        return Math.floor(d / interval) * interval;
      });

    const xScale = d3.scale.linear()
      .domain([this.filter.variable.scale.min, this.filter.variable.scale.max])
      .rangeRound([0, +this.width]);

    this.chart = barChart(this)
      .dimension(this.dim)
      .group(this.group)
      .x(xScale)
      .onBrush((extent) => {
        this.filterRange = extent;
        this.$emit('brush');
      });

    this.render();

    EventBus.$on('filter', this.render);
  },
  methods: {
    render() {
      this.meanValue = this.$store.getters.getFilteredVariableMeanValue(this.variable.id);
      d3.select(this.$el).select('.chart').call(this.chart.meanValue(this.meanValue));
    },
    resetFilter() {
      this.chart.filter();
      this.filterRange = null;
      this.$emit('brush');
    },
    destroy() {
      this.$emit('destroy', this.variable.id);
    },
  },
  destroyed() {
    EventBus.$off('filter', this.render);
    this.group.dispose();
    this.dim.filterAll().dispose();
    this.$emit('brush');
  },
};
</script>

<style>
.ice-filter-legend {
  margin-top:10px;
  margin-bottom:10px;
  padding-left:5px;
  padding-right:5px
}

.ice-filter {
  width: 400px;
  margin-bottom: 5px;
}

.ice-filter hr {
  margin-top: 10px;
  margin-bottom: 10px;
}

.ice-filter .title {
  font-weight: bold;
  font-size: 0.9em;
  min-height: 23px;
}

.ice-filter .stats {
  font-size: 0.9em;
}

.chart {
  display: inline-block;
  height: 130px;
  margin-bottom: 10px;
}

.reset {
  padding-left: 1em;
  font-size: smaller;
  color: #ccc;
}

.background.bar {
  fill: #ccc;
}

.foreground.bar {
  fill: steelblue;
}

.axis path, .axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.axis text {
  font: 10px sans-serif;
}

.brush rect.extent {
  fill: steelblue;
  fill-opacity: .125;
}

.brush .resize path {
  fill: #eee;
  stroke: #666;
}

line.mean {
  stroke: rgb(76, 174, 255);
  stroke-width: 2px;
}


</style>

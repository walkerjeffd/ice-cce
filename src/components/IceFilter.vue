<template>
  <div>
    {{ filter.variable.id }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// import * as d3 from 'd3';

// function barChart() {
//   if (!barChart.id) barChart.id = 0;
//   console.log('barchart: setup(%s)', barChart.id);

//   var margin = {
//         top: 10,
//         right: 20,
//         bottom: 20,
//         left: 10
//       },
//       width,
//       height,
//       svg,
//       div,
//       x,
//       y = d3.scale.linear().range([70, 0]),
//       id = barChart.id++,
//       axis = d3.svg.axis().orient("bottom"),
//       brush = d3.svg.brush(),
//       brushDirty,
//       gBrush,
//       xf,
//       dimension,
//       info,
//       group,
//       titleDiv,
//       statsDiv, meanDiv, extentDiv,
//       meanHucLine, selectCatchmentLine, hoverCatchmentLine,
//       selectHucGroups = [],
//       round;

//   function chart(_div) {
//     width = x.range()[1];
//     height = y.range()[0];

//     var groups = getGroups();

//     var yMax;
//     if (selectHucGroups.length > 0) {
//       yMax = d3.max([d3.max(groups, function(d) { return d.value; }),
//                      d3.max(selectHucGroups, function(d) { return d.value; })]);
//     } else {
//       yMax = d3.max(groups, function(d) { return d.value; });
//     }

//     // use yMax instead of top() to avoid null group, which remains in group.all()
//     y.domain([0, yMax]);

//     _div.each(function() {
//       div = _div;
//       g = div.select("g");

//       if (g.empty()) {
//         titleDiv = div.select(".title")
//           .html(info.label);

//         titleDiv.append("a")
//           .attr("class", "reset")
//           .text("reset")
//           .style("display", "none")
//           .on('click', function() {
//             chart.resetFilter();
//           });

//         titleDiv.append("div")
//           .attr("class", "btn btn-default btn-xs pull-right")
//           .html("&times;")
//           .on('click', function(d) {
//             xf.removeFilter(info.key);
//           });

//         statsDiv = div.append('div')
//           .attr("class", "stats");

//         extentDiv = statsDiv.append('span')
//           .attr("class", "extent")
//           .text(info.formatter(x.domain()[0]) + ' - ' + info.formatter(x.domain()[1]));

//         meanDiv = statsDiv.append('span')
//           .attr("class", "mean pull-right")
//           .text('Mean: ' + chart.getMean());

//         svg = div.append("svg")
//           .attr("width", width + margin.left + margin.right)
//           .attr("height", height + margin.top + margin.bottom);

//         g = svg.append("g")
//           .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//         g.append("clipPath")
//           .attr("id", "clip-" + id)
//           .append("rect")
//           .attr("width", width)
//           .attr("height", height);

//         g.selectAll(".bar")
//           .data(["background", "foreground"])
//           .enter().append("path")
//           .attr("class", function(d) {
//             return d + " bar";
//           })
//           .datum(groups);

//         g.selectAll(".foreground.bar")
//           .attr("clip-path", "url(#clip-" + id + ")");

//         g.append("g")
//           .attr("class", "axis")
//           .attr("transform", "translate(0," + height + ")")
//           .call(axis);

//         meanHucLine = g.selectAll(".mean")
//           .data([chart.getMean()])
//           .enter().append("line")
//           .attr("class", "mean")
//           .attr("y1", y.range()[0])
//           .attr("y2", y.range()[1]);

//         selectCatchmentLine = g.selectAll(".val")
//           .data([chart.getCatchmentValue(view.selected)])
//           .enter().append("line")
//           .attr("class", "val")
//           .attr("y1", y.range()[0])
//           .attr("y2", y.range()[1]);

//         hoverCatchmentLine = g.selectAll(".hover")
//           .data([chart.getCatchmentValue(view.hover)])
//           .enter().append("line")
//           .attr("class", "hover")
//           .attr("y1", y.range()[0])
//           .attr("y2", y.range()[1]);

//         g.selectAll(".bar2")
//           .data(["highlight"])
//           .enter().append("path")
//           .attr("class", function(d) {
//             return d + " bar2";
//           })
//           .datum([])
//           .style("opacity", 0);

//         gBrush = g.append("g").attr("class", "brush").call(brush);
//         gBrush.selectAll("rect").attr("height", height);
//         gBrush.selectAll(".resize").append("path").attr("d", resizePath);

//         div.append("hr");
//       }

//       if (brushDirty) {
//         brushDirty = false;
//         g.selectAll(".brush").call(brush);
//         div.select(".title a").style("display", brush.empty() ? "none" : null);
//         if (brush.empty()) {
//           g.selectAll("#clip-" + id + " rect")
//             .attr("x", 0)
//             .attr("width", width);
//         } else {
//           var extent = brush.extent();
//           g.selectAll("#clip-" + id + " rect")
//             .attr("x", x(extent[0]))
//             .attr("width", x(extent[1]) - x(extent[0]));
//         }
//       }

//       g.selectAll(".bar").attr("d", barPath);

//       renderMeanHucLine();
//       renderSelectHucBars();
//       chart.renderCatchmentLines();
//     });
//   }

//   function barPath(groups) {
//     var path = [],
//       i = -1,
//       n = groups.length,
//       d;
//     while (++i < n) {
//       d = groups[i];
//       path.push("M", x(d.key), ",", height, "V", y(d.value), "h9V", height);
//     }
//     return path.join("");
//   }

//   function resizePath(d) {
//     var e = +(d == "e"),
//       x = e ? 1 : -1,
//       y = height / 3;
//     return "M" + (0.5 * x) + "," + y + "A6,6 0 0 " + e + " " + (6.5 * x) +
//       "," + (y + 6) + "V" + (2 * y - 6) + "A6,6 0 0 " + e + " " + (0.5 * x) +
//       "," + (2 * y) + "Z" + "M" + (2.5 * x) + "," + (y + 8) + "V" + (2 * y - 8) +
//       "M" + (4.5 * x) + "," + (y + 8) + "V" + (2 * y - 8);
//   }

//   function getGroups() {
//     var groups = group.all();

//     // remove null group if it exists (has negative key)
//     if (groups[0].key < 0) {
//       groups = groups.slice(1, groups.length);
//     }

//     return groups;
//   }

//   function renderSelectHucBars() {
//     if (selectHucGroups.length > 0) {
//       var groupMax = d3.max(selectHucGroups, function(d) { return d.value; }),
//           yMax = y.domain()[1],
//           ratio = groupMax > 0 ? yMax/groupMax : 0;

//       // deep copy, rescaled
//       var groups = selectHucGroups.map(function (d) {
//         return {
//           key: d.key,
//           value: d.value*ratio
//         };
//       });

//       // add highlight bars
//       svg.select("path.highlight.bar2")
//         .datum(groups)
//         .attr("d", barPath);
//     }
//   }

//   function renderMeanHucLine() {
//     var mean = chart.getMean();

//     if (mean === null) {
//       meanDiv.text('Mean: ' + 'N/A');
//       meanHucLine.style('display', 'none');
//     } else {
//       meanDiv.text('Mean: ' + info.formatter(mean));
//       meanHucLine.data([mean])
//         .style('display', null)
//         .attr("x1", function(d) { return x(d); })
//         .attr("x2", function(d) { return x(d); });
//     }
//   }

//   function renderSelectCatchmentLine() {
//     var v = chart.getCatchmentValue(view.selected);

//     if(v === null){
//       selectCatchmentLine.style('display', 'none');
//     } else {
//       selectCatchmentLine.data([v])
//         .style('display', null)
//         .attr("x1", function(d) { return x(d); })
//         .attr("x2", function(d) { return x(d); });
//     }
//   }

//   function renderHoverCatchmentLine() {
//     var v = chart.getCatchmentValue(view.hover);

//     if (v === null) {
//       hoverCatchmentLine.style('display', 'none');
//     } else {
//       hoverCatchmentLine.data([v])
//         .style('display', null)
//         .attr("x1", function(d) { return x(d); })
//         .attr("x2", function(d) { return x(d); });
//     }
//   }

//   chart.renderCatchmentLines = function() {
//     renderSelectCatchmentLine();
//     renderHoverCatchmentLine();
//   };

//   chart.showSelectHucBars = function() {
//     // deep copy
//     selectHucGroups = getGroups().map(function (d) {
//       return {
//         key: d.key,
//         value: d.value
//       };
//     });

//     renderSelectHucBars();

//     svg.select("path.highlight.bar2")
//       .style('opacity', 0.5);
//   };

//   chart.removeSelectHucBars = function() {
//     selectHucGroups.length = 0;
//     svg.select("path.highlight.bar2")
//       .style("opacity", 0)
//       .datum([])
//       .attr("d", barPath);
//   };

//   brush.on("brushstart.chart", function() {
//     var div = d3.select(this.parentNode.parentNode.parentNode);
//     div.select(".title a").style("display", null);
//   });

//   brush.on("brush.chart", function() {
//     var g = d3.select(this.parentNode),
//       extent = brush.extent();

//     extentDiv.text(info.formatter(extent[0]) + ' - ' + info.formatter(extent[1]));
//     // meanDiv.text('Mean: ' + chart.getMean());
//     renderMeanHucLine();

//     g.select("#clip-" + id + " rect")
//       .attr("x", x(extent[0]))
//       .attr("width", x(extent[1]) - x(extent[0]));
//     dimension.filterRange(extent);
//   });

//   brush.on("brushend.chart", function() {
//     if (brush.empty()) {
//       div.select(".title a").style("display", "none");
//       div.select("#clip-" + id + " rect").attr("x", null).attr("width", "100%");
//       extentDiv.text(info.formatter(x.domain()[0]) + ' - ' + info.formatter(x.domain()[1]));
//       renderMeanHucLine();
//       dimension.filterAll();
//     } else {
//       // // snap brush to bars
//       // if (!d3.event.sourceEvent) return; // only transition after input
//       // var v = info;
//       // var extent0 = brush.extent(),
//       //     extent1 = extent0.map(function(d) {
//       //       return Math.round(d/v.interval) * v.interval;
//       //     });

//       // // if empty when rounded, use floor & ceil instead
//       // if (extent1[0] >= extent1[1]) {
//       //   extent1[0] = Math.floor(extent[0]/v.interval) * v.interval;
//       //   extent1[1] = Math.ceil(extent[0]/v.interval) * v.interval;
//       // }

//       // d3.select(this).transition()
//       //   .call(brush.extent(extent1))
//       //   .call(brush.event);
//     }
//   });

//   chart.resetFilter = function() {
//     if (!brush.empty()) {
//       gBrush.call(brush.clear());
//       gBrush.call(brush.event);
//     }
//   };

//   chart.getMean = function() {
//     // return d3.mean(dimension.top(Infinity), function(d) { return d[info.key]; });
//     var v = xf.getFeatureDim().group.value();

//     return v.counts[info.key] > 0 ? v.sums[info.key] / v.counts[info.key] : null;
//   };

//   chart.getCatchmentValue = function(target){
//     var stat = null;
//     if(target){
//       stat = xf.getFeatureDim().map.get(target);
//       if(stat[chart.info().key])
//         stat = stat[chart.info().key];
//       else {
//         stat = null;
//       }
//     }
//     return stat;
//   };

//   chart.margin = function(_) {
//     if (!arguments.length) return margin;
//     margin = _;
//     return chart;
//   };

//   chart.x = function(_) {
//     if (!arguments.length) return x;
//     x = _;
//     axis.scale(x);
//     brush.x(x);
//     return chart;
//   };

//   chart.y = function(_) {
//     if (!arguments.length) return y;
//     y = _;
//     return chart;
//   };

//   chart.xf = function(_) {
//     if (!arguments.length) return xf;
//     xf = _;
//     return chart;
//   };

//   chart.dimension = function(_) {
//     if (!arguments.length) return dimension;
//     dimension = _;
//     return chart;
//   };

//   chart.info = function(_){
//     if (!arguments.length) return info;
//     info = _;
//     axis.tickFormat(info.axis_formatter);
//     return chart;
//   };

//   chart.filter = function(_) {
//     if (_) {
//       brush.extent(_);
//       dimension.filterRange(_);
//     } else {
//       brush.clear();
//       dimension.filterAll();
//     }
//     brushDirty = true;
//     return chart;
//   };

//   chart.group = function(_) {
//     if (!arguments.length) return group;
//     group = _;
//     return chart;
//   };

//   chart.round = function(_) {
//     if (!arguments.length) return round;
//     round = _;
//     return chart;
//   };

//   return d3.rebind(chart, brush, "on");
// }

export default {
  props: ['filter'],
  data() {
    return {
      dim: null,
      group: null,
      minPercent: 0,
      maxPercent: 100,
    };
  },
  computed: {
    ...mapGetters(['xf']),
    variable() {
      if (!this.filter) {
        return null;
      }
      return this.filter.variable;
    },
  },
  created() {
    this.dim = this.xf.dimension(d => d[this.filter.variable.id]);

    const interval = (this.variable.scale.max - this.variable.scale.min) / 40;

    this.group = this.dim
      .group(d => (d >= this.variable.max ?
        this.variable.max - interval :
        Math.floor(d / interval) * interval));
  },
  methods: {
  },
};
</script>

<style>
</style>

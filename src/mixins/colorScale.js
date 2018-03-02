import * as d3 from 'd3';

export default {
  computed: {
    colorScale() {
      let domain = [0, 1];
      if (this.variable) {
        domain = [this.variable.scale.min, this.variable.scale.max];
      }
      return d3.scale.linear()
        .domain(domain)
        .range(['steelblue', 'orangered']);
    },
  },
};

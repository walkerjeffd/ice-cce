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

// Three color scale ----
// export default {
//   computed: {
//     colorScale() {
//       let domain = [0, 0.5, 1];
//       if (this.variable) {
//         domain = [
//           this.variable.scale.min,
//           (this.variable.scale.min + this.variable.scale.max) / 2,
//           this.variable.scale.max,
//         ];
//       }
//       return d3.scale.linear()
//         .domain(domain)
//         .range(['#6BB844', '#F7EB48', '#EF4545']);
//     },
//   },
// };

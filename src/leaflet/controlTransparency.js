import * as d3 from 'd3';
import '../../lib/jquery-ui-slider/jquery-ui.min.css';

require('../../lib/jquery-ui-slider/jquery-ui.min.js');

const L = require('leaflet');

L.Control.Transparency = L.Control.extend({
  onAdd(map) {
    const container = L.DomUtil.create('div', 'ice-map-control-transparency leaflet-bar');

    const slider = L.DomUtil.create('div', 'ice-map-control-transparency-slider', container);
    slider.style.height = '100px';

    $(slider).slider({
      orientation: 'vertical',
      range: 'max',
      value: 100,
      min: 0,
      max: 100,
      start() {
        map.dragging.disable();
      },
      slide(event, ui) {
        const opacity = (+ui.value) / 100;

        d3.select(map.getPanes().overlayPane)
          .select('svg')
          .attr('opacity', opacity);
      },
      stop() {
        map.dragging.enable();
      },
    });

    return container;
  },
});

L.control.transparency = function (opts) {
  return new L.Control.Transparency(opts);
};

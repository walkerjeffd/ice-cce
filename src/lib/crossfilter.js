import * as d3 from 'd3';
import crossfilter from 'crossfilter2';

export const xf = crossfilter();

export const map = new Map();

export const featureSet = new Set();

export function valuesById(id) {
  return map.get(id);
}

export function getFilteredVariableMeanValue(variableId) {
  return d3.mean(xf.allFiltered(), d => d[variableId]);
}

export function isFeatureFiltered(id) {
  return featureSet.has(id);
}

export default {
  themes: [
    {
      id: 'BLT',
      label: 'Bull Trout',
      layer: 'patch-blt.json',
      variables: [
        {
          id: 'stream_sr_km',
          label: 'length of streams with spawning/rearing habitat',
        }, {
          id: 'road_density',
          label: 'length of roads per unit area',
        },
      ],
    }, {
      id: 'WCT',
      label: 'Western Cutthroat Trout',
      layer: 'patch-wct.json',
      variables: [
        {
          id: 'st_avg_8_base',
          label: 'historical mean Aug stream temp (1985-2005)',
        }, {
          id: 'st_max_8_base',
          label: 'historical max Aug stream temp (1985-2005)',
        },
      ],
    },
  ],
  defaults: {
    theme: 'BLT',
    variable: 'stream_sr_km',
  },
};

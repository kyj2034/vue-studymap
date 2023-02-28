<template>
  <div>
    <label>
      Sea level
      <input id="level" type="range" min="0" max="100" value="1"/>
      +<span id="output"></span> m
    </label>
    <br>
    Go to
    <a class="location" data-center="-122.3267, 37.8377" data-zoom="11">San Francisco</a>,
    <a class="location" data-center="-73.9338, 40.5851" data-zoom="11">New Tork</a>,
    <a class="location" data-center="72.9481, 18.9929" data-zoom="11">Mumbai</a>, or
    <a class="location" data-center="120.831, 31.160" data-zoom="9">Shanhai</a>
  </div>
</template>

<script>
import TileLayer from 'ol/layer/Tile'

export default{
  data() {
      return{
        elevation : ['+', -10000,[ '*', 0.1 * 255, [ '+', [ '*', 256 * 256, [ 'band', 1 ]],
                                                          [ '+', ['*', 256, [ 'band', 2]], ['band', 3]],
                                                    ],
                                  ],
                    ],
    }
  },
  methods : {
    seaLevel() {
      const layer = new TileLayer({
        opacity: 0.6,
        source: new XYZ({
          url:
            'https://api.maptiler.com/tiles/terrain-rgb/{z}/{x}/{y}.png?key=' + key,
          tileSize: 512,
          maxZoom: 12,
        }),
        style: {
          variables: {
            level: 0,
          },
          color: [
            'case',
            ['<=', this.elevation, ['var', 'level']],
            [139, 212, 255, 1],
            [139, 212, 255, 0],
          ],
        },
      });
    }
  }
}

</script>

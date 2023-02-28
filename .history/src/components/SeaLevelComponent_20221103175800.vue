<template>
  <div id="layout">
    <div id="seaMap" class="map"></div>
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
import Map from 'ol/Map';
import TileLayer from 'ol/layer/WebGLTile';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import {fromLonLat} from 'ol/proj';

export default{
  data() {
      return{
        elevation : ['+',
                      -10000,
                      [ 
                      '*', 
                      0.1 * 255, 
                        [ 
                          '+', 
                          [ '*', 256 * 256, [ 'band', 1 ]],
                          [ '+', ['*', 256, [ 'band', 2]], ['band', 3]],
                        ],
                      ],
                    ],
        seaMap : null, 
      }
  },

  mounted() {
    this.seaLevel();
  },
  methods : {
    seaLevel() {
      const key = 'Xwmh9S7EsPlt8nogkgue';
      const attributions =
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
        '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

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
      
      this.seaMap = new Map({
        target: 'seaMap',
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=' + key,
              attributions: attributions,
              tileSize: 512,
              maxZoom: 22,
            }),
          }),
          layer,
        ],
        view: new View({
          center: fromLonLat([-122.3267, 37.8377]),
          zoom: 11,
        }),
      });

      const control = document.getElementById('level');
      const output = document.getElementById('output');

      // @input 사용 
      control.addEventListener('input', function () {
        output.innerText = control.value;
        layer.updateStyleVariables({level: parseFloat(control.value)});
      });
      output.innerText = control.value;

      const locations = document.getElementsByClassName('location');
      for ( let i = 0, ii = locations.length; i < ii; ++i) {
        locations[i].addEventListener('click', this.relocate);
      }
    
    },
    relocate(evt) {
      const data = evt.target.dataset;
      const view = this.seaMap.getView();
      view.setCenter(fromLonLat(data.center.split(',').map(Number)));
      view.setZoom(Number(data.zoom));
    }
  }
}

</script>

<style scoped>
      .map {
        width: 100%;
        height: 400px;
      }
      #level {
        display: inline-block;
        width: 150px;
        vertical-align: text-bottom;
      }

      a.location {
        cursor: pointer;
        color: skyblue;
      }

      #layout {
        background: #8bd4ff;
        position: relative;
        right: 1150px;
        top: 500px;
        width: 400px; 
        height: 400px;    
      }
</style>

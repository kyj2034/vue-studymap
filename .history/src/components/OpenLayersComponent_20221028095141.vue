<template>
  <div id="opmap" >
    <div id="popup">
      <div id="popup-content"></div>
    </div>
  </div>
</template>

<script>
import Feature from 'ol/Feature';
import {Map, View} from 'ol';
import Point from 'ol/geom/Point';
import TileJSON from 'ol/source/TileJSON';
import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';
import {Icon, Style} from 'ol/style';
import {Modify} from 'ol/interaction';
import 'ol/ol.css';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';

export default {
  name: 'MainMap',
  data() {
    return {
      olMap: undefined,
    }
  },
  mounted() {
    this.addMarker();
  },
  methods:{
    addMarker(){

      const iconFeature = new Feature({
        geometry: new Point([0,0]),
        name: 'Null Island',
        population: 4000,
        rainfall:500,
      });

      const iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          scale: 1.2,
          src: 'http://map.vworld.kr/images/ol3/marker_blue.png', 
        }),
        zindex: 10
      });

      iconFeature.setStyle(iconStyle);

      const vectorSource = new VectorSource({
        features: [iconFeature],
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      const rasterLayer = new TileLayer({
        source: new TileJSON({
          url: 'https://a.tiles.mapbox.com/v3/aj.1x1-degrees.json?secure=1',
          crossOrigin: '',
        }),
      });

      const target = document.getElementById('opmap');
      this.olMap = new Map({
        layers: [rasterLayer, vectorLayer],
        target: target,
        view: new View({
          center: [0, 0],
          zoom: 3,
        }),
      });

      const modify = new Modify({
        hitDetection: vectorLayer,
        source: vectorSource,
      });

      modify.on(['modifystart', 'modifyend'], function (evt) {
        target.style.cursor = evt.type === 'modifystart' ? 'grabbing' : 'pointer';
      });
      
      const overlaySource = modify.getOverlay().getSource();
      overlaySource.on(['addfeature', 'removefeature'], function (evt) {
        target.style.cursor = evt.type === 'addfeature' ? 'pointer' : '';
      });

      this.olMap.addInteraction(modify);
    },
  }
}

</script>

<style scope>
#opmap {
  position: relative;
  right: 1200px;
  top: 500px;
  width: 400px;
  height: 400px;
}
</style>

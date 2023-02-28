<template>
  <!-- html 안에 Map이 보여질 div 요소를 생성해주고 id 설정 -->
  <div id="opmap" >
    <!-- 지도 위에 팝업이 나타날 부분 -->
    <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content">
      </div>
    </div>
  </div>
</template>

<script>
import Feature from 'ol/Feature';
import {Map, View, Overlay} from 'ol';
import Point from 'ol/geom/Point';
// import TileJSON from 'ol/source/TileJSON';
import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import {Icon, Style} from 'ol/style';
import {Modify} from 'ol/interaction';
import 'ol/ol.css';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import {toLonLat} from 'ol/proj';
import {toStringHDMS} from 'ol/coordinate';

export default {
  name: 'MainMap',
  data() {
    return {
      olMap: undefined,
      overlay: null,
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

      /**
       *  popup 위한 . . .
       */
        const key = 'Get your own API key at https://www.maptiler.com/cloud/';
        const attributions =
          '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
          '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';


      const rasterLayer = new TileLayer({
        source: new XYZ({
          attributions,
          url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=' + key,
          tileSize: 512,
        }),
      });

      const target = document.getElementById('opmap');
      this.olMap = new Map({
        layers: [rasterLayer, vectorLayer],
        overlays: [this.overlay],
        target: target,
        view: new View({
          center: [0, 0],
          zoom: 3,
        }),
      });

      this.addPopUp();

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
    addPopUp(){
      
      /**
       *  팝업 만들기 위한 엘리먼트
       */
      const container = document.getElementById('popup');
      const content = document.getElementById('popup-content');
      const closer = document.getElementById('popup-closer');


      /**
       *  지도에 팝업을 띄우기 위한오버레이 생성
       */
      this.overlay = new Overlay({
        element: container,
        autoPan: {
          Animation: {
            duration: 250,
          }
        }
      });

      /**
       * 
       */
      closer.onclick = function () {
        this.overlay.setPosition(undefined);
        closer.blur();
        return false;
      };
      
      this.olMap.on('click', (evt) => {
        const coordinate = evt.coordinate;
        const hdms = toStringHDMS(toLonLat(coordinate));

        content.innerHTML = '<p>You Clicked here:</p><code>' + hdms + '</code>';
        this.overlay.setPosition(coordinate);
      });

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

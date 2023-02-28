<template>
  <!-- html 안에 Map이 보여질 div 요소를 생성해주고 id 설정 -->
  <div id="opmap" >
    <!-- 지도 위에 팝업이 나타날 부분 -->
    <div id="popup">
      <div id="popup-content">
      </div>
    </div>
  </div>
</template>

<script>
import Feature from 'ol/Feature';
import {Map, View, Overlay} from 'ol';
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
    makePopup( ) {
      let container = document.getElementById('popup');
      let content1 = document.getElementById('popup-content');
      
      let mapOvelay = new Overlay(({ element: container})); //Overay 생성, 요소는 컨테이너
      let hover = null; //마우스 이벤트에 사용될 변수

      this.olMap.on('pointermove', function(evt){ //마우스 올렸을 때
        let coordinate = evt.coordinate; // 마우스가 올려진 좌표값

        //마커가 있는 곳에 마우스가 올려지면 커서의 스타일을 pointer로 설정
        this.olMap.getTargetElement().style.cursor = this.olMap.hasFeatureAtPixel(evt.pixel)? 'pointer':'';

        // 마우스를 다른 곳으로 옮길 때를 위해 스위치
        if(hover != null) {
          hover = null;
        }

        // 마우스가 올려진 곳의 마커를 가져와 hover에 저장
        Map.forEachFeatureAtPixel(evt.pixel, function(f){
          hover = f;
          return true;
        });

        // 마커가 있을 경우
        if(hover) {
          var content =
          "<div class='__float-tbl'"
          + "여기는 어딜까?"
          + hover.get('name') // 이름 값 뽑기
          + "</div>";
    
        //popup-content 부분에 content를 넣어줌
        content1.innerHTML = content;

        //오버레이의 좌표를 정해줌
        mapOvelay.setPosition(coordinate);
        } else {
          content1.innerHTML='';
        }
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

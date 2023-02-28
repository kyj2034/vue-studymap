<template>
  <div>
    <div id="map"></div>
    <button @click="makeMarker">makeMarker</button>
    <button @click="delMarker">delMarker</button>
    <button @click="useEffect"> useEffect</button>
    <button @click="imageMarkCstOveray"> imageMarkCstOveray</button>
  </div>
</template>

<script>
import emd from '../../src/assets/data/emd.json';

export default {

  data() {
    return {
      container: null,  // 지도가 들어갈 위치
      infowindow: null, //
      aceessToken: '',
      data: null,
      marker: null,
    };
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement('script');
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);

      /**
       *  v3 스크립트를 동적으로 로드하기 위해서  script.src(v3 로딩 스크립트 주소) 에 &autoload=false 를 지정해주어야 한다.
       *  */
      script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=8fc19945dc1d57788954dab6a661466b&autoload=false';
      document.head.appendChild(script);

      // 통계지리정보서비스 API 어세스토큰 생성하는 메소드
      // this.getAccessToken();
    }
  },
  methods: {
    initMap() {
      this.container = document.getElementById('map');
      const options = {
        center: new kakao.maps.LatLng(37.37768859034813, 127.11372691736119),
        level: 3,
      };

      this.map = new kakao.maps.Map(this.container, options);
    },
    makeMarker() {
      this.initMap();
      const markerPosition = new kakao.maps.LatLng(37.37768859034813, 127.11372691736119);

      this.marker = new kakao.maps.Marker({
        position: markerPosition,
      });
      this.marker.setMap(this.map);
    },
    delMarker() {
      if (this.marker !== null) {
        this.marker.setMap(null);
      }
    },

    // 통계지리정보 서비스 좌표가 카카오에서 사용하는 좌표와 달라서 사용 불가능
    //
    // async getAccessToken(){
    //     const tokenRes = await axios.instance({
    //       method: 'GET',
    //       url: 'https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json',
    //       params: {
    //         consumer_key : '6b7a9600d0ff4046aaea',
    //         consumer_secret: '2d778e77f2d24eb0a00b',
    //       },
    //     });
    //     console.debug("tokenRes : ", tokenRes);
    //     this.aceessToken = tokenRes.data.result.accessToken;
    //     console.debug("accessToken", this.aceessToken);
    //     if( this.accessToken !== null){
    //       this.getBoundary();
    //     }
    // },
    // async getBoundary() {
    //     const boundRes = await axios.instance({
    //       method: 'GET',
    //       url: 'https://sgisapi.kostat.go.kr/OpenAPI3/boundary/hadmarea.geojson',
    //       params : {
    //         accessToken : this.aceessToken,
    //         year : '2021',
    //         adm_cd : '31023',
    //       }
    //     });
    //     console.debug("boundRes : ", boundRes.data.features);

    //     this.data = boundRes.data.features;
    //     const val = boundRes.data.features;

    //     val.forEach((ob) => {
    //       console.debug("adm_cd : " ,ob.properties.adm_cd);
    //       console.debug(ob.properties.adm_nm);

    //       ob.geometry.coordinates[0].forEach((crd) => {
    //         console.debug("coordinates[0] : "   ,crd[0]);
    //         console.debug("coordinates[1] : ", crd[1]);
    //       });
    //     });
    // },

    useEffect() {
      const data = emd.features;
      let crdList = []; // 좌표 지정 배열
      let regionName = ''; // 행정구 이름

      const polygons = []; // 지도에 그릴 도형을 담을 배열

      const mapOption = {
        center: new kakao.maps.LatLng(37.37768859034813, 127.11372691736119), // 지도의 중심좌표
        level: 9, // 지도의 확대 레벨
      };

      this.map = new kakao.maps.Map(this.container, mapOption); // mapOpthion 옵션을 가진 지도를 컨테이너에 추가
      const customOverlay = new kakao.maps.CustomOverlay({});  // 오버레이 추가
      const infowindow = new kakao.maps.InfoWindow({ removable: true });  

      const displayArea = (coordinates, name) => { // data 의 행정구역경계 (x,y)좌표값 배열과 행정구역이름배열을 받음.
        const path = [];
        const points = [];

        coordinates[0].forEach((coordinate) => {
          const point = {};
          point.x = coordinate[1];
          point.y = coordinate[0];
          points.push(point);
          path.push(new kakao.maps.LatLng(coordinate[1], coordinate[0]));
        });

        const polygon = new kakao.maps.Polygon({
          map: this.map,
          path, // 그려질 다각형의 좌표 배열이다.
          strokeWeight: 2, // 선의 두께이다.
          strokeColor: '#004c80', // 선의 색깔.
          strokeOpacity: 0.8, // 선의 불투명도, 1에서 0 사이의 값이며 0에 가까울수록 투명하다.
          strokeStyle: 'solid', // 선의 스타일.
          fillColor: '#FFF', // 채우기 색깔.
          fillOpacity: 0.7, // 채우기 불투명도.
        });

        polygons.push(polygon);

        // 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경한다.
        // 지역명을 표시하는 커스텀오버레이를 지도 위에 표시한다.
        kakao.maps.event.addListener(polygon, 'mouseover', function (mouseEvent) {
          polygon.setOptions({ fillColor: '#09f' });

          customOverlay.setContent(`<div class="area">${name}</div>`);

          customOverlay.setPosition(mouseEvent.LatLng);
          customOverlay.setMap(this.map);
        });

        // 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 커스텀 오버레이의 위치를 변경한다.
        kakao.maps.event.addListener(polygon, 'mousemove', (mouseEvent) => {
          customOverlay.setPosition(mouseEvent.latLng);
        });

        // 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경한다.
        kakao.maps.event.addListener(polygon, 'mouseout', () => {
          polygon.setOptions({ fillColor: '#fff' });
          customOverlay.setMap(null);
        });

        // 다각형에 click 이벤트를 등록하고 이벤트가 발생하면 다각형의 이름과 면적을 인포윈도우에 표시합니다
        kakao.maps.event.addListener(polygon, 'click', function (mouseEvent) {
          const content = `<div style="padding:2px;"><p><b>${name}</b></p></div>`;
          infowindow.setContent(content);
          infowindow.setPosition(mouseEvent.latLng);
          infowindow.setMap(this.map);
        });
      };

      data.forEach((val) => {
        crdList = val.geometry.coordinates;
        regionName = val.properties.EMD_KOR_NM;
        displayArea(crdList, regionName);
      });
    },
    imageMarkCstOveray() {
      const mapOption = {
        center: new kakao.maps.LatLng(37.54699, 127.09598), // 지도의 중심좌표
        level: 4, // 지도의 확대 레벨
      };

      this.map = new kakao.maps.Map(this.container, mapOption);

      const imageSrc = 'https://cdn-icons-png.flaticon.com/512/7345/7345830.png';
      const imageSize = new kakao.maps.Size(64, 69);
      const imageOption = { offset: new kakao.maps.Point(27, 69) };

      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
      const markerPosition = new kakao.maps.LatLng(37.54699, 127.09598); // 마커가 표시될 위치입니다.

      const marker = new kakao.maps.Marker({
        position: markerPosition,
        image: markerImage, // 마커이미지 설정
      });

      marker.setMap(this.map);

      const content = '<div class="customoverlay">'
        + ' <a href="https://map.kakao.com/link/map/11394059" target ="_blank"'
        + '   <span class="title">구의야구공원</span>'
        + ' </a>'
        + '</div>';

      const position = new kakao.maps.LatLng(37.54699, 127.09598);

      const customOverlay = new kakao.maps.CustomOverlay({
        map: this.map,
        position,
        content,
        yAnchor: 1,
      });

      customOverlay.setMap(this.map);
    },
  },
};

</script>

<style scoped>
  #map {
    width: 400px;
    height: 400px;
  }

  div {
    flex: 1;
  }
</style>

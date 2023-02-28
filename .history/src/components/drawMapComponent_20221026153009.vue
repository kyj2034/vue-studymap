<template>
  <div>
    <ol-map :loadTilesWhileAnimating="true" :loadTileWhileInteracting="true" style="height:200px; width: 200px;">
        <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom"
          :projection="projection"/>

        <ol-tile-layer>
          <ol-source-osm/>
        </ol-tile-layer>

        <ol-vector-layer>
        <ol-source-vector>
            <ol-feature>
                <ol-geom-line-string :coordinates="gimpoIA"></ol-geom-line-string>
                <ol-style>
                        <ol-style-stroke :color="strokeColor" :width="strokeWidth"></ol-style-stroke>          
                </ol-style>
            </ol-feature>

        </ol-source-vector>

        </ol-vector-layer>
    </ol-map>
  </div>
</template>

<script>
import hereIcon from '@/assets/markerimg.png'

import{ 
    ref
  } from 'vue'


  export default {
    data() {
      return {
        crntLoc : false,
        gimpoIA : [
          [
            126.77023487127133,
            37.5700390433573
          ],
          [
            126.78618703858336,
            37.55730442329754
          ],
          [
            126.78477811072008,
            37.55599781050684
          ],
          [
            126.79650678276795,
            37.5466444341957
          ],
          [
            126.79760553694871,
            37.547537367232835
          ],
          [
            126.80333467809555,
            37.54271064500391
          ],
          [
            126.80953543954189,
            37.54302619146384
          ],
          [
            126.81613079182972,
            37.54939170926832
          ],
          [
            126.80013267488721,
            37.56136442209366
          ],
          [
            126.79657944410513,
            37.56139085949269
          ],
          [
            126.7965583939025,
            37.56242713691276
          ],
          [
            126.80412050210441,
            37.56862282153695
          ],
          [
            126.80355151187717,
            37.57148137599468
          ],
          [
            126.80135957404184,
            37.573161391392475
          ],
          [
            126.79210000147242,
            37.565698895004616
          ],
          [
            126.79086599712775,
            37.56664477834116
          ],
          [
            126.78925597451877,
            37.5656210755658
          ],
          [
            126.77672623295166,
            37.575515904805755
          ],
          [
            126.77020756946803,
            37.570045933809
          ]
        ]
      }
    },
    setup() {
      const center = ref([40, 40])
      const projection = ref('EPSG:4326') // WGS84 타원체의 경위도 좌표계입니다. 흔히 GPS 등의 기본 좌표계입니다.
      const zoom = ref(8)
      const rotation = ref(0)
      const radius = ref(0)
      const strokeWidth = ref(10)
      const strokeColor = ref('blue')
      
      return {
        center, 
        projection,
        zoom, 
        rotation,
        radius,
        strokeWidth,
        strokeColor,
        hereIcon,
        view,
        map,
        geoLocChange
      }
    },
    methods : {
    }
  }

</script>

<style scoped>

  #div {
    flex: 2;
  }

</style>

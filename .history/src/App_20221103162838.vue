<template>
  <div id="app">
      <KakaoMap/>
      <CurrentRegionMap/>
      <DrawMap/>
      <OpenLayersMap/>
      <SeaMap/>
  </div>
</template>

<script>
import KakaoMap from './components/KakaoMapComponent.vue';
import CurrentRegionMap from './components/CurrentRegionComponent.vue';
import DrawMap from './components/DrawMapComponent.vue';
import OpenLayersMap from './components/OpenLayersComponent.vue';
import SeaMap from './components/SeaLevelComponent.vue';

export default {
  name: 'App',
  components: {
    KakaoMap,
    CurrentRegionMap,
    DrawMap,
    OpenLayersMap,
    SeaMap,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
} 
</style>

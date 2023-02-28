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

export default{
  data() {
      return{
        elevation : ['+', -10000,[ '*', 0.1 * 255, [ '+', [ '*', 256 * 256, [ 'band', 1 ]],
                                                          [ '+', ['*', 256, [ 'band', 2]], ['band', 3]],
                                                    ],
                                  ],
                    ],
    }
  }
}

</script>

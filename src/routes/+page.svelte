<script>
  import Range, {clamp, scale} from '$lib';
  let tx = $state(0);
  let ty = $state(0);
  let progress = $state(0);
  let py = $state(0);

  function onmove({left, top, width, height}) {
    progress = Number(clamp(left, 0, width-20)/(width-20)).toFixed(2);
    tx = left;
    ty = top;
  }
</script>
<br>
progress: [{progress}] tx: [{tx}] ty: [{ty}]
<br>

<Range {onmove} style="display: block">
  {#snippet thumb({left, top, height, width})}
    <div class="thumb" style="top: {top}px; left: {left}px"></div>
  {/snippet}
  {#snippet track()}
    <div class="track"></div>
  {/snippet}
</Range>

<style>
  .thumb {
    background-color: red;
    width: 20px;
    height: 20px;
    position: absolute;
    transform: translate(-50%, -50%);

  }

  .track {
    background-color: blue;
    /* width: 100px; */
    height: 300px;
    /* margin: 20px; */
  }
</style>
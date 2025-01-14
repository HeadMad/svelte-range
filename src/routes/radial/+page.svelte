<script>
  import {RadialColorPicker} from "$lib/comp";
  let color = $state('#f2d300');
</script>
<RadialColorPicker {color} onchange={({hex}) => color = hex}/>

{color}
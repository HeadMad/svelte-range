<script>
  import {scale} from "$lib";
  import coordinator from "$lib/actions/coordinator.svelte.js";
  // sqrt((х2-х1)^2+(y2-y1)^2)

  let t = $state('15px');
  let l = $state('50%');
  let angle = $state(0);
  let hue = $state(0);


  const handlers = {
    onaction({top, left, width, height}) {
      const sqrt = Math.sqrt((top - height / 2) ** 2 + (left - width / 2) ** 2);

      angle = Math.round(Math.atan2(left - width / 2, height / 2 - top) * 180 / Math.PI);

      hue = Math.round((angle + 180) / 6);

      const dist = Math.sqrt((150 - top) ** 2 + (150 - left) ** 2);

      const k = 135 / dist;
        l = (left - 150) * k + 150 + 'px';
        t = (top - 150) * k + 150 + 'px';

        return;

      if (dist < 150 && dist > 100) {
        t = top + 'px';
        l = left + 'px';

      } else if (dist > 150){
        const k = 150 / dist;
        l = (left - 150) * k + 150 + 'px';
        t = (top - 150) * k + 150 + 'px';

      } else {
        const k = 100 / dist;
        l = (left - 150) * k + 150 + 'px';
        t = (top - 150) * k + 150 + 'px';
      }
      
    }
  };
</script>

{angle} {hue}
<div use:coordinator={handlers} style="--angle: {angle}deg">
  <span style="top: {t}; left: {l}"></span>
</div>



<p style="background: hsl({angle}, 100%, 50%)">{angle} {hue}</p>


<style>
  div {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    position: relative;
    background-image: conic-gradient(
			red 0,
			#ff0 16.6%,
			#0f0 33.2%,
			#0ff 49.8%,
			#00f 66.4%,
			#f0f 83%,
			red
		);

    &::before {
      content: '';
      position: absolute;
      top: 30px;
      left: 30px;
      right: 30px;
      bottom: 30px;
      border-radius: 50%;
      background-color: #fff;
    }
  
    
  }

  span {
    position: absolute;
    width: 2px;
    height: 34px;
    border: 2px solid #fff;
		/* width: 10px;
		height: 10px;
		border: 2px solid #fff;
		border-radius: 50%; */
		transform: translate(-50%, -50%) rotate(var(--angle));
		box-shadow: 0 0 3px rgba(0, 0, 0, 0.6);
  }
</style>
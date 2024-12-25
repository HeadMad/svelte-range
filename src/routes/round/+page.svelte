<script>
  import { scale, clamp } from "$lib";
  import coordinator from "$lib/actions/coordinator.svelte.js";
  let size = 300;
  let half = size / 2;
  let outerRadius = size / 2;
  let innerRadius = outerRadius - size / 10;
  let slSize = Math.floor((innerRadius - 10) * 1.4);
  let hueOrbit = size / 10 / 2;

  let H = $state(0);
  let S = $state(100);
  let L = $state(50);

  let huePicker = $state({
    top: hueOrbit + "px",
    left: "50%",
  });

  let slPicker = $state({
    top: "50%",
    left: "50%",
    xmin: half - slSize/2,
    ymin: half - slSize/2,
    xmax: half + slSize/2,
    ymax: half + slSize/2,
  });

  let picker = null;
 
  const handlers = {
    onstart({ left, top }) {
      document.body.classList.add("unselectable");
      const dist = Math.sqrt((150 - top) ** 2 + (150 - left) ** 2);

      picker = dist < innerRadius ? slPicker : huePicker;
    },

    onend() {
      document.body.classList.remove("unselectable");
      picker = null;
    },
    onaction({ top, left, width, height }) {
      const dist = Math.sqrt((half - top) ** 2 + (half - left) ** 2);

      if (picker === slPicker) {
        const y = clamp(top, picker.ymin, picker.ymax);
        const x = clamp(left, picker.xmin, picker.xmax);
        const xL = scale(x, [picker.xmin, picker.xmax], [100, 50]);

        L = scale(y, [picker.ymin, picker.ymax], [xL, 0]);

        S = scale(x, [picker.xmin, picker.xmax], [0, 100]);
        picker.top = y + "px";
        picker.left = x + "px";
      }

      if (picker === huePicker) {
        H = Math.round(
          (Math.atan2(left - half, half - top) * 180) / Math.PI,
        );
        const k = (half - hueOrbit) / dist;
        picker.left = (left - half) * k + half + "px";
        picker.top = (top - half) * k + half + "px";
      }
    },
  };
</script>

<div
  class="body"
  use:coordinator={handlers}
  style="
  --angle: {H}deg;
  --sl-size: {slSize}px;
  --HUE: hsl({H}, 100%, 50%);
  --HSL: hsl({H}, {S}%, {L}%);
  "
>
  <svg
    width="100%"
    height="100%"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <mask id="circle">
        <rect width="100%" height="100%" fill="black" />
        <circle r="50%" cx="50%" cy="50%" fill="white" />
        <circle r="40%" cx="50%" cy="50%" fill="black" />
      </mask>
    </defs>
  </svg>

  <div id="circle"></div>
  <div class="sl"></div>
  <span class="hue-picker" style="top: {huePicker.top}; left: {huePicker.left}"
  ></span>
  <span class="sl-picker" style="top: {slPicker.top}; left: {slPicker.left}"
  ></span>
</div>

<p style="background: hsl({H}, {S}%, {L}%)">Hello</p>

<style>
  .sl {
    position: absolute;
    top: 50%;
    left: 50%;
    width: var(--sl-size);
    height: var(--sl-size);
    background-color: var(--HUE);
    background-image: linear-gradient(0deg, #000, rgba(204, 154, 129, 0)),
      linear-gradient(90deg, #fff, rgba(255, 255, 255, 0));
    /* box-shadow: 0 0 3px rgba(0, 0, 0, 0.6); */
    transform: translate(-50%, -50%);
  }

  svg {
    position: absolute;
  }

  #circle {
    width: 100%;
    height: 100%;
    mask: url(#circle);
    /* border-radius: 50%; */
    background-image: conic-gradient(
      red 0,
      #ff0 16.6%,
      #0f0 33.2%,
      #0ff 49.8%,
      #00f 66.4%,
      #f0f 83%,
      red
    );
  }
  .body {
    width: 300px;
    height: 300px;
    position: relative;
  }

  .hue-picker {
    position: absolute;
    width: 2px;
    height: 10%;
    border: 2px solid #fff;

    transform: translate(-50%, -50%) rotate(var(--angle));
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.6);
  }

  .sl-picker {
    position: absolute;
    width: 10px;
    height: 10px;
    border: 2px solid #fff;
    border-radius: 50%;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.6);
    transform: translate(-50%, -50%);
  }

  :global(.unselectable) {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>

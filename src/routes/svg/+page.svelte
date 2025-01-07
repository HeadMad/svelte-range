<script>
  import { scale, clamp } from "$lib";
  import coordinator from "$lib/actions/coordinator.svelte.js";

  
  let size = 300;
  const trackWidth = 18;
  const gap = 24;

  
  let  half = size / 2;
  
  const hueOrbit = trackWidth * 1.5 + gap;
  const hueRadius = half - hueOrbit;
  const hueArea = [half - trackWidth - gap, half - gap - trackWidth * 2];
  
  const sectOrbit = trackWidth / 2;
  const sectRadius = half - sectOrbit;
  const sectArea = [half, half - trackWidth];

  const darkArea = [];

  let outerRadius = size / 2;
  let innerRadius = outerRadius - size / 20;
  let slSize = Math.floor((innerRadius - 10) * 1.4);

  let H = $state(0);
  let S = $state(100);
  let L = $state(50);
  let A = $state(1);

  let huePicker = $state({
    ...getLeftTopFromAngle(0, hueRadius),
  });

  let darkPicker = $state({
    ...getLeftTopFromAngle(-150, sectRadius),
    from: -150,
    to: -30,
  });

  let lightPicker = $state({
    ...getLeftTopFromAngle(-30, sectRadius),
    from: -30,
    to: 90,
  });

  let alphaPicker = $state({
    ...getLeftTopFromAngle(0, sectRadius),
    from: 90,
    to: -150,
  });



  let activePicker = null;

  const handlers = {
    onstart({ left, top }) {
      document.body.classList.add("unselectable");
      const dist = Math.sqrt((150 - top) ** 2 + (150 - left) ** 2);


        if (dist > hueArea[1] && dist < hueArea[0])
          return activePicker = huePicker;

        if (dist > sectArea[1] && dist < sectArea[0]) {
          const angle = Math.round((Math.atan2(left - half, half - top) * 180) / Math.PI);
        }


    },

    onend() {
      document.body.classList.remove("unselectable");
      activePicker = null;
    },
    onaction({ top, left, width, height }) {
      const dist = Math.sqrt((half - top) ** 2 + (half - left) ** 2);


      if (activePicker === huePicker) {
        H = Math.round((Math.atan2(left - half, half - top) * 180) / Math.PI);
        const k = hueRadius / dist;
        activePicker.left = (left - half) * k + half;
        activePicker.top = (top - half) * k + half;
      }
    },
  };

  const hue = { r: 33, "stroke-width": 6, stroke: "white" };

  function getLeftTopFromAngle(angle, radius) {
    return {
      left: half + Math.cos(angle) * radius,
      top: half + Math.sin(angle) * radius,
    };
  }

  function createSect({
    radius = 50,
    progress = 31,
    width = 6,
    cap = "round",
  } = {}) {
    const L = radius * 2 * Math.PI;
    const len = (L / 100) * progress;
    return {
      r: radius - width / 2,
      stroke: "white",
      "stroke-width": width,
      "stroke-dasharray": len - width + "," + L,
      "stroke-linecap": cap,
    };
  }

  const sector = createSect();
</script>
{sectRadius}


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
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
  >
    {@render circle("hue", hue)}

    {@render circle("dark", sector, 120)}
    {@render circle("light", sector, 240)}
    {@render circle("alpha", sector, 0)}

    <circle cx="50" cy="50" r="20" fill="hsla({H}, {S}%, {L}%, {A})" />
  </svg>
  
  {@render picker("hue", huePicker)}
  {@render picker("dark", darkPicker)}
  {@render picker("light", lightPicker)}
  {@render picker("alpha", alphaPicker)}
</div>

{#snippet picker(name, {top, left})}
<div class="picker picker-{name}"
    style="top: {top}px; left: {left}px"
  ></div>
{/snippet}

{#snippet circle(name, props, angle = 0)}
  <g transform="rotate({angle}, 50, 50)">
    <mask id="mask-{name}">
      <circle cx="50%" cy="50%" {...props} />
    </mask>

    <foreignObject mask="url(#mask-{name})" width="100" height="100">
      <div class="track track-{name}"></div>
    </foreignObject>
  </g>
{/snippet}

<style>
  .body {
    position: relative;
    width: 300px;
    height: 300px;
    border: 1px solid #ccc;
  }

  .picker {
    position: absolute;
    width: 6%;
    height: 6%;
    border: 3px solid #fff;
    border-radius: 50%;
    background-color: var(--HUE);
    transform: translate(-50%, -50%);
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.6);
  }

  .track {
    width: 100%;
    height: 100%;
  }

  .track-hue {
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

  .track-dark,
  .track-light,
  .track-alpha::after {
    background-image: conic-gradient(
      from 86deg at 50% 50%,
      var(--from, #fff),
      var(--to, #666) 120deg,
      red 120deg
    );
  }

  .track-light {
    --from: var(--HUE);
    --to: #fff;
  }
  .track-dark {
    --from: #000;
    --to: var(--HSL);
  }

  .track-alpha {
    position: relative;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 2 2' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' fill='%230000001a'/%3E%3Crect x='1' y='1' width='1' height='1' fill='%230000001a'/%3E%3C/svg%3E");
    background-size: auto 4px;
  }

  .track-alpha::after {
    --from: transparent;
    --to: var(--HSL);
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
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

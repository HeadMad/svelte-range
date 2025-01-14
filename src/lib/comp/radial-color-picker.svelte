<script>
  import { scale, clamp, toRadians, hexToHsla, hslaToHex } from "../utils";
  import {coordinator} from "../actions";

  let {color = $bindable('#000000')} = $props();


  let size = 300;
  const trackWidth = 18;
  const gap = 24;

  let half = size / 2;

  const hueOrbit = trackWidth * 1.5 + gap;
  const hueRadius = half - hueOrbit;
  const hueArea = [half - trackWidth - gap, half - gap - trackWidth * 2];

  const sectOrbit = trackWidth / 2;
  const sectRadius = half - sectOrbit;
  const sectArea = [half, half - trackWidth];


  let H = $state(0);
  let S = $state(0);
  let L = $state(0);
  let A = $state(1);


  [H, S, L, A] = hexToHsla(color);


  $effect(() => {
    color = hslaToHex(H, S, L, A);
  });

  let huePicker = $state({
    angle: H,
    min: -180,
    max: 180,
    radius: hueRadius,
  });

  let lightPicker = $state({
    angle: scale(L, [0, 100], [-150, -39]),
    radius: sectRadius,
    min: -150,
    max: -39,
  });

  let satPicker = $state({
    angle: scale(S, [0, 100], [-30, 81]),
    radius: sectRadius,
    min: -30,
    max: 81,
  });

  let alphaPicker = $state({
    angle: scale(A, [0, 1], [90, 201]),
    radius: sectRadius,
    min: 90,
    max: 201
  });

  const pickerHandlers = new Map([
    [huePicker, ({angle}) => H = angle],
    [satPicker, ({angle, min, max}) => S = scale(angle, [min, max], [0, 100])],
    [lightPicker, ({angle, min, max}) => L = scale(angle, [min, max], [0, 100])],
    [alphaPicker, ({angle, min, max}) => A = scale(angle, [min, max], [0, 1])],
  ]);

  let activePicker = null;

  const handlers = {
    onstart({ left, top }) {
      document.body.classList.add("unselectable");
      const dist = Math.sqrt((150 - top) ** 2 + (150 - left) ** 2);

      if (dist > hueArea[1] && dist < hueArea[0])
        return (activePicker = huePicker);

      if (dist > sectArea[1] && dist < sectArea[0]) {
        const angle = Math.round(
          (Math.atan2(left - half, half - top) * 180) / Math.PI,
        );

        activePicker = [lightPicker, satPicker, alphaPicker].find(
          (picker) =>
            (picker.min < angle && angle < picker.max) ||
            (picker.max > 180 && (angle > picker.min || angle < picker.max)),
        );
      }
    },

    onend() {
      document.body.classList.remove("unselectable");
      activePicker = null;
    },
    onaction({ top, left, width, height }) {
      if (activePicker === null) return;

      const dist = Math.sqrt((half - top) ** 2 + (half - left) ** 2);

      let angle = Math.round(
        (Math.atan2(left - half, half - top) * 180) / Math.PI,
      );

      if (activePicker.max > 180) angle = (angle + 360) % 360;

      const deg = clamp(angle, activePicker.min, activePicker.max);
      activePicker.angle = deg;

      pickerHandlers.get(activePicker)(activePicker);
    },
  };


  function getLeftTopFromAngle(angle, radius) {
    const radians = toRadians(angle);
    return {
      top: half - Math.cos(radians) * radius,
      left: half + Math.sin(radians) * radius,
    };
  }

  function createSect({
    radius = 50,
    progress = 31,
    width = 6,
    cap = "butt",
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



<div
class="body"
use:coordinator={handlers}
style="
--HL: hsl({H}, 0%, 50%);
--HS: hsl({H}, {S}%, 50%);
--HUE: hsl({H}, 100%, 50%);
--HSL: hsl({H}, {S}%, {L}%);
--HSLA: hsl({H}, {S}%, {L}%, {A});
">

<svg
id="colorpicker"
width="100%"
    height="100%"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    >
    {@render mask("result")}
    {@render circle("result", {r: 20, fill: "white"})}
    {@render circle("hue", { r: 33, "stroke-width": 6, stroke: "white" })}
    
    {@render circle("light", sector, 120)}
    {@render circle("sat", sector, 240)}
    {@render mask("alpha")}
    {@render circle("alpha", sector, 0)}

  </svg>

  {@render picker("hue", huePicker)}
  {@render picker("light", lightPicker)}
  {@render picker("sat", satPicker)}
  {@render picker("alpha", alphaPicker)}
</div>

{#snippet mask(name)}
  <foreignObject mask="url(#mask-{name})" width="100" height="100">
    <div class="track transparent"></div>
  </foreignObject>
{/snippet}

{#snippet picker(name, { angle, radius })}
  {@const { left, top } = getLeftTopFromAngle(angle, radius)}
  <div class="picker picker-{name}" style="top: {top}px; left: {left}px"></div>
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

  svg {
    position: absolute;
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

  .picker-light {
    background-color: var(--HSL);
  }

  .picker-sat {
    background-color: var(--HS);
  }

  .picker-alpha {
    background-color: var(--HSLA);
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

  .track-light,
  .track-sat,
  .track-alpha {
    background-image: conic-gradient(
      from 90deg at 50% 50%,
      var(--from, #fff),
      var(--to, #000) 112deg,
      transparent 112deg
    );
  }

  .track-light {
    background-image: conic-gradient(
      from 90deg at 50% 50%,
      #000,
      var(--HS) 56deg,
      #fff 112deg,
      transparent 112deg
    );
  }

  .track-sat {
    --from: var(--HL);
    --to: var(--HUE);
  }

  .track.transparent {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 2 2' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' fill='%230000001a'/%3E%3Crect x='1' y='1' width='1' height='1' fill='%230000001a'/%3E%3C/svg%3E");
    background-size: auto 4px;
  }

  .track-alpha {
    --from: transparent;
    --to: var(--HSL);
  }

  .track-result {
    background-color: var(--HSLA);
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

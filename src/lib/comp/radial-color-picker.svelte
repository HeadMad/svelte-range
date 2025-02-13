<script>
  import { scale, clamp, toRadians, hexToHsla, hslaToHex, hslaToRgba } from "../utils";
  import {coordinator} from "../actions";

  let {
    color = "#ff0000",
    onchange = () => {},
    size = 300,
  } = $props();

  const trackWidth = 6;
  const trackGap = 8;

  const pxWidth = trackWidth*size/100;
  const pxGap = trackGap*size/100;

  let half = size / 2;

  const hueOrbit = pxWidth * 1.5 + pxGap;
  const hueRadius = half - hueOrbit;
  const hueArea = [half - pxWidth - pxGap, half - pxGap - pxWidth * 2];

  const sectOrbit = pxWidth / 2;
  const sectRadius = half - sectOrbit;
  const sectArea = [half, half - pxWidth];


  let H = $state(0);
  let S = $state(0);
  let L = $state(0);
  let A = $state(1);


  [H, S, L, A] = hexToHsla(color);


  $effect(() => {
    onchange({
      hsla: [H, S, L, A],
      get hex() {
        return hslaToHex(H, S, L, A);
      },
      get rgba() {
        return hslaToRgba(H, S, L, A);
      }
    });
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
      const dist = Math.sqrt((150 - top) ** 2 + (150 - left) ** 2);
      
      if (dist > hueArea[1] && dist < hueArea[0]) {
        document.body.classList.add("unselectable");
        return (activePicker = huePicker);
      }
      
      if (dist > sectArea[1] && dist < sectArea[0]) {
        document.body.classList.add("unselectable");
        const angle = Math.round(
          (Math.atan2(left - half, half - top) * 180) / Math.PI,
        );

        return activePicker = [
          lightPicker,
          satPicker,
          alphaPicker
        ].find((picker) =>
            (picker.min < angle && angle < picker.max) ||
            (picker.max > 180 && (angle > picker.min || angle < picker.max)),
        );
      }

      return false;
    },

    onend() {
      document.body.classList.remove("unselectable");
      activePicker = null;
    },
    
    onaction({ top, left }) {

      let angle = Math.round(
        (Math.atan2(left - half, half - top) * 180) / Math.PI,
      );

      if (activePicker.max > 180)
        angle = (angle + 360) % 360;

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
    cap = "butt",
  } = {}) {
    const L = radius * 2 * Math.PI;
    let k = cap === 'round' ? trackWidth : 0;
    const len = (L - trackGap *3 - k*3) / 3;
    return {
      r: radius - trackWidth / 2,
      stroke: "white",
      "stroke-width": trackWidth,
      "stroke-dasharray": len - trackWidth + "," + L,
      "stroke-linecap": cap,
      getAngle(num) {
        return 360 / 3 * num + k/2;
      }
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
    
    {@render sect("light", sector, 1)}
    {@render sect("sat", sector, 2)}
    {@render mask("alpha")}
    {@render sect("alpha", sector, 0)}

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



{#snippet sect(name, {getAngle, ...props}, num = 0)}
  <g transform="rotate({getAngle(num)}, 50, 50)">
    <mask id="mask-{name}">
      <circle cx="50%" cy="50%" {...props} />
    </mask>

    <foreignObject mask="url(#mask-{name})" width="100" height="100">
      <div class="track track-{name}"></div>
    </foreignObject>
  </g>
{/snippet}


{#snippet circle(name, props)}
    <mask id="mask-{name}">
      <circle cx="50%" cy="50%" {...props} />
    </mask>

    <foreignObject mask="url(#mask-{name})" width="100" height="100">
      <div class="track track-{name}"></div>
    </foreignObject>
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
      red 112deg
    );
  }

  .track-light {
    background-image: conic-gradient(
      from 90deg at 50% 50%,
      #000,
      var(--HS) 56deg,
      #fff 112deg,
      red 112deg
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

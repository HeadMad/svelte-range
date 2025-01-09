<script>
  import {onMount} from "svelte";
  import coordinator from "../actions/coordinator.svelte.js";
  import { clamp, scale, hexToHsla, hslaToHex } from "../utils";

  let { hex } = $props();

  let color = $state({
    name: "color",
    left: "100%",
    top: 0,
    onaction: onColorAction,
  });

  let hue = $state({ name: "hue", left: "50%", top: 0, onaction: onHueAction });

  let alpha = $state({
    name: "alpha",
    left: "100%",
    top: "50%",
    onaction: onAlphaAction,
  });

  let H = $state(0);
  let S = $state(100);
  let L = $state(50);
  let A = $state(1);

  onMount(() => {
    [H, S, L, A] = hexToHsla(hex);
    hue.top = scale(H, [0, 360], [0, 100]) + "%";
    color.left = scale(S, [0, 100], [0, 100]) + "%";
    color.top = scale(L, [0, 100], [100, 0]) + "%";
    alpha.left = scale(A, [0, 1], [0, 100]) + "%";
  });

  function onColorAction({ left, top, width, height }) {
    const l = clamp(left, 0, width);
    const t = clamp(top, 0, height);
    color.left = l + "px";
    color.top = t + "px";
    S = Math.round(scale(l, [0, width], [0, 100]));
    const xL = Math.round(scale(l, [0, width], [100, 50]));
    L = Math.round(scale(t, [0, height], [xL, 0]));
  }

  function onHueAction({ top, height }) {
    const t = clamp(top, 0, height);
    hue.top = t + "px";
    H = Math.round(scale(t, [0, height], [0, 360]));
  }

  function onAlphaAction({ left, width }) {
    const l = clamp(left, 0, width);
    alpha.left = l + "px";
    A = Number(l / width).toFixed(2);
  }

  const onstart = () => document.body.classList.add("unselectable");
  const onend = () => document.body.classList.remove("unselectable");
</script>

<div
  class="body"
  style="
--HUE: hsl({H}, 100%, 50%);
--HSL: hsl({H}, {S}%, {L}%);
--HSLA: hsl({H}, {S}%, {L}%, {A});
"
>
  {#each [color, hue, alpha] as { onaction, name, left, top }}
    <div
      class="track {name}"
      use:coordinator={{
        onaction,
        onstart,
        onend,
      }}
    >
      <div class="thumb {name}" style:top style:left></div>
    </div>
  {/each}

  <div class="example"></div>
</div>

<br>
H: {H} S: {S} L: {L} A: {A}
<br>
hex: {hslaToHex(H, S, L, A)}

<style>
  .body {
    display: grid;
    grid-template: 10fr 1fr/ 10fr 1fr;
    gap: 10px;
    border: 1px solid #ccc;
    padding: 10px;
    width: 400px;
    height: 200px;
  }

  .example {
    background-color: var(--HSLA);
  }

  .thumb {
    position: absolute;
    width: 10px;
    height: 10px;
    border: 2px solid #fff;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  .thumb.hue {
    background-color: var(--HUE);
  }

  .thumb.color {
    background-color: var(--HSL);
  }

  .thumb.alpha {
    background-color: var(--HSLA);
  }

  .track {
    position: relative;
    /* width: 100%;
    height: 100%; */
    /* border-radius: 5px; */
  }

  .track.hue {
    background-image: linear-gradient(
      0deg,
      red 0,
      #f0f 16.6%,
      #00f 33.2%,
      #0ff 49.8%,
      #0f0 66.4%,
      #ff0 83%,
      red
    );
  }

  .track.color {
    background-color: var(--HUE);
    background-image: linear-gradient(0deg, #000, rgba(204, 154, 129, 0)),
      linear-gradient(90deg, #fff, rgba(255, 255, 255, 0));
  }

  .track.alpha {
    background-image: linear-gradient(90deg, #ffffff00, var(--HSL)),
      url("data:image/svg+xml,%3Csvg viewBox='0 0 2 2' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' fill='%230000001a'/%3E%3Crect x='1' y='1' width='1' height='1' fill='%230000001a'/%3E%3C/svg%3E");
    background-size: auto 10px;
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

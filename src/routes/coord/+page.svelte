<script>
  import coordinator from "$lib/actions/coordinator.js";
  import Range, { clamp, scale } from "$lib";

  let size = 201;
  let hueSectHeight = size / 6;

  let color = $state({name: 'color', left: '100%', top: 0, onaction: onColorAction});

  let hue = $state({name: 'hue', left: '50%', top: 0, onaction: onHueAction});

  let alpha = $state({name: 'alpha', left: '100%', top: '50%', onaction: onAlphaAction});

  let R = $state(255);
  let G = $state(0);
  let B = $state(0);
  let A = $state(1);

  let hR = $state(255);
  let hG = $state(0);
  let hB = $state(0);

  let x = 0;
  let y = 0;

  const hueSectionHandlers = [
		(value) => setHue(255, value, 0),
		(value) => setHue(255 - value, 255, 0),
		(value) => setHue(0, 255, value),
		(value) => setHue(0, 255 - value, 255),
		(value) => setHue(value, 0, 255),
		(value) => setHue(255, 0, 255 - (value || 255)),
	];

  
	function setHue(r, g, b) {
		hR = r;
		hG = g;
		hB = b;
	}


	function setRGB() {
		const setColor = (hRGB) => {
			const xRGB = hRGB + scale(x, [0, size], [0, 255 - hRGB]);
			return Math.round(scale(y, [0, size], [0, xRGB * 255] ) / 255);
		};

		R = setColor(hR);
		G = setColor(hG);
		B = setColor(hB);

		// runChangeHandler();
	}


  function onColorAction({ left, top}) {
    const l = clamp(left, 0, size);
    const t = clamp(top, 0, size);
    color.left = l + 'px';
    color.top = t + 'px';
    x = size - l;
    y = size - t;
    setRGB();
  }


  function onHueAction({  top, height }) {
    const t = clamp(top, 0, height);
    hue.top = t + 'px';
		const s = clamp( Math.floor(t / hueSectHeight), 0, 5);
		const rem = t % hueSectHeight;

		const val = Math.round(scale(rem, [0, hueSectHeight], [0,255]));
		hueSectionHandlers[s](val);
    setRGB();
  }


  function onAlphaAction({ left, width, height }) {
    const l = clamp(left, 0, width);
    alpha.left = l + 'px';
    A = Number(l/width).toFixed(2);
  }

  const onstart = () => document.body.classList.add('unselectable');
  const onend = () => document.body.classList.remove('unselectable');

</script>

R: {R} G: {G} B: {B} A: {A}
<br>
hR: {hR} hG: {hG} hB: {hB}
<br>
<br>
<div
class="body"
style="
  grid-template: {size}px {size/10}px/ {size}px {size/10}px;
--size: {size}px;
--hue: {hR}, {hG}, {hB};
--RGB: {R}, {G}, {B};
--A: {A};
">
  {#each [color, hue, alpha] as {onaction, name, left, top}}
    <div class="track {name}" use:coordinator={{
      onaction,
      onstart,
      onend
    }}>
      <div class="thumb {name}" style:top style:left></div>
    </div>
  {/each}

  <div class="example" style:background-color="rgba({R}, {G}, {B}, {A})"></div>
</div>



<style>

  .body {
    display: grid;
		gap: 10px;
		border: 1px solid #ccc;
		padding: 10px;
    width: min-content;

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
    background-color: rgb(var(--hue));
  }

  .thumb.color {
    background-color: rgb(var(--RGB));
  }

  .thumb.alpha {
    background-color: rgba(var(--RGB), var(--A));
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
		background-color: rgb(var(--hue));
		background-image: linear-gradient(0deg, #000, rgba(204, 154, 129, 0)),
			linear-gradient(90deg, #fff, rgba(255, 255, 255, 0));
  }

  .track.alpha {
		background-image: linear-gradient(90deg, #ffffff00, rgb(var(--RGB))),
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

<script>
  import {clamp, scale} from "$lib";

  const par = {
    angle: 0,
    radius: 50,
    progress: 27,
    width: 6,
    cap: "round",
    dash: 0,
    get r() {
      return this.radius - this.width / 2;
    },
    get L() {
      return this.r * 2 * Math.PI;
    },
    get len() {
      return this.L / 100 * this.progress;
    }
  };

  let hue = $state(par);
  
  let dark = $state(par);
  
  let light = $state(par);

  let params = $state(hue);
</script>

<svg
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >

    {@render circle('hue', hue)}
    {@render circle('dark', dark)}
    {@render circle('light', light)}
    
    </svg>

    {#snippet circle(name, {r, width, len, L, angle, cap, dash})}
    <g transform="rotate({angle}, 50, 50)">
    <mask id="{name}">
        <circle id="stroke" cx="50%" cy="50%" fill="black"
        r="{r}"
        stroke-width={width}
        stroke-dasharray="{len}, {L}"
        
        stroke-linecap="{cap}"
        stroke="white"
        stroke-dashoffset="0"
        />
        </mask>
  
        <foreignObject mask="url(#{name})" width="100" height="100">
          <div class="square {name}"></div>
        </foreignObject>
</g>
    {/snippet}

<div>
  <button class:active={params === hue} on:click={() => params = hue}>Hue</button>
  <button class:active={params === dark} on:click={() => params = dark}>Dark</button>
  <button class:active={params === light} on:click={() => params = light}>Light</button>
</div>

    <label>
      Length:<br>
      <input type="number" bind:value={params.progress}>
      <input type="range" min=0 max=100 bind:value={params.progress}>
    </label>
    
    <label>
      Angle: <br>
      <input type="number" bind:value={params.angle}>
      <input type="range" min=0 max=360 bind:value={params.angle}>
    </label>
    
    <label>
      Radius: <br>
      <input type="number" bind:value={params.radius}>
      <input type="range" min=0 max=50 bind:value={params.radius}>
    </label>
    <label>
      Width: <br>
      <input type="number" bind:value={params.width}>
      <input type="range" min=0 max=50 bind:value={params.width}>
    </label>
    <label>
      Dash: <br>
      <input type="number" bind:value={params.dash}>
      <input type="range" min=0 max=50 bind:value={params.dash}>
    </label>

    <select name="" id="" bind:value={params.cap}>
      <option value="butt">butt</option>
      <option value="round">round</option>
      <option value="square">square</option>
    </select>



    <style>
      input[type=number] {
        width: 40px;
      }


      button.active {
        background: #ccc;
        border: 1px solid;
      }
      label  {
        display: block;
      }
      svg {
        width: 300px;
        height: 300px;
        background: #ccc;
      }

      .square {
        width: 100%;
        height: 100%;
      }

      .hue {
        
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

      .dark {
        background-color: black;
      }

      .light {
        background-color: #eee
      }
    </style>


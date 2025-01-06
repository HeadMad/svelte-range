<script>
  let r = $state(25);
  let L = $derived(r * 2 * Math.PI);
  let l = $state(50);
  let pl = $derived(L/100*l);
  let o = $state(10);
  let po = $derived(L/100*o)
</script>

<svg
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
    <mask id="mask">
      <circle id="stroke" cx="50%" cy="50%" fill="black"
      r="{r}"
      stroke="white"
      stroke-dasharray="{pl}"
      stroke-dashoffset="{po}"
      stroke-linecap="butt"
      stroke-width="50"
      />
      
      </mask>

      <foreignObject mask="url(#mask)" width="100" height="100">
        <div class="square"></div>
      </foreignObject>
      <defs>
      </defs>
    </svg>

    <input type="range" min=0 max=100 bind:value={l}>
    <input type="range" min=0 max=100 bind:value={o}>

    <style>

      svg {
        width: 300px;
        height: 300px;
        background: #ccc;
      }
      .square {
        width: 100%;
        height: 100%;
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
    </style>


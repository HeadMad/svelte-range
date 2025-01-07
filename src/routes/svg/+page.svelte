<script>
  const hue = { r: 33, 'stroke-width': 6, stroke: 'white'};

  function createSect({radius = 50, progress = 27, width = 6, cap = 'round'} = {}) {
    const L = radius * 2 * Math.PI;
    const len = L / 100 * progress;
    return {
      r: radius - width / 2,
      stroke: 'white',
      'stroke-width': width,
      'stroke-dasharray': len + ',' + L,
      'stroke-linecap': cap,
    };
  }

  const sector = createSect();

</script>

<div class="body">
  <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
      >
  
      {@render circle('hue', hue)}

      <!-- {@render circle('alpha', createSect(90))} -->
      {@render circle('dark', sector, 70)}
      {@render circle('light', sector, 190)}
      {@render circle('alpha', sector, 320)}
  
  
  
      </svg>
</div>


    {#snippet circle(name, props, angle)}
    <g transform="rotate({angle}, 50, 50)">
      <mask id="mask-{name}">
        <circle cx="50%" cy="50%" {...props}/>
      </mask>

      <foreignObject mask="url(#mask-{name})" width="100" height="100">
        <div class="square {name}"></div>
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
    
      .square {
        width: 100%;
        height: 100%;
        background: #ddd !important;
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
        background-image: conic-gradient(
          from 86deg at 50% 50%, red , black 111deg);
      }
    
      .alpha {
        /* position: relative; */
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 2 2' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' fill='%230000001a'/%3E%3Crect x='1' y='1' width='1' height='1' fill='%230000001a'/%3E%3C/svg%3E");
          background-size: auto 4px;
        }
        
        /* .alpha::after {
          content: "";
          position: absolute;
          top:0; left: 0; bottom: 0; right: 0;
          background-image: conic-gradient(
          from 86deg at 50% 50%, red , transparent 111deg);
        } */
    
      .light {
        
        background-image: conic-gradient(
          from 86deg at 50% 50%, white, red 111deg);
      }
    
      .result {
        background: red;
      }
    
      
    </style>
    
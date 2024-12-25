<svg width="90vmin" height="90vmin"  fill="none" xmlns="http://www.w3.org/2000/svg">

    <defs>
      <mask id="circle">
        <rect width="100%" height="100%" fill="black"/>
        <circle r="50%" cx="50%" cy="50%" fill="white"/>
        <circle r="40%" cx="50%" cy="50%" fill="black"/>
      </mask>
    </defs>

    <foreignObject width="100%" height="100%" style="mask: url(#circle);">
      <div id="circle"></div>
    </foreignObject>
  </svg>
  

  <style>
    #circle {
      width: 100%;
      height: 100%;
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
    :global(body) {
      /* background: #0f0; */
    }
  </style>
<div class="body">
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- DARK -->
    <mask id="mask-dark">
      <path d="M8 49.9916C8 21.4119 35.6937 1.31637 62.9619 10.0693" stroke="white" stroke-width="6" stroke-linecap="round"/>
    </mask>

    <foreignObject mask="url(#mask-dark)" width="100" height="100">
      <div class="square dark"></div>
    </foreignObject>
    <!-- DARK -->

    <!-- ALPHA -->
    <mask id="mask-alpha">
      <path
        d="M70.9783 13.6772C95.7352 27.9671 99.2959 61.9923 78.0796 81.225"
        stroke="white"
        stroke-width="6"
        stroke-linecap="round"
      />
    </mask>

    <foreignObject mask="url(#mask-alpha)" width="100" height="100">
      <div class="square alpha"></div>
    </foreignObject>
    <!-- ALPHA -->

    <!-- LIGHT -->
    <mask id="mask-light">
      <path
        d="M70.9695 86.3179C46.2126 100.608 14.9582 86.678 8.90625 58.6924"
        stroke="white"
        stroke-width="6"
        stroke-linecap="round"
      />
    </mask>

    <foreignObject mask="url(#mask-light)" width="100" height="100">
      <div class="square light"></div>
    </foreignObject>
    <!-- /LIGHT -->

    <!-- HUE -->
    <mask id="mask-hue">
      <circle cx="50" cy="50" r="30" stroke="white" stroke-width="7" />
    </mask>

    <foreignObject mask="url(#mask-hue)" width="100" height="100">
      <div class="square hue"></div>
    </foreignObject>
    <!-- /HUE -->

    <!-- RESULT -->
    <mask id="mask-result">
      <circle cx="50" cy="50" r="18" fill="white" />
    </mask>

    <foreignObject mask="url(#mask-result)" width="100" height="100">
      <div class="square result"></div>
    </foreignObject>
    <!-- /RESULT -->
  </svg>
</div>

<style>
  .body {
    position: relative;
    width: 300px;
    height: 300px;
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
    background-image: conic-gradient(
      from 265deg at 50% 50%, red , black 115deg);
  }

  .alpha {
    position: relative;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 2 2' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' fill='%230000001a'/%3E%3Crect x='1' y='1' width='1' height='1' fill='%230000001a'/%3E%3C/svg%3E");
      background-size: auto 4px;
    
    }
    
    .alpha::after {
      content: "";
      position: absolute;
      inset: 0;
      background-image: conic-gradient(
      from 25deg at 50% 50%, #ffffff00, red 118deg, black 118deg);
    }

  .light {
    
    background-image: conic-gradient(
      from 263deg at 50% 50%, white 240deg, #f00);
  }

  .result {
    background: red;
  }
</style>

<script>
  import clamp from "./clamp.js";

  let {
    thumb,
    track,
    style = "",
    onmove = () => {},
    onstart = () => {},
    onend = () => {}
  } = $props();

  const isTouch =
		"ontouchstart" in globalThis ||
		(globalThis.DocumentTouch &&
			document instanceof globalThis.DocumentTouch) ||
		navigator.maxTouchPoints > 0 ||
		globalThis.navigator.msMaxTouchPoints > 0;

  const eventNames = isTouch ? ["touchstart", "touchend", "touchmove"] : ["mousedown", "mouseup", "mousemove"];

  let range;
  let isPushed = false;

  let w;
  let h;

  let params = $state({left: 0, top: 0, width: 0, height: 0});

  let box;

  $effect(() => {
    w = range.offsetWidth;
    h = range.offsetHeight;

    box = range.getBoundingClientRect();

    range.addEventListener(eventNames[0], start);
    document.addEventListener(eventNames[1], end);
    document.addEventListener(eventNames[2], move);

    return () => {
      range.removeEventListener(eventNames[0], start);
      document.removeEventListener(eventNames[1], end);
      document.removeEventListener(eventNames[2], move);
    };
  });

  function start(e) {
    isPushed = true;
    params = getParams(e);
    onstart(params);
    onmove(params);
  }

  function end(e) {
    isPushed = false;
    onend(params);
  }

  function move(e) {
    if (!isPushed) return;
    params = getParams(e);
    onmove(params);
  }

  /**
	 *
	 * @param e
	 */
	function getParams(e) {
    let left = null, top = null;
		return {
      get left() {
        if ( left !== null ) return left;
				const pageX = isTouch ? e.touches[0].pageX : e.pageX;
				const value = Math.ceil(pageX - box.left - window.pageXOffset);
				return left = clamp(value, 0, w);
			},
			get top() {
        if ( top !== null ) return top;
				const pageY = isTouch ? e.touches[0].pageY : e.pageY;
				const value = Math.ceil(pageY - box.top - window.pageYOffset);
				return top = clamp(value, 0, h);
			},
      width: w,
      height: h
		};
	}

</script>

<div bind:this={range} {style}>
  {@render track(params)}
  {@render thumb(params)}
</div>

<style>
  div {
    position: relative;
    display: inline-block;
  }
</style>
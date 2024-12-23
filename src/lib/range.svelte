<script>
  import clamp from "./clamp.js";

  let {
    args,
    children,
    onaction = () => {},
    onstart = () => {},
    onend = () => {},
    ...attrs
  } = $props();

  const isTouch =
		"ontouchstart" in globalThis
    || (globalThis.DocumentTouch && document instanceof globalThis.DocumentTouch)
    || navigator.maxTouchPoints > 0
    || globalThis.navigator.msMaxTouchPoints > 0;

  const eventNames = isTouch
  ? ["touchstart", "touchend", "touchmove"]
  : ["mousedown", "mouseup", "mousemove"];


  let isPushed = false;
  var range, width, height, params, box;

  $effect(() => {
    width = range.offsetWidth;
    height = range.offsetHeight;

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
    const params = getParams(e);
    onstart(params);
    onaction(params);
  }

  function end(e) {
    isPushed = false;
    onend(params);
  }

  function move(e) {
    if (!isPushed) return;
    params = getParams(e);
    onaction(params);
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
				return left = clamp(value, 0, width);
			},
			get top() {
        if ( top !== null ) return top;
				const pageY = isTouch ? e.touches[0].pageY : e.pageY;
				const value = Math.ceil(pageY - box.top - window.pageYOffset);
				return top = clamp(value, 0, height);
			},
      width,
      height
		};
	}

</script>
<div bind:this={range} {...attrs}>
  {@render children(args)}
</div>

<style>
  div {
    position: relative;
    display: inline-block;
  }
</style>
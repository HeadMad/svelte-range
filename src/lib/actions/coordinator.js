
import clamp from "../utils/clamp.js";

export default(node, {
  onaction = () => {},
  onstart = () => {},
  onend = () => {}
} = {}) => {

  const isTouch =
		"ontouchstart" in globalThis
    || (globalThis.DocumentTouch && document instanceof globalThis.DocumentTouch)
    || navigator.maxTouchPoints > 0
    || globalThis.navigator.msMaxTouchPoints > 0;

  const eventNames = isTouch
  ? ["touchstart", "touchend", "touchmove"]
  : ["mousedown", "mouseup", "mousemove"];

  let isPushed = false;
  let params;

  const width = node.offsetWidth;
  const height = node.offsetHeight;

  const box = node.getBoundingClientRect();

  function start(e) {
    const params = getParams(e);
    isPushed = onstart(params, e) !== false;
    
    if (isPushed)
    onaction(params, e);
  }


  function end(e) {
    isPushed = false;
    onend(params, e);
  }


  function move(e) {
    if (!isPushed) return;
    params = getParams(e);
    onaction(params, e);
  }

  
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

  node.addEventListener(eventNames[0], start);
  document.addEventListener(eventNames[1], end);
  document.addEventListener(eventNames[2], move);

  return () => {
    node.removeEventListener(eventNames[0], start);
    document.removeEventListener(eventNames[1], end);
    document.removeEventListener(eventNames[2], move);
  };

};
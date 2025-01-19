export default (node, {
  init = () => {},
  onaction = () => { },
  onstart = () => { },
  onend = () => { }
} = {}) => {

  const box = node.getBoundingClientRect();

  const isTouchscreen =
    "ontouchstart" in globalThis
    || (globalThis.DocumentTouch && document instanceof globalThis.DocumentTouch)
    || navigator.maxTouchPoints > 0
    || globalThis.navigator.msMaxTouchPoints > 0;

  init({isTouchscreen, box});

  const eventNames = isTouchscreen
    ? ["touchstart", "touchend", "touchmove"]
    : ["mousedown", "mouseup", "mousemove"];

  let params;

  node.addEventListener(eventNames[0], start);

  function start(e) {
    params = getParams(e);
    addEventListener(eventNames[1], end, {once: true});
    
    if (onstart(params, e) === false)
      return;
  
    addEventListener(eventNames[2], move);
    onaction(params, e);
  }

  function move(e) {
    params = getParams(e);
    onaction(params, e);
  }

  function end(e) {
    removeEventListener(eventNames[2], move);
    onend(params, e);
  }


  function getParams(e) {
    let left = null, top = null;
    const width = node.offsetWidth;
    const height = node.offsetHeight;
    return {
      get left() {
        if (left !== null) return left;
        const pageX = isTouchscreen ? e.touches[0].pageX : e.pageX;
        return left = Math.ceil(pageX - box.left - window.pageXOffset);
      },
      get top() {
        if (top !== null) return top;
        const pageY = isTouchscreen ? e.touches[0].pageY : e.pageY;
        return top = Math.ceil(pageY - box.top - window.pageYOffset);

      },
      width,
      height
    };
  }

  

  return {
    destroy() {
      node.removeEventListener(eventNames[0], start);
    }
  };
};
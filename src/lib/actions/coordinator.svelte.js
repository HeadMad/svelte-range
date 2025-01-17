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

  let isPushed = false;
  let params;


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

  node.addEventListener(eventNames[0], start);
  document.addEventListener(eventNames[1], end);
  document.addEventListener(eventNames[2], move);

  $effect(() => () => {
      node.removeEventListener(eventNames[0], start);
      document.removeEventListener(eventNames[1], end);
      document.removeEventListener(eventNames[2], move);
  });

};
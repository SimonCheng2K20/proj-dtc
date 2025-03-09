export default (target, duration = 500) => {
  const start = document.documentElement.scrollTop;
  const change = target.offsetTop - start - 50;
  const increment = 20;
  let currentTime = 0;

  const animateScroll = () => {
    currentTime += increment;

    const val = Math.easeInOutQuad(currentTime, start, change, duration);

    document.documentElement.scrollTop = val;

    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };

  animateScroll();
};

Math.easeInOutQuad = function(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

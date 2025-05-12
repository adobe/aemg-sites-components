function debounce(func, delay) {
  let timeoutId;

  return function (...args) {

    clearTimeout(timeoutId);

    timeoutId = setTimeout(function () {
      func.apply(this, args); // Use apply to preserve 'this' and pass the arguments
    }, delay);
  };
}

export default debounce;
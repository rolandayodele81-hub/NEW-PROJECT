window.PDMS_ONLOAD = window.PDMS_ONLOAD || [];
window.PDMS_CALLBACK = function(callback){
  if (typeof callback === 'function') {
    if (window.PDMS && window.PDMS.icon) {
      callback();
    } else {
      window.PDMS_ONLOAD.push(callback);
    }
  }
};

window.addEventListener('load', () => {
  if (window.PDMS_ONLOAD.length && window.PDMS && window.PDMS.icon) {
    window.PDMS_ONLOAD.forEach(fn => fn());
    window.PDMS_ONLOAD = [];
  }
});

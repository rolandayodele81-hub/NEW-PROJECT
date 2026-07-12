/* PDMS Config — single source of truth for the backend URL.
   Set this once to your deployed Apps Script Web App /exec URL
   (see appscript/README.md). Every page picks it up from here. */
(function (global) {
  global.PDMS_API_URL = 'https://script.google.com/macros/s/AKfycbx63abHDM6FNFJ092t02DDkCyFrsPz6k5Pi5vuYan2pybiEnyWkmPibKX5wgfkuE5aK/exec';

  if (global.PDMS_API_URL && global.PDMS_API_URL.indexOf('REPLACE_WITH') !== 0) {
    document.write('<script src="' + global.PDMS_API_URL + '?action=bootstrap"><\/script>');
  }
})(window);

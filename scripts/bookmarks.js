/* global cuid */

'use strict';

const bookmark = (function() {

  const create = function(title, url, desc, rating) {
    return {
      id: cuid(),
      title,
      desc,
      rating,
      detailed: false
    };
  };


  return {
    create
  };
})();
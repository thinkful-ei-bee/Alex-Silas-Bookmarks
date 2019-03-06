/* global bookmarkList, api, store */

'use strict';

$(document).ready(function() {
  bookmarkList.bindEventListeners();
  bookmarkList.render();

  api.getItems()
    //.then(res => res.json())
    .then((res) => {
      res.forEach((item) => store.addBookmark(item));
      bookmarkList.render();
    }).catch(error => {
      bookmarkList.setError(error.message);
      bookmarkList.render();
    });
});
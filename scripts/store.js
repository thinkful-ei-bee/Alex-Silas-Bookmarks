'use strict';

const store = (function() {

  const addBookmark = function(bookmark) {
    this.bookmarks.push(bookmark);
  };

  const setFilter = function(rating) {
    this.ratingSearch = rating;
  };

  return {
    bookmarks: [],
    ratingSearch: 1,
    addingBookmark: false,

    addBookmark,
    setFilter,
  };
})();
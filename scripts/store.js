'use strict';

const store = (function() {

  const addBookmark = function(bookmark) {
    this.bookmarks.push(bookmark);
  };

  const setFilter = function(rating) {
    this.ratingSearch = rating;
  };

  const findItemById = function(id) {
    return this.bookmarks.find(x => x.id === id);
  };

  const deleteBookmark = function(id) {
    this.bookmarks = this.bookmarks.filter(x => x.id !== id);
  };

  return {
    bookmarks: [],
    ratingSearch: 1,
    addingBookmark: false,
    errorStatement: '',

    addBookmark,
    setFilter,
    findItemById,
    deleteBookmark,
  };
})();
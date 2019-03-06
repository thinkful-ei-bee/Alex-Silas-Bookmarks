'use strict';

const api = (function() {

  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/alexsilas/bookmarks';

  const createItem = function(title, url, desc, rating) {
    let newItem = {
      title,
      url,
      desc,
      rating,
    };

    return bookmarkApiFetch(`${BASE_URL}`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(newItem),
    });
  };

  const getItems = function() {
    return bookmarkApiFetch(`${BASE_URL}`);
  };

  const deleteItem = function(id) {
    return bookmarkApiFetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  };
  /* Private Function*/
  function bookmarkApiFetch(...args) {
    let error;

    return fetch(...args)
      .then(res => {
        if (!res.ok) {
          error = { code: res.status };
        }

        if (!res.headers.get('content-type').includes('json')) {
          error.message = res.statusText;
          return Promise.reject(error);
        }

        return res.json();
      })
      .then(data => {
        // fail! 
        if (error) {
          error.message = data.message;
          return Promise.reject(error);
        }
        // success! put data in the store
        return data;
      });
  }

  return {
    createItem,
    getItems,
    deleteItem,
  };

})();
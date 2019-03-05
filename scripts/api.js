'use strict';

const api = (function(){
  
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/alexsilas/bookmarks';

  const createItem = function(title, url, desc, rating){
    let newItem = {
      title,
      url,
      desc,
      rating,
    };

    return fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(newItem),
    });
  };

  const getItems = function(){
    return fetch(`${BASE_URL}`);
  };

  const deleteItem = function(id){
    return fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  };

  return {
    createItem,
    getItems,
    deleteItem,
  };

})();
'use-strict';

$(document).ready(function() {
  bookmarkList.bindEventListeners();
  bookmarkList.render();

  /* api.getItems()
     .then((items) => {
       items.forEach((item) => store.addItem(item));
       shoppingList.render();
     });*/
});
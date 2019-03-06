/* global store, api */
'use strict';

const bookmarkList = (function() {

  function render() {

    if (store.errorStatement === '') {
      $('.errorBlock').html('');
    } else {
      $('.errorBlock').html(`<div class="banner">${store.errorStatement}</div>`);
    }

    if (store.addingBookmark) {
      $('.container').html(addingBookmarkTemplate());
      $('.beginButtons').html('');
    } else {
      $('.container').html('');
      $('.beginButtons').html(addingBeginButtonTemplate());
    }

    $('.bookmarkList').empty();

    store.bookmarks.forEach((item) => {
      if (item.rating >= store.ratingSearch) {
        if (item.detailed) {
          $('.bookmarkList').append(addingDetailedBookmark(item.title, item.rating, item.id, item.url, item.desc));
        } else {
          $('.bookmarkList').append(addingDefaultBookmark(item.title, item.rating, item.id));
        }
      }
    });

    $('.rate').val(`${store.ratingSearch}`);

  }

  function addingBookmarkTemplate() {
    return `<form id="js-adding-bookmark-form">
      <label for="bookmark-title-entry">Add a Bookmark Title</label>
      <input type="text" name="bookmark-title-entry" class="js-bookmark-title-entry" required placeholder="e.g., Google">
      <label for="bookmark-url-entry">Add a Bookmark Url</label>
      <input type="text" name="bookmark-url-entry" class="js-bookmark-url-entry" required placeholder="e.g., https://google.com">
      <label for="bookmark-desc-entry">Add a Bookmark Description</label>
      <input type="text" name="bookmark-desc-entry" class="js-bookmark-desc-entry" placeholder="e.g., Search Engine">
      <label class="block">
          <input type="radio" name="rating" required="required" value="1">
          <span>1</span>
        </label>
      <label class="block">
          <input type="radio" name="rating" required="required" value="2">
          <span>2</span>
        </label>
      <label class="block">
          <input type="radio" name="rating" required="required" value="3">
          <span>3</span>
        </label>
      <label class="block">
          <input type="radio" name="rating" required="required" value="4">
          <span>4</span>
        </label>
      <label class="block">
          <input type="radio" name="rating" required="required" value="5">
          <span>5</span>
        </label>
      <button type="submit" class="submit-bookmark css-adding-form-buttons">Add Bookmark</button>
      <button type="button" class="cancelButton css-adding-form-buttons">Cancel</button>
  </form>`;
  }

  function addingBeginButtonTemplate() {
    return `<button type="button" class="addButton css-add-button">Add a new bookmark</button>
            <form id ="js-search-filter">
                <select class="rate">
                    <!--<option selected="selected">${store.ratingSearch}</option>-->
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <button type="submit" class="submit-filter css-filter-button">Filter by Rating: </button>
            </form>`;
  }

  function addingDefaultBookmark(title, rating, id) {
    return ` <div class = "item-container" data-item-id = "${id}" >
                 <div class = "default-bookmark">
                     <h2>${title}</h2>
                     <div class="rating">
                        <span id="star">${rating} &#9733;</span>
                     </div> 
                </div> 
            </div>`;
  }

  function addingDetailedBookmark(title, rating, id, url, desc) {
    return ` <div class = "item-container" data-item-id="${id}" >
                <div class = "default-bookmark" >
                    <h2>${title}</h2>
                    <div class="rating">
                        <span id="star">${rating} &#9733;</span>
                    </div> 
                </div > 
                <div class = "expanded-bookmark">
                    <p>Description: ${desc}</p>
                    <button type = "button" class = "visit-site-button" data-item-url="${url}">Visit Site</button> 
                    <button type = "button" class = "delete-button">Delete</button> 
                </div> 
            </div>`;
  }

  function handleFilter() {
    $('.beginButtons').on('submit', '#js-search-filter', event => {
      event.preventDefault();
      store.ratingSearch = $('.rate option:selected').text();
      render();
    });
  }

  function handleDelete() {
    $('.bookmarkList').on('click', '.delete-button', event => {
      const itemId = $(event.currentTarget).closest('.item-container').data('item-id');
      api.deleteItem(itemId)
        .then(() => {
          store.deleteBookmark(itemId);
          render();
        }).catch(error => {
          setError(error.message);
          render();
        });
    });
  }

  function handleVisitSite() {
    $('.bookmarkList').on('click', '.visit-site-button', event => {
      window.open($(event.currentTarget).data('item-url'));
    });
  }

  function handleNewAddBookMark() {
    $('.beginButtons').on('click', '.addButton', event => {
      store.addingBookmark = true;
      render();
    });
  }

  function handleSubmit() {
    $('.container').on('submit', '#js-adding-bookmark-form', event => {
      event.preventDefault();
      //console.log($(event.currentTarget));
      const title = $('.js-bookmark-title-entry').val();
      const url = $('.js-bookmark-url-entry').val();
      const desc = $('.js-bookmark-desc-entry').val();
      const ans = $('input[name=\'rating\']:checked').val();
      //console.log(title, url, desc, ans);
      api.createItem(title, url, desc, ans)
        //.then(res => res.json())
        .then((newItem) => {
          store.addBookmark(newItem);
          store.addingBookmark = false;
          render();
        }).catch(error => {
          //console.log(error);
          setError(error.message);
          render();
        });
    });
  }

  function handleToggleExpand() {
    $('.bookmarkList').on('click', '.default-bookmark', function(e) {
      console.log('handleToggleExpand ran' + e.currentTarget);
      const itemId = $(e.currentTarget).parent().data('item-id');
      const storeItem = store.findItemById(itemId);
      storeItem.detailed = !storeItem.detailed;
      render();
    });
  }

  function setError(error) {
    store.errorStatement = error;
    setTimeout(() => {
      store.errorStatement = '';
    }, 3000);
  }

  function handleCancel() {
    $('.container').on('click', '.cancelButton', event => {

      store.addingBookmark = false;
      render();
    });
  }

  function bindEventListeners() {
    handleNewAddBookMark();
    handleSubmit();
    handleCancel();
    handleFilter();

    handleToggleExpand();
    handleVisitSite();
    handleDelete();
  }

  return {
    render: render,
    bindEventListeners: bindEventListeners,
    setError: setError,
  };
})();
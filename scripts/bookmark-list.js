/* global store, api */
'use strict';

const bookmarkList = (function() {

  function render() {
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
  }

  function addingBookmarkTemplate() {
    return `<form id="js-adding-bookmark-form">
      <label for="bookmark-title-entry">Add a Bookmark Title</label>
      <input type="text" name="bookmark-title-entry" class="js-bookmark-title-entry" required placeholder="e.g., Google (Please input at least 1 character)">
      <label for="bookmark-url-entry">Add a Bookmark Url</label>
      <input type="text" name="bookmark-url-entry" class="js-bookmark-url-entry" required placeholder="e.g., https://google.com (Please use http:// or https://)">
      <label for="bookmark-desc-entry">Add a Bookmark Description</label>
      <input type="text" name="bookmark-desc-entry" class="js-bookmark-desc-entry" placeholder="e.g., Search Engine (Optional)">
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
      <button type="submit" class="submit-bookmark">Add Bookmark</button>
      <button type="button" class="cancelButton">Cancel</button>
  </form>`;
  }

  function addingBeginButtonTemplate() {
    return `<button type="button" class="addButton">Add a new bookmark</button>
            <form id ="js-search-filter">
                <select class="rate">
                    <option selected="selected">${store.ratingSearch}</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <button type="submit" class="submit-filter">Filter by Rating</button>
            </form>`;
  }

  function addingDefaultBookmark(title, rating, id) {
    return ` <div class = "item-container" data-item-id = "${id}" >
                 <div class = "default-bookmark">
                     <h2>${title}</h2>
                     <div class = "rating">${rating}</div> 
                </div > 
            </div>`;
  }

  function addingDetailedBookmark(title, rating, id, url, desc) {
    return ` <div class = "item-container" data-item-id="${id}" >
                <div class = "default-bookmark" >
                    <h2>${title}</h2>
                    <div class="rating">${rating}< /div> 
                </div > 
                <div class = "expanded-bookmark">
                    <p>${desc}</p>
                    <button type = "button" class = "visit-site-button" data-item-url="${url}">Visit Site</button> 
                    <button type = "button" class = "delete-button">Delete</button> 
                </div > 
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
      console.log($(event.currentTarget));
      const title = $('.js-bookmark-title-entry').val();
      const url = $('.js-bookmark-url-entry').val();
      const desc = $('.js-bookmark-desc-entry').val();
      const ans = $('input[name=\'rating\']:checked').val();
      if (!submitErrorCheck(url)) {
        alert('ender valid url address');
      } else {
        console.log(title, url, desc, ans);
        api.createItem(title, url, desc, ans)
          .then(res => res.json())
          .then((newItem) => {
            store.addBookmark(newItem);
            store.addingBookmark = false;
            render();
          });

      }
    });
    //take input from form
    //send to API (error check)
    //create bookmark
    //add bookmark to array
    //render should create html
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

  function submitErrorCheck(url) {
    console.log(url.substring(0, 9));
    if (url.length >= 7 && (url.substring(0, 7) === 'http://' || url.substring(0, 8) === 'https://')) {
      return true;
    } else {
      return false;
    }
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

    /*handleEdit*/
  }

  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
})();
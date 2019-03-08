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
      $('.addButton').text('-');
      $('.container').html(addingBookmarkTemplate());
    } else {
      $('.addButton').text('+');
      $('.container').html('');
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
      <label for="bookmark-title-entry"></label>
      <input type="text" name="bookmark-title-entry" class="js-bookmark-title-entry entry" required placeholder=" Title">
      <label for="bookmark-url-entry"></label>
      <input type="text" name="bookmark-url-entry" class="js-bookmark-url-entry entry" required placeholder=" URL">
      <label for="bookmark-desc-entry"></label>
      <input type="text" name="bookmark-desc-entry" class="js-bookmark-desc-entry entry" placeholder=" Description">
      <div class="css-rating-container">
        <label class="rating-label" for="rating">Rating: </label>
        <label class="block">
            <input type="radio" name="rating" required="required" value="1">
            <span class="choice">1</span>
        </label>
        <label class="block">
            <input type="radio" name="rating" class="css-radio" required="required" value="2">
            <span class="choice">2</span>
        </label>
        <label class="block">
            <input type="radio" name="rating" class="css-radio" required="required" value="3">
            <span class="choice">3</span>
        </label>
        <label class="block">
            <input type="radio" name="rating" class="css-radio" required="required" value="4">
            <span class="choice">4</span>
        </label>
        <label class="block">
            <input type="radio" name="rating" class="css-radio" required="required" value="5">
            <span class="choice">5</span>
        </label>
      </div>
      <div class="adding-form-container">
        <button type="submit" class="submit-bookmark css-adding-form-buttons add">Add</button>
        <button type="button" class="cancelButton css-adding-form-buttons cancel">Cancel</button>
      </div>
  </form>`;
  }

  //function addingBeginButtonTemplate() {
   // return `<!--<option selected="selected">${store.ratingSearch}</option>-->`;
  //}

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
                    <p>${desc}</p> 
                </div> 
                <div class="extended-buttons">
                  <button type = "button" class = "visit-site-button" data-item-url="${url}">Visit Site</button> 
                  <button type = "button" class = "delete-button">Delete</button>
                </div>
            </div>`;
  }

  function handleFilter() {
    $('.beginButtons').on('submit', '#js-search-filter', event => {
      event.preventDefault();
      console.log('hey everybody');
      store.ratingSearch = $('.rate option:selected').text();
      render();
    });
  }

  function handleForm(){
    $('#js-search-filter').on('change', '.rate', event => {
      event.preventDefault();
      const rating = $(event.currentTarget).val();
      store.ratingSearch = rating;
      console.log(rating);
      render();
      //store.ratingSearch = $('.rate option:selected').text();
      //render();
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
    $('#js-add-button').on('click', '.addButton', event => {
      store.addingBookmark = !store.addingBookmark;
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
    handleForm();

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
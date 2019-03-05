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
      <button type="button" class="filterButton">Filter bookmarks by rating</button>`;
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
      if(!submitErrorCheck(url)){
        alert('ender valid url address');
      } else {
        console.log(title, url, desc, ans);
        api.createItem(title, url, desc, ans)
          .then(res => res.json())
          .then((newItem) => {
            store.addBookmark(newItem);
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

  function submitErrorCheck(url){
    if(url.length >= 7 && (url.substring(0, 8) === 'http://' || url.substring(0, 9) === 'https://')){
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
    //handlefilter

    //handleExpandedView
    //handleVisitLink()
    //handleDelete

    /*handleEdit*/
  }

  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
})();
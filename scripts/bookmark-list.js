'use strict';

const bookmarkList = (function() {

  function render() {
    //we are checking if addin


  }

  function handleNewAddBookMark() {
    $('beginButtons').on('click', 'addButton', event => {
      //new html show up
      //get rid of BeginButtons add in container
      store.addingBookmark = true;
      render();
    });
  }

  function bindEventListeners() {
    //handleNewAddBookMark()
    //handleSubmit
    //handleCancel
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
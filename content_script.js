let content_close_button = document.querySelector('#content-block .close-button');
content_close_button.addEventListener('click', function() {
    document.querySelector('#content-block').classList.remove('show');
});
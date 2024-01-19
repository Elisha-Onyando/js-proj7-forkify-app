class SearchView {
    _parentElement = document.querySelector('.search');

    getQuery() {
        const searchQuery = this._parentElement.querySelector('.search__field').value;
        this._clearInputField();
        return searchQuery;
    }

    _clearInputField() {
        this._parentElement.querySelector('.search__field').value = '';
    }

    addHandlerSearch(handler) {
        this._parentElement.addEventListener('submit', function (e) {
            e.preventDefault();
            handler();
        })
    }
};

export default new SearchView();
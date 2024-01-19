import icons from 'url:../../img/icons.svg';

export default class View {

    _data;
    render(data, render = true) {
        if (!data || (Array.isArray(data) && data.length === 0))
            return this.renderError();
        this._data = data;
        const markup = this._generateMarkup();

        if (!render) return markup;

        this._clearParentElement();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    };

    update(data) {
        this._data = data;
        const newMarkup = this._generateMarkup();
        const newDOM = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const currElements = Array.from(this._parentElement.querySelectorAll('*'));

        newElements.forEach((newElement, i) => {
            const currElement = currElements[i];

            if (!newElement.isEqualNode(currElement) && newElement.firstChild?.nodeValue.trim() !== '') {
                currElement.textContent = newElement.textContent;
            };
            if (!newElement.isEqualNode(currElement)) {
                Array.from(newElement.attributes).forEach(attr => currElement.setAttribute(attr.name, attr.value));
            };
        });
    };

    _clearParentElement() {
        this._parentElement.innerHTML = '';
    };

    renderSpinner() {
        const spinner = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>
        `;
        this._clearParentElement();
        this._parentElement.insertAdjacentHTML('afterbegin', spinner);
    };

    renderError(message = this._errorMessage) {
        const errorHtml = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
        this._clearParentElement();
        this._parentElement.insertAdjacentHTML('afterbegin', errorHtml);
    };

    renderMessage(message = this._successMessage) {
        const successHtml = `
            <div class="message">
                <div>
                    <svg>
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
        this._clearParentElement();
        this._parentElement.insertAdjacentHTML('afterbegin', successHtml);
    };
};
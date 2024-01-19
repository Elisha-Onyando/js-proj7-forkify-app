import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';


// if (module.hot) {
//     module.hot.accept();
// }

const controlRecipes = async function () {
    try {
        const recipeId = window.location.hash.slice(1);

        if (!recipeId) return;
        recipeView.renderSpinner();

        // 0. Update results view to mark selected search result
        resultsView.update(model.getSearchResultsPage());

        // 1. Update bookmarks view
        bookmarksView.update(model.state.bookmarks);

        // 2. Fetching/Loading the recipe from the server
        await model.loadRecipe(recipeId);

        // 3. Rendering the recipe
        recipeView.render(model.state.recipe);
    } catch (err) {
        recipeView.renderError();
    };

};

const controlSearchResults = async function () {
    try {
        resultsView.renderSpinner();
        //1. Get search query
        const query = searchView.getQuery();
        if (!query) return;
        //2. Load search results
        await model.loadSearchResults(query);

        //3. Render results
        resultsView.render(model.getSearchResultsPage());

        //4. Render initial pagination buttons
        paginationView.render(model.state.search);
    } catch (err) {
        throw err;
    }
};

const controlPagination = function (goToPage) {
    //1. Render NEW results
    resultsView.render(model.getSearchResultsPage(goToPage));

    //2. Render NEW pagination buttons
    paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
    //Update the recipe servings
    model.updateServings(newServings);
    //Update the recipe view
    // 2. Rendering the recipe
    //recipeView.render(model.state.recipe);
    recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
    // 1. Add bookmark
    if (!model.state.recipe.bookmarked) {
        model.addBookmark(model.state.recipe);
    } else {
        //2. Remove bookmark
        model.deleteBookmark(model.state.recipe.id);
    }
    //3. Update recipe view
    recipeView.update(model.state.recipe);

    //4. Render bookmarks
    bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function () {
    bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function (newRecipe) {
    try {
        //Show loading spinner
        addRecipeView.renderSpinner();
        //Upload the new recipe data
        await model.uploadRecipe(newRecipe);
        //console.log(model.state.recipe);

        //Render recipe 
        recipeView.render(model.state.recipe);

        //Render success message
        addRecipeView.renderMessage();

        //Render bookmark view
        bookmarksView.render(model.state.bookmarks);

        //Change id in the URL
        window.history.pushState(null, '', `#${model.state.recipe.id}`);

        //Close form window
        setTimeout(function () {
            addRecipeView.toggleWindow();
        }, 2500);
    } catch (err) {
        console.error(err);
        addRecipeView.renderError(err.message);
    }

}


const init = function () {
    bookmarksView.addHandlerRender(controlBookmarks);
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark)
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    addRecipeView.addHandlerUpload(controlAddRecipe);

};

init();

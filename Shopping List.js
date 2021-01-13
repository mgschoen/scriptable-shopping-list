// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// always-run-in-app: true; icon-color: deep-purple;
// icon-glyph: shopping-cart;

const _import = (modulePath) => importModule('recipe-shopping-list/' + modulePath);

const { presentAlert } = _import('Utils');
const AgendaClient = _import('AgendaClient');
const ContentfulClient = _import('ContentfulClient');
const IngredientList = _import('IngredientList');
const SelectionTable = _import('SelectionTable');
const {
    CALLBACK_URL_BASE,
    NOTE_TEMPLATE
} = _import('Constants');

// fetch all recipes from Contentful
const contentful = new ContentfulClient({
    accessToken: '<your-contentful-access-token-here>',
    spaceId: '<your-contentful-spaceid-here>',
    environment: 'master'
});
const allRecipes = await contentful.fetchEntries('recipe');

// present full recipes list to user
const recipesTable = new SelectionTable({
    headline: 'Choose recipes',
    subheadline: 'You have the following recipes in your database:',
    data: allRecipes
});
const selectedRecipes = await recipesTable.present();

// build a list of all selected ingredients with their respective amounts
const ingredientList = new IngredientList();
for (let recipe of selectedRecipes) {
    if (!recipe.ingredients ||  !Array.isArray(recipe.ingredients)) {
        console.error('recipe.ingredients field has invalid structure: ' + JSON.stringify(recipe.ingredients));
        continue;
    }
    for (let ingredient of recipe.ingredients) {
        if (!ingredient.id ||  !ingredient.amount) {
            console.error('ingredient has invalid structure: ' + JSON.stringify(ingredient));
            continue;
        }
        const { id, amount } = ingredient;
        ingredientList.addAmount(id, amount);
    }
}
const ingredientIds = ingredientList.ids;
const ingredientData = await contentful.fetchEntries('ingredient', { 'sys.id[in]': ingredientIds.join(',') });
for (let entry of ingredientData) {
    ingredientList.setName(entry._id, entry.title);
}

// setup connection to Agenda app
const agenda = new AgendaClient({ projectTitle: 'Shopping List' });
if (!await agenda.init()) {
    presentAlert('Whoops', 'Failed to connect to Agenda app. Please make sure it is installed');
    return;
}

// assemble note contents
let mealsString = '';
let itemsString = '';
for (let recipe of selectedRecipes) {
    mealsString += `- [ ] ${recipe.title}\n`;
}
for (let ingredientId of ingredientIds) {
    const amountsString = ingredientList.getAmounts(ingredientId).join(' + ');
    const name = ingredientList.getName(ingredientId);
    itemsString += `- [ ] ${amountsString} ${name}\n`;
}
const noteTitle = `Shopping List ${new Date().toLocaleDateString()}`;
const noteContent = NOTE_TEMPLATE
    .replace('%%meals%%', mealsString)
    .replace('%%items%%', itemsString);

// write note to Agenda
const noteId = await agenda.writeNote(noteTitle, noteContent);
if (!noteId) {
    presentAlert('Oh noes', 'Could not create note');
    return;
}

presentAlert('Success', 'Created note with ID ' + noteId);
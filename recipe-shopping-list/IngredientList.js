module.exports = class IngredientList {
    constructor() {
        this.ingredients = new Map();
    }

    addAmount(ingredientId, amount) {
        if (this.ingredients.get(ingredientId)) {
            this.ingredients.get(ingredientId).amounts.push(amount);
        } else {
            this.ingredients.set(ingredientId, {
                amounts: [amount]
            });
        }
    }

    setName(ingredientId, name) {
        if (this.ingredients.get(ingredientId)) {
            this.ingredients.get(ingredientId).name = name;
        } else {
            this.ingredients.set(ingredientId, {
                amounts: [],
                name
            });
        }
    }

    getName(ingredientId) {
        return this.ingredients.get(ingredientId).name;
    }

    getAmounts(ingredientId) {
        return this.ingredients.get(ingredientId).amounts;
    }

    get ids() {
        return Array.from(this.ingredients.keys());
    }
}
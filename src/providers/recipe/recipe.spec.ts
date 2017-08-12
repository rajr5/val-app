import { Ingredient, Recipe } from "../../models/recipe.model";
import { IngredientMatcher } from "./recipe";

describe("ingredient matcher", () => {
  beforeEach(() => {
    this.matcher = new IngredientMatcher();
    this.ingredients = [
      new Ingredient({
        id: "chickenId",
        name: "Chicken Breast",
        servingSize: 4,
        servingUnit: "ounce",
        containerCost: 2.0,
        servingsPerContainer: 4,
        sourceUrl: "https://amazon.com/chicken",
        tags: "chicken breast, chicken"
      }),
      new Ingredient({
        id: "baconId",
        name: "Bacon",
        servingSize: 1,
        servingUnit: "each",
        containerCost: 5.25,
        servingsPerContainer: 16,
        sourceUrl: "https://amazon.com/bacon",
        tags: "bacon"
      }),
      new Ingredient({
        id: "saltId",
        name: "Kosher Salt",
        servingSize: 1,
        servingUnit: "teaspoon",
        containerCost: 3.99,
        servingsPerContainer: 60,
        sourceUrl: "https://amazon.com/salt",
        tags: "salt, kosher salt"
      }),
    ];
  });

  it("true aint true", () => expect(true).toBe(true));

  it("match single ingredient", () => {
    let recipe = new Recipe({
      id: "recipe1",
      name: "Baked Chicken Breast",
      description: "plain baked chicken breast",
      instructions: "place in oven\nwait a bit",
      ingredients: "8 oz chicken breast",
      servings: 2,
    });

    let matches = this.matcher.matchIngredients(recipe, this.ingredients);
    expect(matches.length).toEqual(1);
    expect(matches[0].length).toEqual(1);
    expect(matches[0][0].originalText).toEqual(recipe.ingredients);
    expect(matches[0][0].ingredientId).toEqual("chickenId");
    expect(matches[0][0].servings).toEqual(2);
  });

  it("match eaches correctly", () => {
    let recipe = new Recipe({
      id: "recipe1",
      name: "Fried Bacon",
      description: "bacon + pan",
      instructions: "place in pan\nflip once",
      ingredients: "16 slices of bacon",
      servings: 4,
    });

    let matches = this.matcher.matchIngredients(recipe, this.ingredients);
    expect(matches.length).toEqual(1);
    expect(matches[0].length).toEqual(1);
    expect(matches[0][0].originalText).toEqual(recipe.ingredients);
    expect(matches[0][0].ingredientId).toEqual("baconId");
    expect(matches[0][0].servings).toEqual(16);
  });

  it("match multi part numbers", () => {
    let recipe = new Recipe({
      id: "recipe1",
      name: "Some salt",
      description: "just plain old salt",
      instructions: "pour out salt\nthere is no step two",
      ingredients: "1 1/2 tsp of salt",
      servings: 3,
    });

    let matches = this.matcher.matchIngredients(recipe, this.ingredients);
    // console.log(matches[0][0]);
    expect(matches.length).toEqual(1);
    expect(matches[0].length).toEqual(1);
    expect(matches[0][0].originalText).toEqual(recipe.ingredients);
    expect(matches[0][0].ingredientId).toEqual("saltId");
    expect(matches[0][0].servings).toEqual(1.5);
  });

  it("handle no space between number and unit", () => {
    let recipe = new Recipe({
      id: "recipe1",
      name: "Baked Chicken Breast",
      description: "plain baked chicken breast",
      instructions: "place in oven\nwait a bit",
      ingredients: "8oz chicken breast",
      servings: 1,
    });

    let matches = this.matcher.matchIngredients(recipe, this.ingredients);
    // console.log(matches[0][0]);
    expect(matches.length).toEqual(1);
    expect(matches[0].length).toEqual(1);
    expect(matches[0][0].originalText).toEqual(recipe.ingredients);
    expect(matches[0][0].ingredientId).toEqual("chickenId");
    expect(matches[0][0].servings).toEqual(2);
  });

  it("match pinch of salt", () => {
    let recipe = new Recipe({
      id: "recipe1",
      name: "Some salt",
      description: "just plain old salt",
      instructions: "pour out salt\nthere is no step two",
      ingredients: "a pinch of salt",
      servings: 3,
    });

    let matches = this.matcher.matchIngredients(recipe, this.ingredients);
    expect(matches.length).toEqual(1);
    expect(matches[0].length).toEqual(1);
    expect(matches[0][0].originalText).toEqual(recipe.ingredients);
    expect(matches[0][0].ingredientId).toEqual("saltId");
  });

  it("ignore preparation", () => {
    let recipe = new Recipe({
      id: "recipe1",
      name: "Chopped Bacon",
      description: "bacon, but chopped up!",
      instructions: "chop up bacon\nput in pan\nfry",
      ingredients: "16 slices of bacon, chopped",
      servings: 4,
    });

    let matches = this.matcher.matchIngredients(recipe, this.ingredients);
    expect(matches.length).toEqual(1);
    expect(matches[0].length).toEqual(1);
    expect(matches[0][0].originalText).toEqual(recipe.ingredients);
    expect(matches[0][0].ingredientId).toEqual("baconId");
  });

  it("handle numerical fractions", () => {
    let recipe = new Recipe({
      id: "recipe1",
      name: "Some salt",
      description: "just plain old salt",
      instructions: "pour out salt\nthere is no step two",
      ingredients: "1/2 tsp of salt",
      servings: 1,
    });

    let matches = this.matcher.matchIngredients(recipe, this.ingredients);
    expect(matches.length).toEqual(1);
    expect(matches[0].length).toEqual(1);
    expect(matches[0][0].originalText).toEqual(recipe.ingredients);
    expect(matches[0][0].ingredientId).toEqual("saltId");
    expect(matches[0][0].servings).toEqual(0.5);
  });

  it("handle unicode fractions", () => {
    let recipe = new Recipe({
      id: "recipe1",
      name: "Some salt",
      description: "just plain old salt",
      instructions: "pour out salt\nthere is no step two",
      ingredients: "½ tsp of salt",
      servings: 1,
    });

    let matches = this.matcher.matchIngredients(recipe, this.ingredients);
    expect(matches.length).toEqual(1);
    expect(matches[0].length).toEqual(1);
    expect(matches[0][0].originalText).toEqual(recipe.ingredients);
    expect(matches[0][0].ingredientId).toEqual("saltId");
    expect(matches[0][0].servings).toEqual(0.5);
  });

  it("handle conversion between ounces and lbs", () => {
    let recipe = new Recipe({
      id: "recipe1",
      name: "Baked Chicken Breast",
      description: "plain baked chicken breast",
      instructions: "place in oven\nwait a bit",
      ingredients: "1 lb chicken breast",
      servings: 4,
    });

    let matches = this.matcher.matchIngredients(recipe, this.ingredients);
    expect(matches.length).toEqual(1);
    expect(matches[0].length).toEqual(1);
    expect(matches[0][0].originalText).toEqual(recipe.ingredients);
    expect(matches[0][0].ingredientId).toEqual("chickenId");
    expect(matches[0][0].servings).toEqual(4);
  });

  it("handle conversion between tsp and tbsp", () => {
    let recipe = new Recipe({
      id: "recipe1",
      name: "Some salt",
      description: "just plain old salt",
      instructions: "pour out salt\nthere is no step two",
      ingredients: "1 tbsp of salt",
      servings: 1,
    });

    let matches = this.matcher.matchIngredients(recipe, this.ingredients);
    expect(matches.length).toEqual(1);
    expect(matches[0].length).toEqual(1);
    expect(matches[0][0].originalText).toEqual(recipe.ingredients);
    expect(matches[0][0].ingredientId).toEqual("saltId");
    // tsp to tablespoons
    expect(matches[0][0].servings).toEqual(3);
  });

  it("do not handle conversions we cannot make", () => {
    let recipe = new Recipe({
      id: "recipe1",
      name: "Liquid Chicken",
      description: "i do not even want to think about it",
      instructions: "liquiefy the chicken",
      ingredients: "20 fluid ounces of chicken",
      servings: 4,
    });

    let matches = this.matcher.matchIngredients(recipe, this.ingredients);
    // console.log("CANNOT MAKE", matches);
    expect(matches.length).toEqual(1);
    expect(matches[0].length).toEqual(1);
    expect(matches[0][0]).toBeUndefined();
  });

  it("match unit map keys, not just values", () => {
    let recipe = new Recipe({
      id: "recipe1",
      name: "Teaspoon Salt",
      description: "mmmm",
      instructions: "pour directly into mouth",
      ingredients: "1/2 teaspoon salt",
      servings: 1,
    });

    let matches = this.matcher.matchIngredients(recipe, this.ingredients);
    expect(matches.length).toEqual(1);
    expect(matches[0].length).toEqual(1);
    expect(matches[0][0].originalText).toEqual(recipe.ingredients);
    expect(matches[0][0].ingredientId).toEqual("saltId");
    expect(matches[0][0].servings).toEqual(0.5);
  });

  it("handle no unit and amount", () => {
    let recipe = new Recipe({
      id: "recipe1",
      name: "Teaspoon Salt",
      description: "mmmm",
      instructions: "pour directly into mouth",
      ingredients: "salt",
      servings: 1,
    });

    let matches = this.matcher.matchIngredients(recipe, this.ingredients);
    expect(matches.length).toEqual(1);
    expect(matches[0].length).toEqual(1);
    expect(matches[0][0].originalText).toEqual(recipe.ingredients);
    expect(matches[0][0].ingredientId).toEqual("saltId");
    expect(matches[0][0].servings).toEqual(1);
  });
});

import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import "rxjs/add/operator/map";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { AppSettings } from "../../config";
import { allUnitsMap, Ingredient, IngredientMatch, Recipe, Unit } from "../../models/recipe.model";
import SetManipulator from "../../set";

// TODO: move to our std lib
const flatten = list => list.reduce(
  (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

/*
  Generated class for the RecipeProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class RecipeProvider {
  public recipes = new BehaviorSubject<Recipe[]>([]);
  public ingredients = new BehaviorSubject<Ingredient[]>([]);
  private ingredientMap: any = {};

  private recipeUrl = AppSettings.API_ENDPOINT + "recipes";
  private ingredientUrl = AppSettings.API_ENDPOINT + "ingredients";
  private ingredientMatcher: IngredientMatcher;

  constructor (private http: Http) {
    this.ingredientMatcher = new IngredientMatcher();
    this.refreshRecipes();
    this.refreshIngredients();
  }

  public saveRecipe(recipe) {
    // console.log("saving", recipe);
    let sub = this.http.post(this.recipeUrl, recipe);
    sub.subscribe(() => {
      this.refreshRecipes();
    });
    return sub;
  }

  public updateRecipe(data) {
    let sub = this.http.put(this.recipeUrl + "/" + data.id, data);
    sub.subscribe(() => {
      this.refreshRecipes();
    });
    return sub;
  }

  public deleteRecipe(id: string) {
    // console.log("deleting recipe", id);
    let sub = this.http.delete(this.recipeUrl + "/" + id);
    sub.subscribe(() => {
      this.refreshRecipes();
    });
    return sub;
  }

  public refreshRecipes() {
    this.fetchRecipes().subscribe((recipes) => {
      let newRecipes = recipes.map((recipeData) => {
        let recipe = new Recipe(recipeData);
        return recipe;
      });
      this.recipes.next(newRecipes);
    });
  }

  public saveIngredients(ingredients: any) {
    let sub = this.http.post(this.ingredientUrl, {ingredients: ingredients});
    sub.subscribe(() => {
      this.refreshIngredients();
    });
    return sub;
  }

  public deleteIngredient(id: string) {
    let sub = this.http.delete(this.ingredientUrl + "/" + id);
    sub.subscribe(() => {
      this.refreshIngredients();
    });
    return sub;
  }

  public refreshIngredients() {
    this.fetchIngredients().subscribe((i) => {
      let ingredients = i.map((d) => new Ingredient(d));
      for (let ingredient of ingredients) {
        this.ingredientMap[ingredient.id] = ingredient;
      }
      this.ingredients.next(ingredients);
    });
  }

  public matchIngredients(recipes: Recipe[] = null) {
    if (!this.ingredients || !this.recipes) return;
    if (recipes === null) recipes = this.recipes.getValue();
    for (let recipe of recipes) {
      this.ingredientMatcher.matchIngredients(recipe, this.ingredients.getValue());
    }
  }

  public matchIngredient(ingredient: string): IngredientMatch[] {
    return this.ingredientMatcher.matchIngredient(ingredient);
  }

  public saveMatch(recipe: Recipe, originalText: string, match: IngredientMatch) {
    try {
      recipe.addMatch(match);
    } catch (e) {
      console.warn(e);
      return;
    }
    // console.log(this.ingredientMap);
    recipe.calculateCalories(this.ingredientMap);
    recipe.calculateCost(this.ingredientMap);
    this.updateRecipe(recipe).subscribe(() => {
      // console.log("saved recipe", recipe);
    });
  }

  private fetchIngredients(): Observable<any> {
    return this.http.get(this.ingredientUrl)
      .map(this.extractIngredients.bind(this))
      .catch(this.apiError);
  }

  private fetchRecipes(): Observable<Recipe[]> {
    return this.http.get(this.recipeUrl)
        .map(this.extractRecipes.bind(this))
        .catch(this.apiError);
  }

  private extractRecipes(res: Response): Recipe[] {
    let body = res.json();
    let recipes = [];
    for (let rd of body.recipes) {
      let recipe = new Recipe(rd);
      recipes.push(recipe);
    }
    // console.log("Recipes: ", recipes);
    return recipes;
  }

  private extractIngredients(res: Response): Ingredient[] {
    let body = res.json();
    let ingredients = [];
    for (let i of body.ingredients) {
      let ingredient = new Ingredient(i);
      ingredients.push(ingredient);
    }
    // console.log("Ingredients", ingredients);
    return ingredients;
  }

  private apiError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || "";
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(`Base API Error: ${errMsg} ${error.stack}`);
    return [];
  }
}

export class IngredientMatcher {
  private sets: SetManipulator;
  private ingredients: Ingredient[];

  constructor() {
    this.sets = new SetManipulator(undefined);
  }

  public matchIngredients(recipe: Recipe, ingredients: Ingredient[]): IngredientMatch[][] {
    this.ingredients = ingredients;
    // First, find all possible matches for each ingredient
    // If there's only one, accept that ingredient. If there's multiple, the
    // user will have to choose. If none, the user will have to edit the recipe
    // and match again (for simplicity).
    return recipe.splitIngredients()
      .map((i) => this.matchIngredient(i));
  }

  public matchIngredient(ingredientName: string): IngredientMatch[] {
    let normalizedName = this.normalizeIngredient(ingredientName);
    let amount = this.getAmount(normalizedName);
    let unit: Unit;
    if (amount) {
      unit = this.getUnit(normalizedName);
    } else {
      unit = new Unit("each");
    }
    let name = this.getName(normalizedName, amount, unit);
    let ingredients = this.matchName(name) || [];
    // console.log('creating ingredient matches for', name, amount, unit)
    if (!unit) {
      console.warn(`could not find unit for ${ingredientName}`);
      return [];
    }

    let choices = ingredients.map((ingredient: Ingredient) => {
      let servings: number;
      try {
        // e.g. 8oz of chicken breast required, ingredient is .25lbs of chicken breast = 2 servings
        if (unit.name === "each" && !amount) {
          // In the case of something like "Kosher Salt" as an ingredient, simply use the default serving size
          servings = 1;
        } else {
          servings = amount * unit.conversionFactor(ingredient.getServingUnit(), ingredient.servingSize);
        }
      } catch (e) {
        console.warn("unit converstion error: ", e);
        return undefined;
      }

      return {
        ingredientId: ingredient.id,
        servings: servings,
        originalText: ingredientName
      };
    });
    return choices;
  }

  private getAmount(ingredient: string): number {
    let tokens = ingredient.split(" ");
    if (tokens.length === 0) {
      return undefined;
    }

    let fractionRegex = /\d{1,2}\/\d{1,2}/;
    let amount = 0;
    if (fractionRegex.exec(tokens[0]) && tokens[0].fractionToNumber()) {
      amount += tokens[0].fractionToNumber();
    } else if (parseInt(tokens[0])) {
      amount += parseInt(tokens[0]);
    }
    if (tokens.length > 1 && fractionRegex.exec(tokens[1]) && tokens[1].fractionToNumber()) {
      amount += tokens[1].fractionToNumber();
    } else if (tokens.length > 1 && parseInt(tokens[1])) {
      amount += parseInt(tokens[1]);
    }

    if (amount) {
      return amount;
    } else {
      console.warn(`Multiple matches for ingredient ${ingredient}`);
      // throw new Error("Multiple matches for con")
    }
  }

  private getUnit(ingredient: string): Unit {
    let tokens = ingredient.split(" ");
    // Filter out units form each token
    tokens = tokens.map((t) => t.replace(/[\d/\.]+/g, ""));
    let candidates = [];

    // Check for the presence of each possible unit spelling/representation in the ingredient
    for (let unit of Object.keys(allUnitsMap)) {
      if (tokens.indexOf(unit) >= 0) {
        candidates.push(new Unit(unit));
        break;
      }
    }

    // TODO: make the special casing for multi word units better
    if (ingredient.indexOf("fluid ounce") > -1) {
      candidates.push(new Unit("fluid ounce"));
    } else if (ingredient.indexOf("fl oz") > -1)  {
      candidates.push(new Unit("fl oz"));
    }

    if (candidates.length === 0) {
      return undefined;
    } else if (candidates.length === 1) {
      return candidates[0];
    } else if (candidates.length === 2 &&
        candidates.filter((c) => c.name === "fluid ounce").length === 1 &&
        candidates.filter((c) => c.name === "ounce").length === 1) {
          return candidates.filter((c) => c.name === "fluid ounce")[0];
    } else {
      throw new Error(`Cannot decide unit for ${ingredient}, found multiple options: ${candidates.map((c) =>
        c.name)}`);
    }
  }

  private getName(ingredient: string, amount: number, unit: Unit): string {
    // Use unit to split the ingredient string, rest is the name, hopefully
    let name;
    if (amount && unit) {
      name = ingredient.split(unit.originalName)[1];
    } else if (amount && !unit) {
      name = ingredient.split(" ").slice(1).join(" ");
    } else {
      name = ingredient;
    }
    return this.filterName(name);
  }

  // Filter out some garbage that doesn't help, like 'to taste'
  private filterName(name: string): string {
    let uselessTokens = ["to taste", ",", "."];
    for (let phrase of uselessTokens) {
      name = name.replace(phrase, "");
    }
    return name;
  }

  private matchName(ingredientName: string): Ingredient[] {
    if (!this.ingredients) return;
    let matches = {};
    let nameTokens = this.prepareTags(ingredientName);
    for (let ingredient of this.ingredients) {
      let tagTokens = [];
      for (let tag of this.prepareTags(ingredient.tags)) {
        for (let token of tag.split(" ")) {
          tagTokens.push(token);
        }
      }
      let union = this.sets.intersection(tagTokens, nameTokens, undefined) as string[];
      if (!matches[union.length]) matches[union.length] = [];
      matches[union.length].push(ingredient);
    }
    let winnerIndex = Object.keys(matches).sort().reverse()[0];
    if (winnerIndex === "0") return [];
    let winners = matches[winnerIndex];
    return winners;
  }

  // Given a string of tags, or string of comma separated tags, return individiual tags
  private prepareTags(tags: string): string[] {
    let split = tags.split(",")
      .map((t) => t.split(" "));
    let flattened = flatten(split);
    let finished = flattened.map((t) => t.toLowerCase())
      .filter((t) => t !== "");
    return finished;
  }

  private normalizeIngredient(ingredient: string): string {
    ingredient = ingredient.toStringFraction();

    // Replace pinch with 1/8 tsp. According to Wikipedia, this used to be the prcise definition
    // of 'a pinch'. Plus it is easier to handle.
    ingredient = ingredient.replace("a pinch", "1/8 tsp");
    ingredient = ingredient.replace("pinch", "1/8 tsp");
    return ingredient;
  }
}

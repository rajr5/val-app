import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import "rxjs/add/operator/map";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { AppSettings } from "../config";
import { allUnitsMap, Ingredient, IngredientMatch, Recipe, Unit } from "../models/recipe.model";
import SetManipulator from "../set";

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

  constructor (private http: Http) {
    this.refreshRecipes();
    this.refreshIngredients();
  }

  public saveRecipe(recipe) {
    recipe.ingredients = recipe.ingredientString.split('\n');
    recipe.instructions = recipe.instructionString.split('\n');
    return this.http.post(this.recipeUrl, recipe)
      .map((data: Response) => this.refreshRecipes())
      .catch(this.apiError);
  }

  public updateRecipe(recipe) {
    recipe.ingredients = recipe.ingredientString.split('\n');
    recipe.instructions = recipe.instructionString.split('\n');
    return this.http.put(this.recipeUrl + "/" + recipe._id, recipe)
      .map((data: Response) => this.refreshRecipes())
      .catch(this.apiError);
  }

  public deleteRecipe(id: string) {
    // console.log("deleting recipe", id);
    return this.http.delete(this.recipeUrl + "/" + id)
      .map(() => this.refreshRecipes());
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

  public saveIngredient(ingredient: any) {
    return this.http.post(this.ingredientUrl, ingredient)
      .map(() => {
        this.refreshRecipes();
        this.refreshIngredients();
      });
  }

  public deleteIngredient(id: string) {
    return this.http.delete(this.ingredientUrl + "/" + id)
      .map(() => this.refreshIngredients());
  }

  public refreshIngredients() {
    this.fetchIngredients().subscribe((i) => {
      let ingredients = i.map((d) => new Ingredient(d));
      for (let ingredient of ingredients) {
        this.ingredientMap[ingredient._id] = ingredient;
      }
      this.ingredients.next(ingredients);
    });
  }

  public matchIngredients(recipe: Recipe): Observable<IngredientMatch[]> {
    return this.http.get(this.recipeUrl + `/${recipe._id}/ingredientMatches`)
      .map(this.extractMatches.bind(this))
      .catch(this.apiError)
  }

  public matchIngredient(recipe: Recipe, originalText: string): Observable<IngredientMatch[]> {
    return this.matchIngredients(recipe).map((matches: IngredientMatch[]) => {
      console.log('filtering matches', matches)
      return matches.filter((match) => match.originalText === originalText);
    });
  }

  public saveMatch(recipe: Recipe, originalText: string, match: IngredientMatch) {
    console.log("saving match", match)
    return this.http.post(this.recipeUrl + "/" + recipe._id + "/saveMatch", match)
      .map((data: Response) => this.refreshRecipes())
      .catch(this.apiError)
      .subscribe(() => this.refreshRecipes());
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
      // console.log('found recipe', recipe)
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

  private extractMatches(res: Response): IngredientMatch[] {
    return res.json();
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

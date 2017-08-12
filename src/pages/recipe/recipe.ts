import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";

import { Recipe } from "../../models/recipe.model";
import { AuthProvider } from "../../providers/auth/auth";
import { RecipeProvider } from "../../providers/recipe/recipe";
import { ChooseIngredientPage } from "./choose-ingredient";
import { NewRecipePage } from "./new-recipe";

@Component({
  templateUrl: "recipe.html",
})
export class RecipePage {
  public recipe: Recipe;

  constructor(private navCtrl: NavController, public params: NavParams, private recipeService: RecipeProvider,
      private auth: AuthProvider) {
    this.recipe = params.get("recipe");
  }

  edit() {
    this.navCtrl.push(NewRecipePage, {recipe: this.recipe});
  }

  showChoosePage(ingredient: string) {
    if (this.auth.isAuthenticated()) {
      this.navCtrl.push(ChooseIngredientPage, {ingredient: ingredient, recipe: this.recipe});
    }
  }

  fixMatches() {
    // console.log("Fix matches");
  }

  getMatchLine(index: number): string {
    let match = this.recipe.ingredientMatches[index];
    if (!match) {
      return "";
    }
    let ingredient = this.recipeService.ingredients.getValue().find((i) => i.id === match.ingredientId);
    if (!ingredient) {
      console.warn(`could not find ingredient with id ${match.ingredientId}`);
      return "";
    }
    let cals = ingredient.calories * match.servings;
    let cost = (ingredient.containerCost / ingredient.servingsPerContainer * match.servings).toFixed(2);
    let defaultString = `${cals} cals/$${cost}`;
    if (this.auth.isAuthenticated()) {
      // Debugging info
      defaultString += ` (${match.servings} servings})`;
    }
    return defaultString;
  }
}

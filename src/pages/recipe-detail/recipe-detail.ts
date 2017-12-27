import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

import { Recipe } from "../../models/recipe.model";
import { AuthProvider } from "../../providers/auth.provider";
import { RecipeProvider } from "../../providers/recipe.provider";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

/**
 * Generated class for the RecipeDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage({
  name: 'RecipeDetail',
  segment: 'recipe/:recipeId',
  defaultHistory: ['RecipeHomePage'],
})
@Component({
  selector: 'page-recipe-detail',
  templateUrl: 'recipe-detail.html',
})
export class RecipeDetailPage {
  recipe;

  constructor(private navCtrl: NavController, public params: NavParams, private recipeService: RecipeProvider,
    private auth: AuthProvider) {
    let recipeId = params.get("recipeId");
    this.recipe = recipeService.recipes.subscribe((recipes: Recipe[]) => {
      console.log("recipes", recipes);
      let recipe = recipes.find((r) => r._id === recipeId);
      console.log("REICPE", recipe)
      return recipe;
    });
  }

  edit() {
    this.navCtrl.push("RecipeNewRecipe", {recipe: this.recipe});
  }jjkk;lkj

  showChoosePage(ingredient: string) {
    if (this.auth.isAuthenticated()) {
      this.navCtrl.push("RecipeChooseIngredient", {ingredient: ingredient, recipe: this.recipe});
    }
  }

  fixMatches() {
    // console.log("Fix matches");
  }

  getMatchLine(index: number): string {
    let match = this.recipe.ingredientMatches[index];
    if (!match) {
      return '';
    }
    let ingredient = this.recipeService.ingredients.getValue().find((i) => i._id === match.ingredientId);
    if (!ingredient) {
      console.warn(`could not find ingredient with id ${match.ingredientId}`);
      return '';
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

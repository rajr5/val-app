import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component, Input } from "@angular/core";

import { NavController } from "ionic-angular";

import { Recipe } from "../../models/recipe.model";
import { ChooseIngredientPage } from "../../pages/recipe/choose-ingredient";
import { NewRecipePage } from "../../pages/recipe/new-recipe";
// import { RecipePage } from "../../pages/recipe/recipe";
import { AuthProvider } from "../../providers/auth.provider";
import { RecipeProvider } from "../../providers/recipe.provider";

@Component({
  selector: "recipe-card",
  templateUrl: "./recipe-card.component.html",
  providers: [RecipeProvider],
  animations: [
    trigger("accordion", [
      state("shown", style({
        maxHeight: "1000px"
      })),
      state("hidden", style({
        display: "none",
        maxHeight: "0px",
      })),
      transition("shown => hidden", animate("300ms linear")),
      transition("hidden => shown", animate("300ms linear"))
    ]),
  ]
})
export class RecipeCardComponent {
  @Input() recipe: Recipe;

  public showIngredientsState = "hidden";
  public showInstructionsState = "hidden";

  constructor(private navCtrl: NavController, private recipeService: RecipeProvider, private auth: AuthProvider) {
  }

  edit() {
    this.navCtrl.push(NewRecipePage, { recipe: this.recipe });
  }

  goToRecipePage() {
    this.navCtrl.push('RecipeDetail', { recipeId: this.recipe._id });
  }

  showChoosePage(ingredient: string) {
    if (this.auth.isAuthenticated()) {
      this.navCtrl.push(ChooseIngredientPage, { ingredient: ingredient, recipe: this.recipe });
    }
  }

  getMatchLine(index: number): string {
    let match = this.recipe.ingredientMatches[index];
    if (!match) {
      return "";
    }
    let ingredient = this.recipeService.ingredients.getValue().find((i) => i._id === match.ingredientId);
    if (!ingredient) {
      // console.warn(`could not find ingredient with id ${match.ingredientId}`);
      return "";
    }
    let cals = ingredient.calories * match.servings;
    let cost = (ingredient.containerCost / ingredient.servingsPerContainer * match.servings).toFixed(2);
    let defaultString = `${cals} cals/$${cost}`;
    if (this.auth.isAuthenticated()) {
      // Debugging info
      defaultString += ` (${match.servings} servings)`;
    }
    return defaultString;
  }
}

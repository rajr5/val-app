import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component, Input } from "@angular/core";

import { NavController } from "ionic-angular";

import { Recipe } from "../../models/recipe.model";
import { ChooseIngredientPage } from "../../pages/recipe/choose-ingredient";
import { NewRecipePage } from "../../pages/recipe/new-recipe";
import { AuthProvider } from "../../providers/auth/auth";
import { RecipeProvider } from "../../providers/recipe/recipe";

@Component({
  selector: "recipe",
  templateUrl: "./recipe.component.html",
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
export class RecipeComponent {
  @Input() recipe: Recipe;

  public showIngredientsState = "hidden";
  public showInstructionsState = "hidden";

  constructor(private navCtrl: NavController, private recipeService: RecipeProvider, private auth: AuthProvider) {
  }

  edit() {
    this.navCtrl.push(NewRecipePage, { recipe: this.recipe });
  }

  toggleShow(card: string) {
    if (card === "ingredients") {
      this.showIngredientsState = this.showIngredientsState === "shown" ? "hidden" : "shown";
    } else {
      this.showInstructionsState = this.showInstructionsState === "shown" ? "hidden" : "shown";
    }
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
      defaultString += ` (${match.servings} servings)`;
    }
    return defaultString;
  }
}
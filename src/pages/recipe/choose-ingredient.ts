import { Component } from "@angular/core";
import { NavController, NavParams, ViewController } from "ionic-angular";

import { Ingredient, Recipe, IngredientMatch } from "../../models/recipe.model";
import { RecipeProvider } from "../../providers/recipe.provider";
import { NewIngredientPage } from "./new-ingredient";

/*
  Generated class for the Recipe page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: "choose-ingredient.html",
})
export class ChooseIngredientPage {
  public originalText: string;
  public recipe: Recipe;
  public ingredientMap: any = {}; // id: Ingredient
  public choices: any = [];
  private ingredientSub: any;

  constructor(private viewCtrl: ViewController, private navCtrl: NavController, public params: NavParams,
    private recipeService: RecipeProvider) {
    this.originalText = params.get("ingredient");
    this.recipe = params.get("recipe");
    let index = this.recipe.ingredients.findIndex((i) => i === this.originalText);
    // TODO this is super fragile. This data structure should be {originalText: [choices]} rather
    // than [[choices]]
    this.recipeService.matchIngredients(this.recipe).subscribe((matches: IngredientMatch[]) => {
      this.choices = matches[index];
    });
  }

  public choose(choice: IngredientMatch) {
    console.log('i choose you!', choice)
    this.recipeService.saveMatch(this.recipe, this.originalText, choice);
    this.viewCtrl.dismiss();
  }

  public addIngredient() {
    this.navCtrl.push(NewIngredientPage);
  }
}

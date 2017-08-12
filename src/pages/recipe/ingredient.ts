import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";

import { Ingredient } from "../../models/recipe.model";
import { AuthProvider } from "../../providers/auth/auth";
import { RecipeProvider } from "../../providers/recipe/recipe";
import { NewIngredientPage } from "./new-ingredient";

/*
  Generated class for the Recipe page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: "ingredient.html",
})
export class IngredientPage {
  public ingredient: Ingredient;

  constructor(private navCtrl: NavController, public params: NavParams, private auth: AuthProvider,
      private recipeService: RecipeProvider) {
    this.ingredient = params.get("ingredient");
  }

  edit() {
    this.navCtrl.push(NewIngredientPage, {ingredient: this.ingredient});
  }
}

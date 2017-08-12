import { Component } from "@angular/core";
import { NavController, NavParams, ViewController } from "ionic-angular";

import { Ingredient, Recipe } from "../../models/recipe.model";
import { RecipeProvider } from "../../providers/recipe/recipe";
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
    this.ingredientSub = recipeService.ingredients.subscribe((ingredients: Ingredient[]) => {
      this.ingredientMap = {};
      for (let ingredient of ingredients) {
        this.ingredientMap[ingredient.id] = ingredient;
      }
      let choices = this.recipeService.matchIngredient(this.originalText);
      // console.log("choices", choices);
      this.choices = choices.filter((choice) => choice !== undefined)
        .map((choice) => {
          // console.log("choice", choice);
          return {
            ingredient: this.ingredientMap[choice.ingredientId],
            match: choice,
          };
        });
    });
  }

  public choose(choice: any) {
    this.recipeService.saveMatch(this.recipe, this.originalText, choice.match);
    this.viewCtrl.dismiss();
  }

  public addIngredient() {
    this.navCtrl.push(NewIngredientPage);
  }
}

import { Component } from "@angular/core";
import { ModalController, NavController, NavParams } from "ionic-angular";

import { Ingredient, Recipe } from "../../models/recipe.model";
import { AuthProvider } from "../../providers/auth/auth";
import { RecipeProvider } from "../../providers/recipe/recipe";
import { IngredientPage } from "./ingredient";
import { NewIngredientPage } from "./new-ingredient";
import { NewRecipePage } from "./new-recipe";
import { RecipePage } from "./recipe";

/*
  Generated class for the Recipe page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: "recipes.html",
})
export class RecipesPage {
  public recipes: Recipe[] = [];
  public ingredients: Ingredient[] = [];
  private subscription;
  private ingredientSubscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,
    public recipeService: RecipeProvider, public auth: AuthProvider) {
    this.subscription = recipeService.recipes.subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
      this.recipeService.matchIngredients();
    });
    this.ingredientSubscription = recipeService.ingredients.subscribe((ingredients: Ingredient[]) => {
      this.ingredients = ingredients;
      this.recipeService.matchIngredients();
    });
  }

  showRecipeForm() {
    this.navCtrl.push(NewRecipePage);
  }

  showIngredientForm() {
    this.navCtrl.push(NewIngredientPage);
  }

  goToRecipe(recipe: Recipe) {
    // console.log("go to recipe", recipe);
    this.navCtrl.push(RecipePage, { recipe: recipe });
  }

  goToIngredient(ingredient: Ingredient) {
    this.navCtrl.push(IngredientPage, { ingredient: ingredient });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.ingredientSubscription.unsubscribe();
  }
}

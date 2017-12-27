import { Component } from "@angular/core";
import { IonicPage, ModalController, NavController, NavParams } from "ionic-angular";

import { Ingredient, Recipe } from "../../models/recipe.model";
import { AuthProvider } from "../../providers/auth.provider";
import { RecipeProvider } from "../../providers/recipe.provider";
import { IngredientPage } from "../recipe/ingredient";
import { NewIngredientPage } from "../recipe/new-ingredient";
import { NewRecipePage } from "../recipe/new-recipe";

/**
 * Generated class for the RecipeHomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage({
  segment: 'recipes'
})
@Component({
  selector: 'page-recipe-home',
  templateUrl: 'recipe-home.html',
})
export class RecipeHomePage {
  public recipes: Recipe[] = [];
  public ingredients: Ingredient[] = [];
  private subscription;
  private ingredientSubscription;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,
    public recipeService: RecipeProvider, public auth: AuthProvider) {
    this.subscription = recipeService.recipes.subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
    });
    this.ingredientSubscription = recipeService.ingredients.subscribe((ingredients: Ingredient[]) => {
      this.ingredients = ingredients;
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
    this.navCtrl.push("recipe-detail", { recipe: recipe });
  }

  goToIngredient(ingredient: Ingredient) {
    this.navCtrl.push(IngredientPage, { ingredient: ingredient });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.ingredientSubscription.unsubscribe();
  }
}

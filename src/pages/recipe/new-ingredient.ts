import { Component } from "@angular/core";
import { Response } from "@angular/http";
import { NavParams, ToastController, ViewController } from "ionic-angular";

import { Ingredient } from "../../models/recipe.model";
import { RecipeProvider } from "../../providers/recipe/recipe";

@Component({
  templateUrl: "new-ingredient.html",
})
export class NewIngredientPage {
  public ingredient = new Ingredient({});

  constructor(public viewCtrl: ViewController, public params: NavParams, private toastCtrl: ToastController,
    private recipeService: RecipeProvider) {
    this.ingredient = params.get("ingredient") || new Ingredient({});
  }

  public deleteIngredient() {
    // console.log("deleting ingredient");
    this.recipeService.deleteIngredient(this.ingredient.id).subscribe((response: Response) =>
      this.finish(response));
  }

  private finish(response: Response) {
    // TODO: Update recipes
    this.viewCtrl.dismiss();
  }

  public cancel() {
    this.viewCtrl.dismiss();
  }

  public saveIngredient(ingredient) {
    if (!ingredient.isValid()) {
      console.warn("invalid ingredient", ingredient);
      this.toast("Ingredient invalid, please try again");
      return;
    }
    // console.log("saving ingredient", ingredient);
    // clone
    let pendingIngredients = [ingredient];
    for (let i of this.recipeService.ingredients.getValue()) {
      if (i.id !== ingredient.id) {
        pendingIngredients.push(i);
      }
    }

    this.recipeService.saveIngredients(pendingIngredients).subscribe((value: Response) => {
      this.toast(`Created ${this.ingredient.name}`);
      this.ingredient = new Ingredient({});
    });
  }

  private toast(str: string) {
    let toast = this.toastCtrl.create({
      message: str,
      duration: 3000,
    });
    toast.present();
  }
}

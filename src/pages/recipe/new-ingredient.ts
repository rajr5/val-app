import { Component } from "@angular/core";
import { Response } from "@angular/http";
import { NavParams, ToastController, ViewController } from "ionic-angular";

import { Ingredient } from "../../models/recipe.model";
import { RecipeProvider } from "../../providers/recipe.provider";

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
    this.recipeService.deleteIngredient(this.ingredient._id).subscribe(() => this.finish());
  }

  private finish() {
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

    this.recipeService.saveIngredient(ingredient).subscribe(() => {
      this.toast(`Created ${this.ingredient.name}`);
      this.ingredient = new Ingredient({});
      this.finish();
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

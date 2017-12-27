import { Component } from "@angular/core";
import { Response } from "@angular/http";
import { NavParams, ViewController } from "ionic-angular";

import { Recipe } from "../../models/recipe.model";
import { RecipeProvider } from "../../providers/recipe.provider";

@Component({
  templateUrl: "new-recipe.html",
})
export class NewRecipePage {
  public newRecipe: Recipe;

  constructor(public viewCtrl: ViewController, public params: NavParams, private recipeService: RecipeProvider) {
    if (!params.get("recipe")) {
      this.newRecipe = new Recipe({});
    } else {
      this.newRecipe = params.get("recipe");
    }
  }

  public saveRecipe() {
    console.log("SAVE RECPIE", this.newRecipe);
    if (this.newRecipe.ingredientString === "") return;
    if (!this.newRecipe._id) {
      console.log('saving new')
      this.recipeService.saveRecipe(this.newRecipe).subscribe((response: Response) => this.finish());
    } else {
      console.log('updating')
      this.recipeService.updateRecipe(this.newRecipe).subscribe((response: Response) => this.finish());
    }
  }

  public deleteRecipe() {
    this.recipeService.deleteRecipe(this.newRecipe._id).subscribe(() => {
      // console.log("Deleted", response);
      this.finish();
    });
  }

  private finish() {
    this.newRecipe = new Recipe({});
    this.viewCtrl.dismiss();
  }

  public cancel() {
    this.viewCtrl.dismiss();
  }
}

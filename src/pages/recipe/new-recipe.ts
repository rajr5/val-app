import { Component } from "@angular/core";
import { Response } from "@angular/http";
import { NavParams, ViewController } from "ionic-angular";

import { Recipe } from "../../models/recipe.model";
import { RecipeProvider } from "../../providers/recipe/recipe";

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
    // console.log("SAVE RECPIE", this.newRecipe);
    if (this.newRecipe.ingredients === "") return;
    if (!this.newRecipe.id) {
      this.recipeService.saveRecipe(this.newRecipe).subscribe((response: Response) => {this.finish(response); });
    } else {
      this.recipeService.updateRecipe(this.newRecipe).subscribe((response: Response) => {this.finish(response); });
    }
  }

  public deleteRecipe() {
    this.recipeService.deleteRecipe(this.newRecipe.id).subscribe((response: Response) => {
      // console.log("Deleted", response);
      this.finish(response);
    });
  }

  private finish(response: Response) {
    this.newRecipe = new Recipe({});
    this.viewCtrl.dismiss();
  }

  public cancel() {
    this.viewCtrl.dismiss();
  }
}

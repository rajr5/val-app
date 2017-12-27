import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecipeNewRecipePage } from './recipe-new-recipe';

@NgModule({
  declarations: [
    RecipeNewRecipePage,
  ],
  imports: [
    IonicPageModule.forChild(RecipeNewRecipePage),
  ],
})
export class RecipeNewRecipePageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecipeNewIngredientPage } from './recipe-new-ingredient';

@NgModule({
  declarations: [
    RecipeNewIngredientPage,
  ],
  imports: [
    IonicPageModule.forChild(RecipeNewIngredientPage),
  ],
})
export class RecipeNewIngredientPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecipeChooseIngredientPage } from './recipe-choose-ingredient';

@NgModule({
  declarations: [
    RecipeChooseIngredientPage,
  ],
  imports: [
    IonicPageModule.forChild(RecipeChooseIngredientPage),
  ],
})
export class RecipeChooseIngredientPageModule {}

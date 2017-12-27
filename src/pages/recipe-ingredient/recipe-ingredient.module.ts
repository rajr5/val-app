import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecipeIngredientPage } from './recipe-ingredient';

@NgModule({
  declarations: [
    RecipeIngredientPage,
  ],
  imports: [
    IonicPageModule.forChild(RecipeIngredientPage),
  ],
})
export class RecipeIngredientPageModule {}

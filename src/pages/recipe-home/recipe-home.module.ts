
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { RecipeComponentsModule } from '../../components/recipe/recipe.module';
import { RecipeHomePage } from './recipe-home';

@NgModule({
  declarations: [
    RecipeHomePage,
  ],
  imports: [
    RecipeComponentsModule,
    IonicPageModule.forChild(RecipeHomePage),
  ],
})
export class RecipesModule {}

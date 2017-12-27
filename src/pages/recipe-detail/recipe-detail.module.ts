import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { RecipeComponentsModule } from '../../components/recipe/recipe.module';
import { RecipeDetailPage } from './recipe-detail';

@NgModule({
  declarations: [
    RecipeDetailPage,

  ],
  imports: [
    RecipeComponentsModule,
    IonicPageModule.forChild(RecipeDetailPage),
  ],
})
export class RecipeDetailPageModule {}

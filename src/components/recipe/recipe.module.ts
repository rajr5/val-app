import { NgModule } from '@angular/core';
import { RecipeComponent } from './recipe.component';
import { RecipeCardComponent } from './recipe-card.component';
import {IonicModule}  from 'ionic-angular';
@NgModule({
  declarations: [RecipeComponent, RecipeCardComponent],
  imports: [IonicModule],
  exports: [RecipeComponent, RecipeCardComponent]
})
export class RecipeComponentsModule { }

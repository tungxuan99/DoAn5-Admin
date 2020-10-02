import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from '../layout/header/header.component';
import { FooterComponent } from '../layout/footer/footer.component';
import { MenuComponent } from '../layout/menu/menu.component';
import { DashbroadComponent } from '../main/dashbroad/dashbroad.component';


export const mainRoutes: Routes = [
  {
      path: '', component: MainComponent,
      children: [
        {
            path: '', component: DashbroadComponent,
        },
      ]
  }
];
@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    DashbroadComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(mainRoutes)
  ],
  exports: [RouterModule],
})
export class MainModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule,  PreloadAllModules } from '@angular/router';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './lib/jwt.interceptor';
import { AuthGuard } from './lib/auth.guard';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';



const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./main/main.module').then((m) => m.MainModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    HttpClientModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }

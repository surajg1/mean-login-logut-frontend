import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './user/signup/signup.component';
import { LoginComponent } from './user/login/login.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './user/auth.guard';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {path:'', component: HomeComponent, canActivate:[AuthGuard]},
  {path : 'signup', component: SignupComponent},
  {path : 'login', component : LoginComponent},
  // {path: 'home', component: HomeComponent, canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }

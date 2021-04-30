import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { TaskViewComponent } from './components/task-view/task-view.component';

const routes: Routes = [
  {path: '', redirectTo: 'lists', pathMatch: "full"},
  {path:"lists", component: TaskViewComponent},
  {path:"lists/:listId", component: TaskViewComponent},
  {path:"sign-in", component: SignInComponent},
  {path:"login", component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

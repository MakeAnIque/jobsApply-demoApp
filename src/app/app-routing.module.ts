import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './employer/login/login.component';
import { PostJobsComponent } from './employer/post-jobs/post-jobs.component';
import { AuthService } from './auth.service';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './employer/sign-up/sign-up.component';
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignUpComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'postjobs',
    component: PostJobsComponent,
    canActivate: [AuthService],
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './employer/login/login.component';
import { PostJobsComponent } from './employer/post-jobs/post-jobs.component';
import { AuthService } from './auth.service';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './employer/sign-up/sign-up.component';
import { ViewJobComponent } from './view-job/view-job.component';
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
    path: '',
    component: HomeComponent,
  },
  {
    path: 'postjobs',
    component: PostJobsComponent,
    canActivate: [AuthService],
  },
  {
    path: 'viewjobs',
    component: ViewJobComponent,
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

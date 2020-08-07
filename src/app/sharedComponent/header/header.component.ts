import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  loginCheck: string;
  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    if (this.authService.isLoggedIn) {
      this.loginCheck = 'Log Out';
    } else {
      this.loginCheck = 'Log In';
    }
  }

  ngOnInit(): void {}
  gotoPostJob(): void {
    this.router.navigate(['/postjobs']);
  }
  gotoJobList(): void {
    this.router.navigate(['/wantjob']);
  }
  logout(): void {
    if (this.authService.isLoggedIn) {
      this.authService.isLoggedIn = false;
      window.localStorage.removeItem('_start_det');
      window.localStorage.removeItem('_start_token');
      this.loginCheck = 'Log In';
      this.router.navigate(['/']);
      this.snackBar.open('Logout successfully', 'close', {
        duration: 5000,
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
  getImageUrl() {
    if (this.authService.demoTest && this.authService.isLoggedIn) {
      if (
        this.authService.demoTest.data[0].EMPLOYERLOGOFILE === '' ||
        !this.authService.demoTest.data[0].EMPLOYERLOGOFILE
      ) {
        return (
          environment.origin + '/uploadFile' + '/staticFiles' + '/avatar.jpg'
        );
      } else {
        return (
          environment.origin +
          '/uploadFile' +
          '/' +
          this.authService.demoTest.data[0].EMPLOYERLOGOFILE
        );
      }
    } else {
      return (
        environment.origin + '/uploadFile' + '/staticFiles' + '/avatar.jpg'
      );
    }
  }
  getEmail() {
    if (this.authService.demoTest && this.authService.isLoggedIn) {
      return this.authService.demoTest.data[0].EMPLOYERMAILID;
    } else {
      return 'No Logged In.';
    }
  }
  getName() {
    if (this.authService.demoTest && this.authService.isLoggedIn) {
      return this.authService.demoTest.data[0].EMPLOYERNAME;
    } else {
      return 'No Logged In.';
    }
  }
  getActive() {
    if (this.authService.isLoggedIn) {
      return true;
    }
  }
}

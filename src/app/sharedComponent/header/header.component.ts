import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    this.router.navigate(['/']);
  }
  logout(): void {
    if (this.authService.isLoggedIn) {
      this.authService.isLoggedIn = false;
      this.router.navigate(['/']);
      this.snackBar.open('Logout successfully', 'close', {
        duration: 5000,
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
}

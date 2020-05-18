import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'SplashBros';
  isAuthenticated: boolean;

  constructor(
      public auth: AuthService
  ) {
  }

  async ngOnInit() {
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'SplashBros';
  isAuthenticated: boolean;
  navstate: String = '';

  constructor(
      public auth: AuthService,
      private router: Router,
      private activatedRoute: ActivatedRoute,
  ) {
  }

  async ngOnInit() {
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.navstate = val.url.slice(1);
        // console.log(this.navstate);
      }
    })

    $(document).ready(function() {

      $('#sidebarCollapse').on('click', function () {
          $('#sidebar').toggleClass('active');
      });

  })
  }
}

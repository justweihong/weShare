import { Component, OnInit, OnChanges } from '@angular/core';
import {Router, ActivatedRoute,  NavigationEnd} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SplashBros';
  path:any;
  //isLoggedin: Boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ){}

  ngOnInit(){
  }
}

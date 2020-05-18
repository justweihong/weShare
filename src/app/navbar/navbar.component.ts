import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
    subscription:Subscription[]=[];
    isLogin:boolean=false;
    userID:any;
    userImg:any;

  constructor(
      public auth: AuthService,
      private router: Router,
      private afs: AngularFirestore,
  ) {
      this.subscription.push(this.auth.getUser().subscribe(user => {
          if (user) {
              this.userID = user.uid;
              this.isLogin = true;
              this.userImg = user.photoURL;
          }
      }))
   }

  ngOnInit(): void {
      
  }

}

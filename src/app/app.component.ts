import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NotificationService } from './services/notification/notification.service';
import { ListingService } from './services/listing/listing.service';
import { AngularFirestore, docChanges } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private NotificationTitle: string = 'Browser Push Notifications!';
  title = 'SplashBros';
  isAuthenticated: boolean;
  navstate: String = '';
  listingCount: any;
  constructor(
    private db: AngularFirestore,
    public auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _notificationService: NotificationService,
    private listingService: ListingService
  ) {
    this._notificationService.requestPermission();
  }

  async ngOnInit() {
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.navstate = val.url.slice(1);
        // console.log(this.navstate);
      }
    })

    $(document).ready(function () {

      $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
      });

    })

    this._notificationService.notifyNewListing();
    this._notificationService.notifyNewRequest();
    
  }

}

import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NotificationService } from './services/notification/notification.service';
import { ListingService } from './services/listing/listing.service';
import { AngularFirestore, docChanges } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { UserService } from './services/user/user.service';

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
  userID: any;

  constructor(
    private db: AngularFirestore,
    public auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _notificationService: NotificationService,
    private listingService: ListingService,
    private notificationService: NotificationService
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


    this.auth.getUser().pipe(take(1)).subscribe(user => {
      if (user) {
        // Get user details.
        this.userID = user.uid;

        this.notificationService.getNotifications(this.userID).subscribe(change => {
          // console.log('change',change);
          change.forEach(data => {
            // console.log('data', data)
            if (data.payload.doc.data()['status'] === 'new notification') {
              let noti: Array<any> = [];
              noti.push({
                'title': data.payload.doc.data()['title'],
                'alertContent': data.payload.doc.data()['description']
              });

              //change status to pushed
              this._notificationService.updateStatus(this.userID, data.payload.doc.data()['ID'], 'pushed');
              this._notificationService.generateNotification(noti);
              
            }
          })
        })
      }
    })



    // this._notificationService.getNotificataionUpdates().subscribe(details => {
    //   var type = details["type"];
    //   console.log(type);
    // })

    $(document).ready(function () {

      $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
      });

    })



    // this._notificationService.notifyNewListing();
    // this._notificationService.notifyNewRequest();
    // this._notificationService.newListingOfferNotification();

  }

}

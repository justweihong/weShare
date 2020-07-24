import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { NavbarService } from '../services/navbar/navbar.service';
import { UserService } from '../services/user/user.service';
import { NotificationService } from '../services/notification/notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @Input() navstate: any;
  subscription: Subscription[] = [];
  isLogin: boolean;
  userID: any;
  userImg: any;
  faBars = faBars;
  notifications: any;
  notificationCount:any;

  constructor(
    public auth: AuthService,
    private router: Router,
    private navbarService: NavbarService,
    private afs: AngularFirestore,
    private notificationService: NotificationService
  ) {

    this.subscription.push(this.auth.getUser().subscribe(user => {
      if (user) {
        this.userID = user.uid;
        this.isLogin = true;
        this.userImg = user.photoURL;

        this.notificationService.getNotificationsValueChanges(this.userID).subscribe(allNoti => {
          // console.log('allNoti',allNoti);
          this.notifications = [];
          // console.log(allNoti)
          allNoti.forEach(noti => {
            // console.log('data', data)
            if (noti['status'] === 'new notification' || noti['status'] === 'pushed') {
              // console.log(noti)
              this.notifications.push(noti);

            }
          })
          this.notificationCount = this.notifications['length'];
        })

      } else {
        this.isLogin = false;
      }
    }))
  }

  ngOnInit(): void {
  }
  timeAgo(timestamp) {
    var delta = Date.now() - timestamp;
    var days = Math.floor(delta / (1000 * 60 * 60 * 24));
    var hours = Math.floor(delta / (1000 * 60 * 60));
    var min = Math.floor(delta / (1000 * 60));
    var sec = Math.floor(delta / (1000));

    if (days < 0) {
      return `now`;
    } else if (days > 14) {

      return `${new Date(timestamp).toLocaleDateString()}`;
    } else if (days) {

      return `${days} days ago`;
    } else if (hours) {

      return `${hours} hours ago`;
    } else if (min) {

      return `${min} mins ago`;
    } else if (sec) {

      return ` seconds ago`;
    } else {
      return `now`;
    }
  }

  toggleSidenav() {
    this.navbarService.sendSidenavToggle();
  }

  showNotifications() {
    alert("This notification service has not been done yet!");
  }

  removeNotification(notificationID) {
    return this.notificationService.removeNotificationForUser(notificationID, this.userID);
  }
}

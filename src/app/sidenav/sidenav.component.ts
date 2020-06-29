import { Component, OnInit, Input, OnDestroy, SimpleChanges } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';
import { take } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { RequestService } from '../services/request/request.service';
import { ListingService } from '../services/listing/listing.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { NavbarService } from '../services/navbar/navbar.service';



@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  @Input() navstate: any;
  subscriptions: Subscription[] = [];
  userID:any;
  displayName:any;
  userEmail:any;
  userImg:any;

  constructor(
    public auth: AuthService,
    private router: Router,
    private userService: UserService,
    public navbarService: NavbarService,
    public requestService: RequestService,
    public listingService: ListingService
  ) { }

  ngOnInit(): void {

      this.auth.getUser().pipe(take(1)).subscribe(user => {
        if (user) {
          // Get user details.
          this.userID = user.uid;
          this.userService.getUser(this.userID).pipe(take(1)).subscribe(firebaseUser => {
              // console.log(firebaseUser);
              this.displayName = firebaseUser['displayName'];
              this.userEmail = firebaseUser['email'];
              this.userImg = firebaseUser['profileImg'];
              // console.log(this.userImg);
          })
        }
      })

      this.subscriptions.push(this.navbarService.getSidenavToggle().pipe().subscribe(() => {
        $('#sidebar').toggleClass('active');
      }));

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges) {

    if (!this.userID) {
      this.auth.getUser().pipe(take(1)).subscribe(user => {
        if (user) {
          // Get user details.
          this.userID = user.uid;
          this.userService.getUser(this.userID).pipe(take(1)).subscribe(firebaseUser => {
              // console.log(firebaseUser);
              this.displayName = firebaseUser['displayName'];
              this.userEmail = firebaseUser['email'];
              this.userImg = firebaseUser['profileImg'];
              console.log(this.userImg);
          })
        }
      })
    }

}

  incompleteFeatureAlert(type) {
    alert(type + " feature has not been created yet!");
  }

}

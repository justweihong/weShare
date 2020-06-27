import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { RequestService } from "../../services/request/request.service";
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
// import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-request-listing',
  templateUrl: './request-listing.component.html',
  styleUrls: ['./request-listing.component.css']
})
export class RequestListingComponent implements OnInit {
  subscriptions: Subscription[] = [];
  @Input() requestID: any;
  userID: any;
  userImg: any;

  // Initilised attributes.
  requestDetails: any;
  creatorDetails: any;
  helperDetails: any;

  constructor(
    public auth: AuthService,
    private requestService: RequestService,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.auth.getUser().pipe(take(1)).subscribe(user => {
      this.userID = user.uid;
      this.userImg = user.photoURL;
    })

    if (this.requestID) {

      // Get request details
      this.subscriptions.push(this.requestService.getRequest(this.requestID).pipe((take(1))).subscribe(request => {
        this.requestDetails = request;
        console.log(this.requestDetails)

        // Get creator data.
        var createdBy = this.requestDetails['createdBy'];
        this.userService.getUser(createdBy).pipe(take(1)).subscribe(user => {
          this.creatorDetails = user;
        })

        // Get helper data.
        if (this.requestDetails['helper'] != "nil") {
          this.userService.getUser(this.requestDetails['helper']).pipe(take(1)).subscribe(helper => {
            this.helperDetails = helper;
          });
        }

      }));
    }
  }

  timeAgo() {
    var timestamp = this.requestDetails['timeStamp'];
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

  acceptRequest() {
    if (confirm("Are you sure you want to help " + this.creatorDetails['displayName'] + "?")) {
      this.closeDetailsModal();
      this.requestService.acceptRequest(this.requestDetails["ID"], this.userID).then(() => {
      });
    }
  }

  unacceptRequest() {
    if (confirm("Are you sure you want to give up helping " + this.creatorDetails['displayName'] + "?")) {
      this.closeDetailsModal();
      this.requestService.unacceptRequest(this.requestDetails["ID"]).then(() => {
      });
    }
  }

  completeRequest() {
    if (confirm("Are you you have completed " + this.creatorDetails['displayName'] + "/'s request")) {
      this.closeDetailsModal();
      this.requestService.completeRequest(this.requestDetails["ID"]).then(() => {
      });
    }
  }

  openDetailsModal() {
    console.log(this.requestDetails)
    $('#request-details-modal').modal('show')
  }

  closeDetailsModal() {
    $('#request-details-modal').modal('hide')
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }


}


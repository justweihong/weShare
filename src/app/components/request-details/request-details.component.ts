import { Component, OnInit } from '@angular/core';
import { Subscription, fromEventPattern } from 'rxjs';
import { RequestService } from '../../services/request/request.service';
import { UserService } from '../../services/user/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { take } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.css']
})
export class RequestDetailsComponent implements OnInit {

    // Creator's request details.
    requestDetailSubscripton: Subscription;
    requestDetails:any;
    creatorDisplayName: any;
    creatorID:any;
    creatorContact: any;
    creatorRoom: any;

    // Current user details.
    displayName: any;
    userID: any;



  constructor(
      public auth: AuthService,
      private requestService: RequestService,
      private userService: UserService,
  ) { 
      // Reload details when a status is changed.
      this.requestService.getDetailUpdates().subscribe(() => {
          this.requestService.getRequest(this.requestDetails['ID']).pipe(take(1)).subscribe(request => {
              this.requestDetails = request;
          })
      })

      // Reload details when opening request card.
      this.requestService.getRequestDetails().subscribe(details => {
          this.requestDetails = details;
          this.userService.getUser(this.requestDetails['createdBy']).pipe(take(1)).subscribe(user => {
            this.creatorID = user['uid'];
            this.creatorDisplayName = user['displayName'];
            this.creatorContact = user['userContact'];
            this.creatorRoom = user['roomDetails'];

        })
      })
  }

  ngOnInit(): void {
    this.auth.getUser().pipe().subscribe(user => {

        // Get user details.
        this.userID = user.uid;
        this.displayName = user.displayName;
    });
  }

  acceptRequest() {
      if (confirm("Are you sure you want to help " + this.creatorDisplayName + "?")) {
          this.requestService.acceptRequest(this.requestDetails["ID"], this.userID);
      }
  }

  unacceptRequest() {
    if (confirm("Are you sure you want to give up helping " + this.creatorDisplayName + "?")) {
        this.requestService.unacceptRequest(this.requestDetails["ID"]);
    }
  }

  completeRequest() {
    if (confirm("Are you you have completed " + this.creatorDisplayName + "/'s request")) {
        this.requestService.completeRequest(this.requestDetails["ID"]);
    }
  }

  
  

}

import { Component, OnInit } from '@angular/core';
import { Subscription, fromEventPattern } from 'rxjs';
import { RequestService } from '../../services/request/request.service';
import { UserService } from '../../services/user/user.service';
import { take } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.css']
})
export class RequestDetailsComponent implements OnInit {
    requestDetailSubscripton: Subscription;
    requestDetails:any;
    displayName: any;


  constructor(
      private requestService: RequestService,
      private userService: UserService,
  ) { 
      this.requestService.getRequestDetails().subscribe(details => {
          this.requestDetails = details;
          this.userService.getUser(this.requestDetails['createdBy']).pipe(take(1)).subscribe(user => {
            this.displayName = user['displayName'];
        })
      })
  }

  ngOnInit(): void {
  }

}

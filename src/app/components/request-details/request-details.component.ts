import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RequestService } from '../../services/request/request.service';
@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.css']
})
export class RequestDetailsComponent implements OnInit {
    requestDetailSubscripton: Subscription;
    requestID: any;
    title:any;
    description:any;

  constructor(
      private requestService: RequestService,
  ) { 
      this.requestService.getRequestDetails().subscribe(details => {
          this.requestID = details['requestID'];
          this.title = details['title'];
          this.description = details['description'];
      })
  }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import  { ListingService } from '../../services/listing/listing.service';

import { take } from 'rxjs/operators';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {
  displayName: any;
  userID: any;

  allListings: any;
  myListings: any;
  wishlist: any;
  ongoingListings:any;
  completedListings:any;



  constructor(
    public auth: AuthService,
    private listingService: ListingService
    ) {
    
   }

  ngOnInit(): void {
    this.auth.user.subscribe(x => {
      this.displayName = x.displayName;
      this.userID = x.uid;
    })
    
    this.allListings = [];
    this.myListings = [];
    this.wishlist = [];
     this.ongoingListings = [];
    this.completedListings = [];


    // this.listingService.getListings().subscribe(x => this.allListings = x);
    this.listingService.getListings().subscribe(listing =>{
      this.myListings = [];
      this.allListings = listing;
      listing.forEach(post => {
          if (post['createdBy'] === this.userID) {
              this.myListings.push(post);
              // console.log("pushed");
          }

          // if (request['status'] == "active") {
          //     this.activeRequests.push(request);
          // } else if (request['status'] == "ongoing") {
          //     this.ongoingRequests.push(request);
          // } else if (request['status'] == "completed") {
          //     this.completedRequests.push(request);
          // } else {
          //     console.error("request ID (" + request['ID'] + ") has invalid status.");
          // }
      })
  })

  }

}

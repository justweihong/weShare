import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ListingService } from '../../services/listing/listing.service';

import { take } from 'rxjs/operators';
import { pipe } from 'rxjs';

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
  // wishlist: any;
  ongoingListings: any;
  completedListings: any;



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
    // this.wishlist = [];
    this.ongoingListings = [];
    this.completedListings = [];


    this.listingService.getListings().subscribe(listing => {
      this.myListings = [];
      this.allListings = listing;
      this.ongoingListings = [];
      
      listing.forEach(post => {
        if (post['createdBy'] === this.userID) {
          this.myListings.push(post);
        }

        
        this.listingService.getListingOffers(post).subscribe(offer => {
          offer.forEach(individualOffer => {
            if (individualOffer['offererID'] === this.userID) {
              function checkPost(input) {
                return input === post;
              }
              var index = this.ongoingListings.findIndex(checkPost);
              if (index != -1) {
                this.ongoingListings[index] = post;
              } else {
                this.ongoingListings.push(post);
              }
              
            }
          });
        })

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

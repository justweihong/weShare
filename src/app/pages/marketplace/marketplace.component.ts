import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ListingService } from '../../services/listing/listing.service';

import { take } from 'rxjs/operators';
import { Subscription, pipe } from 'rxjs';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {
  displayName: any;
  userID: any;
  listingState: any = '';
  subscriptions: Subscription[] = [];

  private _searchBox: string;
  get searchBox(): string {
    return this._searchBox;
  }
  set searchBox(value: string) {
    this._searchBox = value;
    this.filteredAllListings = this.filterAllListings(value);
    this.filteredMyListings = this.filterMyListings(value);
    this.filteredOngoingListings = this.filterOngoingListings(value);
    this.filteredCompletedListings = this.filterCompletedListings(value);
  }

  filteredAllListings: any
  filteredMyListings: any
  filteredOngoingListings: any
  filteredCompletedListings: any

  allListings: any;
  myListings: any;
  ongoingListings: any;
  completedListings: any;



  constructor(
    public auth: AuthService,
    private listingService: ListingService
  ) {

  }

  ngOnInit(): void {

    if (!this.listingState) {
      this.listingState = "all listings";
    }

    this.subscriptions.push(this.listingService.getListingState().pipe().subscribe(details => {
      this.listingState = details["state"];
      // $("#loading-header").show(0).delay(200).hide(0);
      // $(".fade-right").animate({left:"+=20px",opacity:"hide"},0).delay(300).animate({left:"-=20px", opacity:"show"}, 800);
      // console.log(this.listingState)
    }));

    $(document).ready(function() {

    })
    this.auth.user.subscribe(x => {
      this.displayName = x.displayName;
      this.userID = x.uid;
    })

    this.allListings = [];
    this.myListings = [];
    this.ongoingListings = [];
    this.completedListings = [];

    this.listingService.getListings().subscribe(listing => {
      this.myListings = [];
      this.allListings = [];
      this.ongoingListings = [];
      this.completedListings = [];

      listing.forEach(post => {
        if (post['status'] === "active") {
          this.allListings.push(post);
        }

        if (post['createdBy'] === this.userID && post['status'] == "active") {
          this.myListings.push(post);
        }

        if (post['hasOffers'] && post['status'] == "active") {
          if (post['createdBy'] === this.userID) {
            this.ongoingListings.push(post);
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
        }

        if (post['status'] === "completed") {
          this.completedListings.push(post);
        }

      })
      this.filteredAllListings = this.allListings;
      this.filteredMyListings = this.myListings;
      this.filteredOngoingListings = this.ongoingListings;
      this.filteredCompletedListings = this.completedListings;
    })



  }

  filterAllListings(searchBox: string) {
    return this.allListings.filter(listing =>
      (listing['title'].toLowerCase().indexOf(searchBox.toLowerCase()) !== -1) ||
      listing['description'].toLowerCase().indexOf(searchBox.toLowerCase()) !== -1
    )
  }


  filterMyListings(searchBox: string) {
    return this.myListings.filter(listing =>
      (listing['title'].toLowerCase().indexOf(searchBox.toLowerCase()) !== -1) ||
      listing['description'].toLowerCase().indexOf(searchBox.toLowerCase()) !== -1
    )
  }

  filterOngoingListings(searchBox: string) {
    return this.ongoingListings.filter(listing =>
      (listing['title'].toLowerCase().indexOf(searchBox.toLowerCase()) !== -1) ||
      listing['description'].toLowerCase().indexOf(searchBox.toLowerCase()) !== -1
    )
  }

  filterCompletedListings(searchBox: string) {
    return this.completedListings.filter(listing =>
      (listing['title'].toLowerCase().indexOf(searchBox.toLowerCase()) !== -1) ||
      listing['description'].toLowerCase().indexOf(searchBox.toLowerCase()) !== -1
    )
  }

}

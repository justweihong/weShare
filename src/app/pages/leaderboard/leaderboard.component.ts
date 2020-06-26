import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RequestService } from '../../services/request/request.service';
import { ListingService } from '../../services/listing/listing.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  displayName: any;
  userID: any;

  listingCount: any;
  completedListingCount: any;
  // goodSamaritan: any;


  constructor(
    private userService: UserService,
    private auth: AuthService,
    private requestService: RequestService,
    private listingService: ListingService
  ) { }

  ngOnInit(): void {

    this.auth.user.subscribe(usr => {
      this.displayName = usr.displayName;
      this.userID = usr.uid;
    })


    /////////////sorting dictionary function////////////////
    function sortProperties(obj) {
      // convert object into array
      var sortable = [];
      for (var key in obj)
        if (obj.hasOwnProperty(key))
          sortable.push([key, obj[key]]); // each item is an array in format [key, value]

      // sort items by value
      sortable.sort(function (a, b) {
        return b[1] - a[1]; // compare numbers
      });
      return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
    }
    ////////////////////////////////////////////////////

    this.listingCount = {};
    this.completedListingCount = {};

    this.listingService.getListings().subscribe(allListings => {
      this.listingCount = {};
      this.completedListingCount = {};
      allListings.forEach(listing => {
        if (listing['createdBy'] in this.listingCount) {
          this.listingCount[listing['createdBy']] += 1
        } else {
          this.listingCount[listing['createdBy']] = 1
        }

        if (listing['status'] === "completed") {
          if (listing['createdBy'] in this.completedListingCount) {
            this.completedListingCount[listing['createdBy']] += 1
          } else {
            this.completedListingCount[listing['createdBy']] = 1
          }

          if (listing['acceptedByID'] in this.completedListingCount) {
            this.completedListingCount[listing['acceptedByID']] += 1
          } else {
            this.completedListingCount[listing['acceptedByID']] = 1
          }
        }

      })
      console.log(this.completedListingCount);
      var items =  sortProperties(this.completedListingCount)
      console.log(items.slice(0,2));

      //get person count
      //get top 3
      //todo for request

    })





    // this.userService.getListingCount().subscribe(userList => {

    //   this.listingCount = [];

    //   userList.forEach(user => {
    //     this.listingCount.push(user)
    //   })
    // })


    // this.requestService.getRequests().subscribe(all => {
    //   this.goodSamaritan = []
    //   all.forEach(request => {
    //     if (request['status'] === 'completed') {

    //     }
    //   })
    // })
  }

}

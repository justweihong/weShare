import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RequestService } from '../../services/request/request.service';
import { ListingService } from '../../services/listing/listing.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  displayName: any;
  userID: any;
  userListingCount: any;
  userCompletedListingCount: any;
  userCompletedRequestCount: any;

  //dictionary for analytics
  listingCount: any;
  completedListingCount: any;
  completedRequestCount: any;

  //array for output
  listingCountTop3: any;
  completedListingCountTop3: any;
  completedRequestCountTop3:any;



  constructor(
    private userService: UserService,
    private auth: AuthService,
    private requestService: RequestService,
    private listingService: ListingService,
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
    this.completedRequestCount = {};

    this.listingCountTop3 = [];
    this.completedListingCountTop3 = [];
    this.completedRequestCountTop3 = [];

    this.listingService.getListings().subscribe(allListings => {
      this.listingCount = {};
      this.completedListingCount = {};
      //increase each listing creator count by 1 in dictionary
      allListings.forEach(listing => {
        if (listing['createdBy'] in this.listingCount) {
          this.listingCount[listing['createdBy']] += 1
        } else {
          this.listingCount[listing['createdBy']] = 1
        }

        //increase completed listing count for creator and acceptor
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

      // console.log(this.listingCount);
      // console.log(this.completedListingCount);
      // var items =  sortProperties(this.completedListingCount)
      // console.log(items.slice(0,2));

      //get person count
      this.userListingCount = this.listingCount[this.userID];
      this.userCompletedListingCount = this.completedListingCount[this.userID];

      // console.log(this.userListingCount);
      // console.log(this.userCompletedListingCount);


      //get top 3 for listing & completed listing
      this.listingCountTop3 =  sortProperties(this.listingCount).slice(0,3)
      this.completedListingCountTop3 =  sortProperties(this.completedListingCount).slice(0,3)
      // console.log(this.listingCountTop3);
      // console.log(this.completedListingCountTop3);
      
      //set element 2 for each person array to be the display name
      this.listingCountTop3.forEach(element => {
        this.userService.getUser(element[0]).pipe(take(1)).subscribe(usr => {
          element[2] = usr['displayName'];
        })
      });

      //set element 2 for each person array to be the display name
      this.completedListingCountTop3.forEach(element => {
        this.userService.getUser(element[0]).pipe(take(1)).subscribe(usr => {
          element[2] = usr['displayName'];
        })
      });

      // console.log(this.completedListingCountTop3);
      // console.log(this.listingCountTop3);
    })

    
    this.requestService.getRequests().subscribe(allReq => {
      this.completedRequestCount = {};
      allReq.forEach(req => {
        //get completed request count for all requests
        if (req['status'] === "completed") {
          if (req['createdBy'] in this.completedRequestCount) {
            this.completedRequestCount[req['createdBy']] += 1
          } else {
            this.completedRequestCount[req['createdBy']] = 1
          }

          if (req['helper'] in this.completedRequestCount) {
            this.completedRequestCount[req['helper']] += 1
          } else {
            this.completedRequestCount[req['helper']] = 1
          }
        }
      })

      //get user count
      this.userCompletedRequestCount = this.completedRequestCount[this.userID];

      this.completedRequestCountTop3 = sortProperties(this.completedRequestCount).slice(0,3)
      

      //set element 2 for each person array to be the display name
      this.completedRequestCountTop3.forEach(element => {
        this.userService.getUser(element[0]).pipe(take(1)).subscribe(usr => {
          element[2] = usr['displayName'];
        })
      });
      // console.log(this.completedRequestCountTop3);
    })
    
    
    
  }

}

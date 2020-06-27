import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { RequestService } from "../../services/request/request.service";
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { NgbModal, NgbModalOptions, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
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

  //modal attributes
  closeResult: string;
  modalOptions: NgbModalOptions;

  // Initilised attributes.
  requestDetails: any;
  creatorDetails: any;
  helperDetails: any;

  constructor(
    private modalService: NgbModal,
    // public activeModal: NgbActiveModal,
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
      this.requestService.getRequest(this.requestID).pipe(take(1)).subscribe(request => {
        this.requestDetails = request;
        // console.log("card change")


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

      });
    }
  }

  timeAgo(timestamp) {
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

  /** Show the 24H time of the version made. */
  datetime12H(timestamp) {
    const day = new Date(timestamp).getDate();
    const monthNo = new Date(timestamp).getMonth();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November","December"];
    const month = months[monthNo];
    var year = new Date(timestamp).getFullYear();
    var hour24:any = new Date(timestamp).getHours();
    var min:any = new Date(timestamp).getMinutes();

    // Set to 12H timing.
    var hour12 = hour24;
    var ampm = "am";
    if (hour24 > 12) {
      hour12 = hour24 - 12;
      ampm = "pm";
    }
    if (hour24 == 0 || hour24 == 24) {
      hour12 = 12;
      ampm = "am"
    }

    // Add 0 padding for single digits.
    if (min < 10) {
        min = "0" + min;
    }
    if (hour12 < 10) {
        hour12 = "0" + hour12;
    }

    return day + " " + month + " " + year + ", " + hour12 + "." + min + " " +  ampm ;
}

  open(content) {
     this.modalService.open(content, {windowClass: 'modal-holder', centered: true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  acceptRequest() {
    if (confirm("Are you sure you want to help " + this.creatorDetails['displayName'] + "?")) {
      // this.closeDetailsModal();
      this.modalService.dismissAll();
      this.requestService.acceptRequest(this.requestDetails["ID"], this.userID).then(() => {

      });
    }
  }

  unacceptRequest() {
    if (confirm("Are you sure you want to give up helping " + this.creatorDetails['displayName'] + "?")) {
      // this.closeDetailsModal();
      this.modalService.dismissAll();
      this.requestService.unacceptRequest(this.requestDetails["ID"]).then(() => {

      });
    }
  }

  completeRequest() {
    if (confirm("Are you you have completed " + this.creatorDetails['displayName'] + "/'s request")) {
      // this.closeDetailsModal();
      this.modalService.dismissAll();
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


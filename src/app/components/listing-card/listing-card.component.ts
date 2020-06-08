import { Component, OnInit, Input } from '@angular/core';
import { AngularFireStorage, createStorageRef } from '@angular/fire/storage';
import { UserService } from 'src/app/services/user/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { take } from 'rxjs/operators';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import  { ListingService } from '../../services/listing/listing.service';

declare var $: any;


@Component({
  selector: 'app-listing-card',
  templateUrl: './listing-card.component.html',
  styleUrls: ['./listing-card.component.css']
})
export class ListingCardComponent implements OnInit {
  closeResult: string;
  modalOptions:NgbModalOptions;
  @Input() listingDetails: any;
  url: any;
  displayName: any;
  creatorID: any;
  userID: any;


  constructor(
    private modalService: NgbModal,
    private storage : AngularFireStorage,
    public auth: AuthService,
    private userService: UserService,
    private listingService: ListingService
  ) {
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop'
    }
    }

  ngOnInit(): void {
    this.url = "./assets/no-preview-available.png"
    this.auth.getUser().pipe().subscribe(user => {
      // Get user details.
      this.userID = user.uid;
  });

    if (this.listingDetails['path']) {
       this.storage.ref(this.listingDetails['path']).getDownloadURL().subscribe(url =>
        this.url = url)
    }
    if (this.listingDetails) {
      this.creatorID = this.listingDetails['createdBy'];
      this.userService.getUser(this.creatorID).pipe(take(1)).subscribe(user => {
          this.displayName = user['displayName'];
      });

      
    
  }
  }


  timeAgo() {
    var timestamp = this.listingDetails['timeStamp'];
    var delta = Date.now() - timestamp;
    var days =Math.floor(delta / (1000 * 60 * 60 * 24));
    var hours = Math.floor(delta / (1000 * 60 * 60));
    var min = Math.floor(delta / (1000 * 60 ));
    var sec = Math.floor(delta / (1000));
    
    if(days < 0){
      return `now`;
    }else if(days > 14){

      return `${new Date(timestamp).toLocaleDateString()}`;
    }else if(days){

      return `${days} days ago`;
    }else if (hours){

      return `${hours} hours ago`;
    }else if (min){

      return `${min} mins ago`;
    }else if (sec){

      return ` seconds ago`;
    }else{
      return `now`;
    }
}

  seeListingDetails() {
    if (this.listingDetails) {
      // this.listingService.sendRequestDetails(this.requestDetails);
      alert("works")
      $('#listing-details').modal('show');
  } else {
      alert("This listing has incomplete details!");
  }
  }

  open(content) {
    this.modalService.open(content, this.modalOptions).result.then((result) => {
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
      return  `with: ${reason}`;
    }
  }

  deleteListing() {
    this.listingService.deleteListing(this.listingDetails);
    this.modalService.dismissAll();
  }

  // addToWishlist() {
  //   var listingDetails = {
  //     wishlist : this.usergfdsgfdsg
  //   }
  //   this.listingService.updateListingDetails(this.userID, this.listingDetails);
  // }

}

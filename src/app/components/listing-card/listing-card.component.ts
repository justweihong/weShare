import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AngularFireStorage, createStorageRef } from '@angular/fire/storage';
import { UserService } from 'src/app/services/user/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { take, delay } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ListingService } from '../../services/listing/listing.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

declare var $: any;


@Component({
  selector: 'app-listing-card',
  templateUrl: './listing-card.component.html',
  styleUrls: ['./listing-card.component.css']
})
export class ListingCardComponent implements OnInit {
  subscription: Subscription[] = [];
  closeResult: string;
  modalOptions: NgbModalOptions;
  @Input() listingDetails: any;
  url: any;
  creatorDetails:any;
  creatorDisplayName: any;
  creatorImg: any;
  creatorID: any;
  userID: any;
  userName: any;
  userImg: any;
  offerForm: FormGroup;
  offers: any;
  // downloadURL:any;


  constructor(
    private modalService: NgbModal,
    private storage: AngularFireStorage,
    public auth: AuthService,
    private userService: UserService,
    private listingService: ListingService,
    private fb: FormBuilder,
    private db: AngularFirestore,
  ) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop'
    }

    this.offerForm = this.fb.group({ price: ['', Validators.required] });
  }

  get price(): any { return this.offerForm.get('price') }

  ngOnInit(): void {
    this.url = "./assets/no-preview-available.png"
    this.offers = [];

    this.subscription.push(this.auth.getUser().pipe(take(1)).subscribe(user => {
      // Get user details.
      this.userID = user.uid;
      this.userName = user.displayName;
      this.userImg = user.photoURL;
    }));

    if (this.listingDetails['path']) {
      this.storage.ref(this.listingDetails['path']).getDownloadURL().subscribe(url =>
        this.url = url)
    }

    if (this.listingDetails) {
      this.creatorID = this.listingDetails['createdBy'];
      this.userService.getUser(this.creatorID).pipe(take(1)).subscribe(user => {
        this.creatorDetails = user;
        this.creatorDisplayName = user['displayName'];
        this.creatorImg = user['profileImg'];
      });


      if (this.listingDetails['hasOffers']) {
        this.subscription.push(this.listingService.getListingOffers(this.listingDetails).subscribe(offer => {
          this.offers = [];
          offer.forEach(individualOffer => {
            this.offers.push(individualOffer);
          })
        }))
      }

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

  seeListingDetails() {
    if (this.listingDetails) {
      // this.listingService.sendRequestDetails(this.requestDetails);
      alert("works")
      $('#listing-details').modal('show');
    } else {
      alert("This listing has incomplete details!");
    }
  }
  formatCurrency(price) {
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SGD',
    });
    return formatter.format(price);
  }

  open(content) {
    // this.modalService.open(content, this.modalOptions).result.then((result) => {
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

  deleteListing() {
    this.listingService.deleteListing(this.listingDetails);
    this.modalService.dismissAll();
  }

  makeOffer() {
    if (this.offerForm.controls['price'].invalid.valueOf()) {
      alert("Please fill in a price!");
      return;
    }

    this.listingService.addOffer(this.userName, this.userID, this.listingDetails, this.price.value, this.userImg);
    this.offerForm.reset();
    this.modalService.dismissAll();
    // location.reload();
  }


  acceptOffer(offer) {
    if (confirm("are you sure you want to accept offer? This listing will be marked as sold.")) {
      this.listingService.acceptOffer(offer, this.listingDetails);
      this.modalService.dismissAll();
    }
  }


  ngOnDestroy() {
    this.subscription.forEach(subscription => subscription.unsubscribe());
  }

}

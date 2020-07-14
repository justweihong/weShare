import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask, createStorageRef } from '@angular/fire/storage';
import { Subject, Observable, from } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  listingStates = new Subject<any>();

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private userService: UserService
  ) { }

  getListings() {
    // console.log(this.db.collection(`listings`));
    return this.db.collection(`listings`, ref => ref.orderBy('timeStamp', 'desc')).valueChanges();
  }

  deleteListing(listingDetails) {
    //delete picture
    if (listingDetails["path"] != "no-preview-available.png") {
      this.storage.ref(listingDetails["path"]).delete();
    };

    //delete offer collection
    if (listingDetails['hasOffers']) {
      this.db.doc(`listings/${listingDetails['ID']}`).collection("offers").snapshotChanges().subscribe(offer => {
        offer.forEach(individualOffer => {
          this.db.doc(`listings/${listingDetails['ID']}`).collection("offers").doc(individualOffer['offererID']).delete()
        })
      })
    }

    //reduce count of user if listing not completed
    // if (listingDetails['status'] === "active") {
    //   this.userService.decreaseListingCount(listingDetails['createdBy']);
    // }

    //delete document
    this.db.doc(`listings/${listingDetails['ID']}`).delete().then(function () {
      console.log("Document successfully deleted!");
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  }

  addOffer(offererName, offererID, listingDetails, price, offererProfileImg) {
    this.db.doc(`listings/${listingDetails['ID']}`).set({ hasOffers: true }, { merge: true });
    this.db.doc(`listings/${listingDetails['ID']}`).collection("offers").doc(offererID).set({ offererName, offererID, price, offererProfileImg })
  }

  getListingOffers(listingDetails) {
    // console.log(this.db.doc(`listings/${listingDetails['ID']}`).collection("offers"));
    return this.db.collection("listings").doc(listingDetails['ID']).collection("offers").valueChanges();
  }


  acceptOffer(offer, listingDetails) {
    var dataToChange = {
      completeTimeStamp: Date.now(),
      status: "completed",
      acceptedByID: offer["offererID"],
      acceptedBy: offer["offererName"],
      acceptedPrice: offer["price"]
    }
    //increase completed listing count for both users
    // this.userService.increaseCompletedListingCount(offer['offererID']);
    // this.userService.increaseCompletedListingCount(listingDetails['createdBy']);

    //change status to completed
    this.db.doc(`listings/${listingDetails['ID']}`).set(dataToChange, { merge: true });
  }

  getSnap() {
    return this.db.collection('listings').snapshotChanges();
  }

}

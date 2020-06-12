import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask, createStorageRef } from '@angular/fire/storage';
import { Observable, from } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListingService {

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  getListings() {
    // console.log(this.db.collection(`listings`));
    return this.db.collection(`listings`).valueChanges();
  }

  deleteListing(listingDetails) {
    // console.log(listingDetails['ID']);
    // console.log(listingDetails["path"]);
    if (listingDetails["path"] != "no-preview-available.png") {
      this.storage.ref(listingDetails["path"]).delete();
      // console.log("picDeleted");
    };

    if (listingDetails['hasOffers']) {
      this.db.doc(`listings/${listingDetails['ID']}`).collection("offers").snapshotChanges().subscribe(offer => {
        offer.forEach(individualOffer => {
          this.db.doc(`listings/${listingDetails['ID']}`).collection("offers").doc(individualOffer['offererID']).delete()
        })
      })
    }
    this.db.doc(`listings/${listingDetails['ID']}`).delete().then(function () {
      console.log("Document successfully deleted!");
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  }

  addOffer(offererName, offererID, listingDetails, price) {
    this.db.doc(`listings/${listingDetails['ID']}`).set({ hasOffers: true }, { merge: true });
    this.db.doc(`listings/${listingDetails['ID']}`).collection("offers").doc(offererID).set({ offererName, offererID, price })
  }

  getListingOffers(listingDetails) {
    // console.log(this.db.doc(`listings/${listingDetails['ID']}`).collection("offers"));
    return this.db.collection("listings").doc(listingDetails['ID']).collection("offers").valueChanges();
  }


  acceptOffer(offer, listingDetails) {
    var dataToChange = {
      completeTimeStamp: Date.now(),
      status: "completed",
      acceptedBy: offer["offererName"],
      acceptedPrice: offer["price"]
    }
    this.db.doc(`listings/${listingDetails['ID']}`).set(dataToChange, { merge: true });
  }

  // updateListingDetails(userID, listingDetails) {
  //   // console.log(this.db.doc(`listings/${listingDetails['ID']}`).collection("wishList"));
  //   this.db.doc(`listings/${listingDetails['ID']}`).set({listingDetails},{merge: true});
  // }


}

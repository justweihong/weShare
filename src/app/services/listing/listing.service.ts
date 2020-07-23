import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask, createStorageRef } from '@angular/fire/storage';
import { Subject, Observable, from } from 'rxjs';
import { tap, finalize, take } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { NotificationService } from '../notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  listingStates = new Subject<any>();

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private notificationService: NotificationService,
  ) { }

  getListings() {
    // console.log(this.db.collection(`listings`));
    return this.db.collection(`listings`, ref => ref.orderBy('timeStamp', 'desc')).valueChanges();
  }

  deleteListing(listingDetails) {
    //delete notifications for the listing
    this.notificationService.removeNotifications(listingDetails['ID']);

    //delete picture
    if (listingDetails["path"] != "no-preview-available.png") {
      this.storage.ref(listingDetails["path"]).delete();
    };

    //delete offer collection
    if (listingDetails['hasOffers']) {
      this.db.doc(`listings/${listingDetails['ID']}`).collection("offers").valueChanges().pipe(take(1)).subscribe(offer => {
        offer.forEach(individualOffer => {
          //notify all offerers that listing has been deleted
          var data = {
            'title': 'Listing Deleted',
            'description': listingDetails['title'] + ' has been deleted from the marketplace!',
            'createdBy': listingDetails['createdBy'],
            'status': 'new notification',
            'ID': listingDetails['ID'] + individualOffer["offererID"],
            'timeStamp': Date.now()
          }
          this.notificationService.notifyUser(individualOffer["offererID"], listingDetails['ID'] + individualOffer["offererID"], data);

          //delete any existing offers notification for this listing
          console.log(listingDetails['ID'] + individualOffer['offererID'], listingDetails['createdBy'])
          this.notificationService.removeNotificationForUser(listingDetails['ID'] + individualOffer['offererID'], listingDetails['createdBy']);

          this.db.doc(`listings/${listingDetails['ID']}`).collection("offers").doc(individualOffer['offererID']).delete();
        })

      })
    }

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

    //notify the user on offer
    var data = {
      'title': 'New Offer',
      'description': offererName + ' has offered you $' + price + ' for ' + listingDetails['title'],
      'createdBy': offererID,
      'status': 'new notification',
      'ID': listingDetails['ID'] + offererID,
      'timeStamp': Date.now()
    }

    //notify creator of listing; notificationID is "listingID + offererID" 
    this.notificationService.notifyUser(listingDetails['createdBy'], listingDetails['ID'] + offererID, data);
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

    //delete notifications for the listing
    this.notificationService.removeNotifications(listingDetails['ID']);

    //delete offer notifications for user
    if (listingDetails['hasOffers']) {
      this.db.doc(`listings/${listingDetails['ID']}`).collection("offers").valueChanges().pipe(take(1)).subscribe(offer => {
        offer.forEach(individualOffer => {
          this.notificationService.removeNotificationForUser( listingDetails['ID'] + individualOffer["offererID"], listingDetails['createdBy']);
        })
      })
    }

    //change status to completed
    this.db.doc(`listings/${listingDetails['ID']}`).set(dataToChange, { merge: true })
      .then(() => {
        //notify the user on accepted offer
        var data = {
          'title': 'Offer Accepted',
          'description': 'Your offer of $' + offer["price"] + ' for ' + listingDetails['title'] + ' has been accepted!',
          'createdBy': offer["offererID"],
          'status': 'new notification',
          'ID': listingDetails['ID'] + offer["offererID"],
          'timeStamp': Date.now()
        }
        this.notificationService.notifyUser(offer["offererID"], listingDetails['ID'] + offer["offererID"], data);

      });
  }

  getSnap() {
    return this.db.collection('listings').snapshotChanges();
  }

  //in progress
  // getOffersSnapshot(userID) {
  //   return this.db.collection('listings').ref.where("createdBy", "==", userID).orderBy("createdBy")
  // }

}

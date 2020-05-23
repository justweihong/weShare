import { Injectable } from '@angular/core';
import { Subscription, merge } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument , AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(
      private afs: AngularFirestore,
  ) {}

  getRequests() {
      return this.afs.collection(`requests`).valueChanges();
  }

  addRequest(requestData) {
      const collection = this.afs.collection(`requests`);
      if (navigator.onLine) {
          return collection.add(requestData).then(
              key=> {
                  collection.doc(`${key.id}`).set({ID: key.id}, {merge: true});
              }
          );
      }   
  }

  updateRequestStatus(requestID, statusType) {
    return this.afs.doc(`requests/${requestID}`).set({status: statusType}, {merge:true});
  }
}

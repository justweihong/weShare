import { Injectable } from '@angular/core';
import { Subscription, merge, Subject, Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument , AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
    subject = new Subject<any>();
    

  constructor(
      private afs: AngularFirestore,
  ) {}

  getRequests() {
      return this.afs.collection(`requests`, ref => ref.orderBy('timeStamp', 'desc')).valueChanges();
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

  // When listing card is clicked, this method sends the card details through this service.
  sendRequestDetails(details) {
      this.subject.next(details);
  }

  // Request details constructor will subscribe to get the updated request details to display on modal.
  getRequestDetails(): Observable<any> {
      return this.subject.asObservable();
  }
}

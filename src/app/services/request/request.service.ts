import { Injectable } from '@angular/core';
import { Subscription, merge, Subject, Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { UserService } from '../user/user.service';

@Injectable({
    providedIn: 'root'
})
export class RequestService {
    subject = new Subject<any>();
    subject2 = new Subject<any>();
    requestStates = new Subject<any>();


    constructor(
        private afs: AngularFirestore,
        private userService: UserService
    ) { }

    getRequests() {
        
        return this.afs.collection(`requests`, ref => ref.orderBy('timeStamp', 'desc')).valueChanges();
    }
    getRequest(requestID) {        
        return this.afs.doc(`requests/${requestID}`).valueChanges();
    }

    addRequest(requestData) {
        const collection = this.afs.collection(`requests`);
        if (navigator.onLine) {
            return collection.add(requestData).then(
                key => {
                    collection.doc(`${key.id}`).set({ ID: key.id }, { merge: true });
                }
            );
        }
    }

    // Update status on Firebase then allow subject2 to detect change for subscription in explore & request-detail.
    acceptRequest(requestID, helperID) {
        var dataToChange = {
            helper: helperID,
            helpTimeStamp: Date.now(),
            status: "ongoing",
        }
        return this.afs.doc(`requests/${requestID}`).set(dataToChange, { merge: true }).then(() => {
            // this.subject2.next();
            console.log("done")
        })
    }

    // Update status on Firebase then allow subject2 to detect change for subscription in explore & request-detail.
    unacceptRequest(requestID) {
        var dataToChange = {
            helper: "nil",
            helpTimeStamp: "nil",
            status: "active",
        }
        return this.afs.doc(`requests/${requestID}`).set(dataToChange, { merge: true }).then(() => {
            // this.subject2.next();
        });
    }

    // Update status on Firebase then allow subject2 to detect change for subscription in explore & request-detail.
    completeRequest(requestID, requestHelper) {
        var dataToChange = {
            completeTimeStamp: Date.now(),
            status: "completed",
        }

        //increase completed request for helper
        // this.userService.increaseCompletedRequest(requestHelper);
        
        // var tempSub = this.getRequest(requestID).subscribe(req => {
        //     if (req['helper'] != "nil") {
        //         console.log(req['helper']);
        //         this.userService.increaseCompletedRequest(req['helper']);
                
        //     }
        // })
        // tempSub.unsubscribe();

        return this.afs.doc(`requests/${requestID}`).set(dataToChange, { merge: true }).then(() => {
            // this.subject2.next();
        });
    }

    // When listing card is clicked, this method sends the card details through this service.
    sendRequestDetails(details) {
        this.subject.next(details);
    }

    // Request details constructor will subscribe to get the updated request details to display on modal.
    getRequestDetails(): Observable<any> {
        return this.subject.asObservable();
    }

    // Explore constructor take changes in request details.
    getDetailUpdates(): Observable<any> {
        return this.subject2.asObservable();
    }
}

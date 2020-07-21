import { Injectable } from '@angular/core';
import { Subscription, merge, Subject, Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { UserService } from '../user/user.service';
import { NotificationService } from '../notification/notification.service';
// import { request } from 'http';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RequestService {
    subject = new Subject<any>();
    subject2 = new Subject<any>();
    requestStates = new Subject<any>();
    displayName: any;

    constructor(
        private afs: AngularFirestore,
        private notificationService: NotificationService,
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
                    var data = {
                        'title': 'New Request',
                        'description': 'New Request in the Community!',
                        'createdBy': requestData['createdBy'],
                        'status': 'new notification',
                        'ID' : key.id
                    }
                    this.notificationService.notifyAll(key.id, requestData['createdBy'], data);
                }
            )
        }
    }

    deleteRequest(requestID) {
        this.notificationService.removeNotifications(requestID);
        this.afs.doc(`requests/${requestID}`).delete();
    }

    // Update status on Firebase then allow subject2 to detect change for subscription in explore & request-detail.
    acceptRequest(requestID, helperID) {


        //get request details
        let requestTitle;
        let notifyUser;
        let helperName;
        this.afs.doc(`requests/${requestID}`).valueChanges().pipe(take(1)).subscribe(req => {
            requestTitle = req['title'];
            notifyUser = req['createdBy'];
        })
        return this.afs.doc(`user/${helperID}`).valueChanges().pipe(take(1)).subscribe(user => {
            helperName = user['displayName'];
        }).add(() => {
            var dataToChange = {
                helper: helperID,
                helpTimeStamp: Date.now(),
                status: "ongoing",
            }
            this.afs.doc(`requests/${requestID}`).set(dataToChange, { merge: true }).then(() => {
                // this.subject2.next();
                console.log("done")
            })
                .then(() => {
                    var data = {
                        'title': helperName + ' has helped you!',
                        'description': requestTitle + ' has been accepted!',
                        'createdBy': helperID,
                        'status': 'new notification',
                        'type': 'accepted request',
                        'ID': requestID
                    }
                    this.notificationService.notifyUser(notifyUser, requestID, data);
                })
        })





    }

    // Update status on Firebase then allow subject2 to detect change for subscription in explore & request-detail.
    unacceptRequest(requestID) {
        var dataToChange = {
            helper: "nil",
            helpTimeStamp: "nil",
            status: "active",
        }
        let userNotificationToDelete;
        this.afs.doc(`requests/${requestID}`).valueChanges().pipe(take(1)).subscribe(req => {
            userNotificationToDelete = req['createdBy'];
        }).add(() => {
            this.notificationService.removeNotificationForUser(requestID, userNotificationToDelete);
        })

        return this.afs.doc(`requests/${requestID}`).set(dataToChange, { merge: true }).then(() => {
            // this.subject2.next();
        });
    }

    // Update status on Firebase then allow subject2 to detect change for subscription in explore & request-detail.
    completeRequest(requestID) {
        

        //increase completed request for helper
        // this.userService.increaseCompletedRequest(requestHelper);

        // var tempSub = this.getRequest(requestID).subscribe(req => {
        //     if (req['helper'] != "nil") {
        //         console.log(req['helper']);
        //         this.userService.increaseCompletedRequest(req['helper']);

        //     }
        // })
        // tempSub.unsubscribe();

        let requestTitle;
        let notifyUser;
        let helperName;
        let helperID;
        this.afs.doc(`requests/${requestID}`).valueChanges().pipe(take(1)).subscribe(req => {
            requestTitle = req['title'];
            notifyUser = req['createdBy'];
            helperID = req['helper'];
        })
        return this.afs.doc(`user/${helperID}`).valueChanges().pipe(take(1)).subscribe(user => {
            helperName = user['displayName'];  //bug here helperName undefined
        })
            .add(() => {
                var dataToChange = {
                    completeTimeStamp: Date.now(),
                    status: "completed",
                }

                this.afs.doc(`requests/${requestID}`).set(dataToChange, { merge: true }).then(() => {
                    console.log('done');
                })
                    .then(() => {
                        var data = {
                            'title': helperName + ' has completed your request!',
                            'description': requestTitle + ' has been completed!',
                            'createdBy': helperID,
                            'status': 'new notification',
                            'type': 'accepted request',
                            'ID' : requestID
                        }
                        this.notificationService.notifyUser(notifyUser, requestID, data);
                    });
            }).unsubscribe();

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

    getSnap() {
        return this.afs.collection('requests').snapshotChanges();
    }
}

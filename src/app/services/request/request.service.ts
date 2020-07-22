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
                        'title': 'New Request in the Community!',
                        'description': 'New Request: ' + requestData['title'],
                        'createdBy': requestData['createdBy'],
                        'status': 'new notification',
                        'ID': key.id
                    }
                    this.notificationService.notifyAll(key.id, requestData['createdBy'], data);
                }
            )
        }
    }

    deleteRequest(requestID) {
        //remove all new request notifications
        this.notificationService.removeNotifications(requestID);

        //get request details
        let status;
        let requestCreator;
        let helperID;
        let requestTitle;
        this.afs.doc(`requests/${requestID}`).valueChanges().pipe(take(1)).subscribe(req => {
            status = req['status'];
            requestCreator = req['createdBy'];
            helperID = req['helper'];
            requestTitle = req['title'];

            if (status === "completed") {
                //Notification of completion (if any) will be deleted (to declutter database)
                this.notificationService.removeNotificationForUser(requestID + helperID, requestCreator);
            } else if (status ==="ongoing") {
                //New notification will be pushed to person (if any) who accepted the request
                var data = {
                    'title': 'Your accepted request have been deleted!',
                    'description': requestTitle + ' has been deleted from the community!',
                    'createdBy': requestCreator,
                    'status': 'new notification',
                    'type': 'deleted request',
                    'ID': requestID + requestCreator
                }
                this.notificationService.notifyUser(helperID, requestID + requestCreator, data);
            }
        })

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

            this.afs.doc(`user/${helperID}`).valueChanges().pipe(take(1)).subscribe(user => {
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
                            'ID': requestID + helperID
                        }
                        this.notificationService.notifyUser(notifyUser, requestID + helperID, data);
                    })
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
        let helperID;
        this.afs.doc(`requests/${requestID}`).valueChanges().pipe(take(1)).subscribe(req => {
            userNotificationToDelete = req['createdBy'];
            helperID = req['helper'];
        }).add(() => {
            this.notificationService.removeNotificationForUser(requestID + helperID, userNotificationToDelete);
        })

        return this.afs.doc(`requests/${requestID}`).set(dataToChange, { merge: true }).then(() => {
            // this.subject2.next();
        });
    }

    // Update status on Firebase then allow subject2 to detect change for subscription in explore & request-detail.
    completeRequest(requestID) {

        //remove all new request notifications
        this.notificationService.removeNotifications(requestID);

        let requestTitle;
        let notifyUser;
        let helperName;
        let helperID;
        this.afs.doc(`requests/${requestID}`).valueChanges().pipe(take(1)).subscribe(req => {
            requestTitle = req['title'];
            notifyUser = req['createdBy'];
            helperID = req['helper'];

            this.afs.doc(`user/${helperID}`).valueChanges().pipe(take(1)).subscribe(user => {
                helperName = user['displayName'];  
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
                                'ID': requestID + helperID
                            }
                            this.notificationService.notifyUser(notifyUser, requestID + helperID, data);
                        });
                }).unsubscribe();
        })

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

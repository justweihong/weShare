import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ListingService } from '../listing/listing.service';
import { RequestService } from '../request/request.service';
import { AuthService } from '../auth/auth.service';
import { take } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable()
export class NotificationService {
  public permission: Permission;
  listingCount: any;
  requestCount: any;
  userID: any;
  // notificationSubject = new Subject<any>();

  constructor(
    private afs: AngularFirestore,
    private listingService: ListingService,
    private requestService: RequestService,
    private auth: AuthService
  ) {
    this.permission = this.isSupported() ? 'default' : 'denied';
  }

  // sendNotificationUpdate(details) {
  //   this.notificationSubject.next(details);
  // }
  // getNotificataionUpdates(): Observable<any>{
  //   return this.notificationSubject.asObservable();
  // }

  public isSupported(): boolean {
    return 'Notification' in window;
  }

  requestPermission(): void {
    let self = this;
    if ('Notification' in window) {
      Notification.requestPermission(function (status) {
        return self.permission = status;
      });
    }
  }

  create(title: string, options?: PushNotification): any {
    let self = this;
    return new Observable(function (obs) {
      if (!('Notification' in window)) {
        console.log('Notifications are not available in this environment');
        obs.complete();
      }
      if (self.permission !== 'granted') {
        console.log("The user hasn't granted you permission to send push notifications");
        obs.complete();
      }
      let _notify = new Notification(title, options);
      _notify.onshow = function (e) {
        return obs.next({
          notification: _notify,
          event: e
        });
      };
      _notify.onclick = function (e) {
        return obs.next({
          notification: _notify,
          event: e
        });
      };
      _notify.onerror = function (e) {
        return obs.error({
          notification: _notify,
          event: e
        });
      };
      _notify.onclose = function () {
        return obs.complete();
      };
    });
  }

  generateNotification(source: Array<any>): void {
    let self = this;
    source.forEach((item) => {
      let options = {
        body: item.alertContent,
        icon: "../resource/images/bell-icon.png"
      };
      let notify = self.create(item.title, options).subscribe();
    })
  }

  //notifies all users except 'creatorID' with 'data', notification doc ID ser as 'notificationID'
  //requests use a requestID notificationID
  //marketplace use the listingID as notificationID
  notifyAll(notificationID, creatorID, data) {
    this.afs.collection('user').valueChanges().pipe(take(1)).subscribe(allUser => {
      allUser.forEach(user => {
        // console.log(user);
        if (user['uid'] != creatorID) {
          this.afs.doc(`user/${user['uid']}`).collection('notifications').doc(notificationID).set(data, { merge: true })

        };
      })
    })
  }

  //notify 'userID' with 'data' and document ID is 'notificationID'
  //listing offers use "listingID + offererID" as notificationID
  //requests use  "requestID + helperID" as notificationID for accepting/finished
  //chats use user1 + user2 ID as notificationID
  notifyUser(userID, notificationID, data) {
    this.afs.collection('user').valueChanges().pipe(take(1)).subscribe(allUser => {
      allUser.forEach(user => {
        if (user['uid'] == userID) {
          this.afs.doc(`user/${user['uid']}`).collection('notifications').doc(notificationID).set(data, { merge: true })

        };
      })
    })
  }


  //removes all notifications for all users with the notificationID
  removeNotifications(notificationID) {
    this.afs.collection('user').valueChanges().pipe(take(1)).subscribe(allUser => {
      allUser.forEach(user => {
        this.afs.doc(`user/${user['uid']}`).collection("notifications").doc(notificationID).delete();
      })

    })
  }

  //removes notificationID for userID 
  removeNotificationForUser(notificationID, userID) {
    this.afs.collection('user').valueChanges().pipe(take(1)).subscribe(allUser => {
      allUser.forEach(user => {
        if (user['uid'] == userID) {
          this.afs.doc(`user/${user['uid']}`).collection("notifications").doc(notificationID).delete();
        };
      })
    })
  }

  //update all notifications(notificationID) of user(userID) to 'status'
  updateStatus(userID, notificationID, status) {
    this.afs.collection('user').valueChanges().pipe(take(1)).subscribe(allUser => {
      allUser.forEach(user => {
        if (user['uid'] == userID) {
          var data = {
            'status' : status
          }
          this.afs.doc(`user/${user['uid']}`).collection('notifications').doc(notificationID).set(data, { merge: true })

        };
      })
    })
  }

  getNotifications(userID) {
    // console.log(this.afs.collection(`user`).doc(`${userID}`).collection("notifications"))
    return this.afs.doc(`user/${userID}`).collection("notifications").snapshotChanges();
  }

  getNotificationsValueChanges(userID) {
    return this.afs.doc(`user/${userID}`).collection(`notifications`).valueChanges();
  }


  // notifyNewListing() {
  //   this.listingService.getSnap().subscribe(change => {

  //     //set original listingCount when first subscribe
  //     if (!this.listingCount) {
  //       this.listingCount = change.length;
  //     }

  //     //if increase then send new listing noti
  //     if (change.length > this.listingCount) {
  //       this.newListingNotification();
  //     }

  //     //update listing count
  //     this.listingCount = change.length
  //   })
  // }

  // newListingNotification() {

  //   let data: Array<any> = [];
  //   data.push({
  //     'title': 'New Listing',
  //     'alertContent': 'New Item in the Marketplace!'
  //   });
  //   this.generateNotification(data);
  // }


  // notifyNewRequest() {
  //   this.requestService.getSnap().subscribe(change => {

  //     //set original requestCount when first subscribe
  //     if (!this.requestCount) {
  //       this.requestCount = change.length;
  //     }

  //     //if increase then send new request noti
  //     if (change.length > this.requestCount) {
  //       this.newRequestNotification();
  //     }

  //     //update request count
  //     this.requestCount = change.length
  //   })
  // }

  // newRequestNotification() {

  //   let data: Array<any> = [];
  //   data.push({
  //     'title': 'New Request',
  //     'alertContent': 'New Request in the Community!'
  //   });
  //   this.generateNotification(data);
  // }


  // //in progress
  // newListingOfferNotification() {
  //   this.auth.user.pipe(take(1)).subscribe(user => {
  //     console.log(user.uid);
  //     this.userID = user.uid;
  //     console.log("user: ", this.userID);
  //   })
  //   if (this.userID) {
  //     this.listingService.getOffersSnapshot(this.userID);
  //   }
  // }
}


export declare type Permission = 'denied' | 'granted' | 'default';
export interface PushNotification {
  body?: string;
  icon?: string;
  tag?: string;
  data?: any;
  renotify?: boolean;
  silent?: boolean;
  sound?: string;
  noscreen?: boolean;
  sticky?: boolean;
  dir?: 'auto' | 'ltr' | 'rtl';
  lang?: string;
  vibrate?: number[];
}
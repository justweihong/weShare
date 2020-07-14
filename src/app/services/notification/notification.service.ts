import {  Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { ListingService } from '../listing/listing.service';
import { RequestService } from '../request/request.service';


@Injectable()
export class NotificationService {
  public permission: Permission;
  listingCount: any;
  requestCount: any;

  constructor(
    private listingService: ListingService,
    private requestService: RequestService,
  ) {
    this.permission = this.isSupported() ? 'default' : 'denied';
  }

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

  notifyNewListing() {
    this.listingService.getSnap().subscribe(change => {
      
      //set original listingCount when first subscribe
      if (!this.listingCount) {
        this.listingCount = change.length;
      }

      //if increase then send new listing noti
      if (change.length > this.listingCount) {
        this.newListingNotification();
      }

      //update listing count
      this.listingCount = change.length
    })
  }

  newListingNotification() {
    
    let data: Array<any> = [];
    data.push({
      'title': 'New Listing',
      'alertContent': 'New Item in the Marketplace!'
    });
    this.generateNotification(data);
  }


  notifyNewRequest() {
    this.requestService.getSnap().subscribe(change => {
      
      //set original requestCount when first subscribe
      if (!this.requestCount) {
        this.requestCount = change.length;
      }

      //if increase then send new request noti
      if (change.length > this.requestCount) {
        this.newRequestNotification();
      }

      //update request count
      this.requestCount = change.length
    })
  }

  newRequestNotification() {
    
    let data: Array<any> = [];
    data.push({
      'title': 'New Request',
      'alertContent': 'New Request in the Community!'
    });
    this.generateNotification(data);
  }
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
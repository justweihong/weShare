import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  navbarSubject = new Subject<any>();


  constructor() { }

  sendSidenavToggle() {
    this.navbarSubject.next();
  }

  getSidenavToggle(): Observable<any>{
    return this.navbarSubject.asObservable();
  }
}

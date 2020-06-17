import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument , AngularFirestoreCollection} from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private afs: AngularFirestore,
  ) { }

  getUser(userID) {
      return this.afs.doc(`user/${userID}`).valueChanges();
  }

  getUsers() {
    return this.afs.collection(`user`).valueChanges();
  }

  updateDetails(userID, data) {
      return this.afs.doc(`user/${userID}`).set(data, {merge: true});
  }
}

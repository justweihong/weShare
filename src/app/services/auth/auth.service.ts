import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@Angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../user.model';
import { auth } from 'firebase';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user: Observable<firebase.User>;
    userData: any;

    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router,
    ) {
        this.user = this.afAuth.authState
        // .pipe(
        //     switchMap(user => {
        //         if (user) { // Logged in.
        //             return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        //         } else { // Not logged in.
        //             return of(null);
        //         }
        //     })
        // )

        // Storing in localstorage
    //     this.afAuth.authState.subscribe(user => {
    //         if (user) {
    //           this.userData = user;
    //           localStorage.setItem('user', JSON.stringify(this.userData));
    //           JSON.parse(localStorage.getItem('user'));
    //         } else {
    //           localStorage.setItem('user', null);
    //           JSON.parse(localStorage.getItem('user'));
    //         }
    //     })
    }

    getUser() {
        return this.user.pipe();
    }

    async googleSignIn() {
        const provider = new auth.GoogleAuthProvider();
        const credential = await this.afAuth.signInWithPopup(provider);
        return this.updateUserData(credential.user).then(() => this.router.navigate(['/profile']));
    }

    async signOut() {
        if (confirm(`Are you sure you want to log out?`)) {
            await this.afAuth.signOut();
            return window.location.href = '/login';
        }
    }

    private updateUserData(user) {
        // Sets user data to firestore on login
        const userRef: AngularFirestoreDocument<User> = this.afs.doc(`user/${user.uid}`);

        const data = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            profileImg: user.photoURL,
        }

        return userRef.set(data, {merge: true});

    }
}

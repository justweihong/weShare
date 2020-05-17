import { Component, OnInit } from '@angular/core';
import { RequestListingCardComponent } from '../../components/request/request-listing-card/request-listing-card.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
    selector: 'app-explore',
    templateUrl: './explore.component.html',
    styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
    displayName: any;
    userID: any;


    constructor(
        private router: Router,
        public auth: AuthService,
        private afs: AngularFirestore,
    ) {
     }

    ngOnInit(): void {
        this.auth.getUser().pipe().subscribe(user => {
            console.log(user);
            this.userID = user.uid;
            this.displayName = user.displayName;
        })
        
    }

}

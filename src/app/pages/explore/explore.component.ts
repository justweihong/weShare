import { Component, OnInit } from '@angular/core';
import { RequestListingCardComponent } from '../../components/request-listing-card/request-listing-card.component';
import { RequestService } from '../../services/request/request.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
// import { request } from 'http';

@Component({
    selector: 'app-explore',
    templateUrl: './explore.component.html',
    styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
    detailUpdateSubscription: Subscription;
    displayName: any;
    userID: any;

    allRequests: any;
    myRequests:any;
    activeRequests:any;
    ongoingRequests:any;
    completedRequests:any;

    p: number = 1;
    

    constructor(
        private router: Router,
        public auth: AuthService,
        private requestService: RequestService,
        private afs: AngularFirestore,
    ) {

        // Reload all requests cards upon detecting any changes in status.
        this.requestService.getDetailUpdates().subscribe( () => {
            this.reloadRequests();
        })
     }

    ngOnInit(): void {
        this.auth.getUser().pipe().subscribe(user => {

            // Get user details.
            this.userID = user.uid;
            this.displayName = user.displayName;

            this.reloadRequests();
        })
    }

    reloadRequests() {
        this.myRequests = [];
        this.activeRequests = [];
        this.ongoingRequests = [];
        this.completedRequests = [];

        // Get requests.
        this.requestService.getRequests().pipe(take(1)).subscribe(requests =>{
            this.allRequests = requests;
            requests.forEach(request => {
                if (request['createdBy'] == this.userID) {
                    this.myRequests.push(request);
                    console.log("push");
                }
                if (request['status'] == "active") {
                    this.activeRequests.push(request);
                } else if (request['status'] == "ongoing") {
                    this.ongoingRequests.push(request);
                } else if (request['status'] == "completed") {
                    this.completedRequests.push(request);
                } else {
                    console.error("request ID (" + request['ID'] + ") has invalid status.");
                }
            })
        })
    }

}

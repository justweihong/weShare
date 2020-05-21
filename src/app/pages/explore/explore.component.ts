import { Component, OnInit } from '@angular/core';
import { RequestListingCardComponent } from '../../components/request/request-listing-card/request-listing-card.component';
import { RequestService } from '../../services/request/request.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
// import { request } from 'http';

@Component({
    selector: 'app-explore',
    templateUrl: './explore.component.html',
    styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
    displayName: any;
    userID: any;

    allRequests: any;
    myRequests:any = [];
    activeRequests:any = [];
    ongoingRequests:any = [];
    completedRequests:any = [];
    

    constructor(
        private router: Router,
        public auth: AuthService,
        private requestService: RequestService,
        private afs: AngularFirestore,
    ) {
     }

    ngOnInit(): void {
        this.auth.getUser().pipe().subscribe(user => {

            // Get user details.
            this.userID = user.uid;
            this.displayName = user.displayName;

            // Get requests.
            this.requestService.getRequests().pipe().subscribe(requests =>{
                this.allRequests = requests;
                requests.forEach(request => {
                    if (request['userID'] == this.userID) {
                        this.myRequests.push(request);
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
        })
    }

}

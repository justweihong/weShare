import { Component, OnInit } from '@angular/core';
import { RequestListingCardComponent } from '../../components/request-listing-card/request-listing-card.component';
import { RequestService } from '../../services/request/request.service';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
// declare var $: any;
import * as $ from 'jquery';
// import { request } from 'http';

@Component({
    selector: 'app-explore',
    templateUrl: './explore.component.html',
    styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
    faEdit = faEdit;

    // User details
    detailUpdateSubscription: Subscription;
    displayName: any;
    userID: any;
    userImg: any;
    userEmail: any;

    // Updates on user details
    userForm: FormGroup;

    // Requests cards
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
        private userService: UserService,
        private afs: AngularFirestore,
        public fb: FormBuilder,
    ) {

        // Reload all requests cards upon detecting any changes in status.
        this.requestService.getDetailUpdates().subscribe( () => {
            this.reloadRequests();
        })

        // User update form
        this.userForm = this.fb.group({
            roomDetails: '',
            userContact: '',
        })
     }

    get roomDetails() { return this.userForm.get('roomDetails') }
    get userContact() { return this.userForm.get('userContact') }

    ngOnInit(): void {
        this.auth.getUser().pipe().subscribe(user => {

            // Get user details.
            this.userID = user.uid;
            this.displayName = user.displayName;
            this.userImg = user.photoURL;
            this.userEmail = user.email;

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


    // User details update methods
    updateUserInfo() {
        var formDetails = {
            // Input details
            roomDetails: this.roomDetails.value,
            userContact: this.userContact.value,
        }

        this.userService.updateDetails(this.userID, formDetails).then(() => {
            this.userForm.reset();
            this.toggleUserDetailsDisplay();
        });
        
    }

    // User details update methods
    toggleUserDetailsDisplay() {
        $('#user-detail-display').show();
        $('#user-detail-edit').hide();
    }

    // User details update methods
    toggleUserDetailsEdit() {
        $('#user-detail-display').hide();
        $('#user-detail-edit').show();
    }

}

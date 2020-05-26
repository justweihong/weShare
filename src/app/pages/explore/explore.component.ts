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
    userContact: any;
    roomDetails: any;

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

    get newRoomDetails() { return this.userForm.get('roomDetails') }
    get newUserContact() { return this.userForm.get('userContact') }

    ngOnInit(): void {
        this.auth.getUser().pipe(take(1)).subscribe(user => {

            // Get user details.
            this.userID = user.uid;
            this.userService.getUser(this.userID).pipe(take(1)).subscribe(firebaseUser => {
                console.log(firebaseUser);
                this.displayName = firebaseUser['displayName'];
                this.userEmail = firebaseUser['email'];
                this.userImg = firebaseUser['profileImg'];
                if (!firebaseUser['userContact'] || !firebaseUser['roomDetails'] ) {
                    alert("Your profile is incompete, please complete them before viewing requests.");
                } else {
                    this.userContact = firebaseUser['userContact'];
                    this.roomDetails = firebaseUser['roomDetails'];
                }
            })
            this.reloadRequests();
            $(document).ready(function() {
                $("#loading-header").hide();
                $('#header').fadeIn(1000);
                
            })
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
        if (this.newRoomDetails.value) {}
        var formDetails = {
            // Input details
            roomDetails: (this.newRoomDetails.value) ? this.newRoomDetails.value : this.roomDetails,
            userContact: (this.newUserContact.value) ? this.newUserContact.value : this.userContact,
        }

        this.userService.updateDetails(this.userID, formDetails).then(() => {
            this.toggleUserDetailsDisplay();
            this.roomDetails = (this.newRoomDetails.value) ? this.newRoomDetails.value : this.roomDetails;
            this.userContact = (this.newUserContact.value) ? this.newUserContact.value : this.userContact;
            this.userForm.reset();
        });
        
    }

    // User details update methods
    toggleUserDetailsDisplay() {
        $('#user-contact-display').show();
        $('#user-contact-edit').hide();

        $('#room-detail-display').show();
        $('#room-detail-edit').hide();


        $('#edit-icon').show();
        $('#update-button').hide();
    }

    // User details update methods
    toggleUserDetailsEdit() {
        $('#user-contact-display').hide();
        $('#user-contact-edit').show();
        $('#user-contact-textarea').val(this.userContact);

        $('#room-detail-display').hide();
        $('#room-detail-edit').show();
        $('#room-detail-textarea').val(this.roomDetails);


        $('#edit-icon').hide();
        $('#update-button').show();
    }

}

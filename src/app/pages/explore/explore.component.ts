import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { RequestListingCardComponent } from '../../components/request-listing-card/request-listing-card.component';
import { RequestService } from '../../services/request/request.service';
import { UserService } from '../../services/user/user.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { take, map } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
// declare var $: any;
import * as $ from 'jquery';
import { NavbarService } from 'src/app/services/navbar/navbar.service';
import { ArrayType } from '@angular/compiler';
// import { request } from 'http';

@Component({
    selector: 'app-explore',
    templateUrl: './explore.component.html',
    styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
    subscriptions: Subscription[] = [];
    requestState: any = '';
    navstate: any;


    private _searchBox: string;
    get searchBox(): string {
        return this._searchBox;
    }

    set searchBox(value: string) {
        this._searchBox = value;
        this.filteredAllRequests = this.filterAllRequests(value);
        this.filteredMyRequests = this.filterMyRequests(value);
        this.filteredActiveRequests = this.filterActiveRequests(value);
        this.filteredOngoingRequests = this.filterOngoingRequests(value);
        this.filteredAcceptedRequests = this.filterAcceptedRequests(value);
        this.filteredCompletedRequests = this.filterCompletedRequests(value);
    }

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
    myRequests: any;
    activeRequests: any;
    ongoingRequests: any;
    acceptedRequests: any;
    completedRequests: any;

    //filtered requests card
    filteredAllRequests: any;
    filteredMyRequests: any;
    filteredActiveRequests: any;
    filteredOngoingRequests: any;
    filteredAcceptedRequests: any;
    filteredCompletedRequests: any;



    p: number = 1;


    constructor(
        private router: Router,
        public auth: AuthService,
        private requestService: RequestService,
        private navbarService: NavbarService,
        private userService: UserService,
        private afs: AngularFirestore,
        public fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
    ) {


        // User update form
        this.userForm = this.fb.group({
            roomDetails: '',
            userContact: '',
        })
    }

    get newRoomDetails() { return this.userForm.get('roomDetails') }
    get newUserContact() { return this.userForm.get('userContact') }

    ngOnInit(): void {

        // this.activeCheck = true;

        // console.log("hello")
        // Update the request state
        this.requestState = this.activatedRoute.snapshot.url[1].path;
        if (!this.requestState) {
            this.requestState = "all-requests";
        }

        // Get user details.
        this.auth.getUser().pipe(take(1)).subscribe(user => {
            this.userID = user.uid;
            this.userService.getUser(this.userID).pipe(take(1)).subscribe(firebaseUser => {
                // console.log(firebaseUser);
                this.displayName = firebaseUser['displayName'];
                this.userEmail = firebaseUser['email'];
                this.userImg = firebaseUser['profileImg'];
            })

            // this.reloadRequests();
            $(document).ready(function () {
                // $("#loading-header").delay(300).hide(0);
                $(".fade-right").animate({ left: "+=20px", opacity: "hide" }, 0).delay(300).animate({ left: "-=20px", opacity: "show" }, 800);

            })
        })

        // Update all requests when there is change in request collection.
        this.subscriptions.push(this.requestService.getRequests().pipe().subscribe(requests => {
            this.allRequests = requests;
            this.myRequests = [];
            this.activeRequests = [];
            this.ongoingRequests = [];
            this.acceptedRequests = [];
            this.completedRequests = [];
            requests.forEach(request => {
                // if (this.activeCheck) {
                //     if (request['status'] == 'active') 
                // }
                if (request['createdBy'] == this.userID) {
                    this.myRequests.push(request);
                }
                if (request['helper'] == this.userID) {
                    this.acceptedRequests.push(request);
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

            //set for first time
            this.filteredAllRequests = this.allRequests;
            this.filteredMyRequests = this.myRequests;
            this.filteredActiveRequests = this.activeRequests;
            this.filteredOngoingRequests = this.ongoingRequests;
            this.filteredAcceptedRequests = this.acceptedRequests;
            this.filteredCompletedRequests = this.completedRequests;

        }))
    }

    //TODO: remove??
    reloadRequests(active, ongoing, done, expired) {
        // this.myRequests = [];
        // this.activeRequests = [];
        // this.ongoingRequests = [];
        // this.completedRequests = [];

        this.requestService.getRequests().pipe(take(1)).subscribe(requests => {
            this.allRequests = [];
            this.myRequests = [];
            this.activeRequests = [];
            this.ongoingRequests = [];
            this.acceptedRequests = [];
            this.completedRequests = [];
            requests.forEach(request => {

                if (((active && request['status'] == "active") && (this.timeLeft(request['timeStamp'], request['duration']) != "expired"))
                    || ((ongoing && request['status'] == "ongoing") && (this.timeLeft(request['timeStamp'], request['duration']) != "expired"))
                    || ((done && request['status'] == "completed") && (this.timeLeft(request['timeStamp'], request['duration']) != "expired"))
                    || (expired && this.timeLeft(request['timeStamp'], request['duration']) == "expired")) {

                    this.allRequests.push(request);


                    if (request['createdBy'] == this.userID) {
                        this.myRequests.push(request);
                    }
                    if (request['helper'] == this.userID) {
                        this.acceptedRequests.push(request);
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
                }


            })

            //set for first time
            this.filteredAllRequests = this.allRequests;
            this.filteredMyRequests = this.myRequests;
            this.filteredActiveRequests = this.activeRequests;
            this.filteredOngoingRequests = this.ongoingRequests;
            this.filteredAcceptedRequests = this.acceptedRequests;
            this.filteredCompletedRequests = this.completedRequests;


        })
    }

    timeDifference(laterTimeStamp, earlierTimeStamp) {
        var delta = laterTimeStamp - earlierTimeStamp;
        var days = Math.floor(delta / (1000 * 60 * 60 * 24));
        var hours = Math.floor(delta / (1000 * 60 * 60));
        var min = Math.floor(delta / (1000 * 60));
        var sec = Math.floor(delta / (1000));

        if (days < 0) {
            return `expired`;

        } else if (days) {

            return `${days} days left`;
        } else if (hours) {

            return `${hours} hours left`;
        } else if (min) {

            return `${min} mins left`;
        } else if (sec) {

            return ` secs left`;
        } else {
            return `expired`;
        }
    }

    timeLeft(ts, dur) {
        const timestamp = ts;
        const duration = dur;
        if (Number.isNaN(duration)) {
            return "no limit";
        } else {
            const expireTimestamp = timestamp + duration * 60 * 60 * 1000;
            return this.timeDifference(expireTimestamp, Date.now());
        }

    }


    // User details update methods
    updateUserInfo() {
        if (this.newRoomDetails.value) { }
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
    trigger() {
        alert(" blur!");
    }

    test() {
        $('#request-details').show();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    filterAllRequests(searchBox: string) {

        return this.allRequests.filter(request =>
            ((request['title'].toLowerCase().indexOf(searchBox.toLowerCase()) !== -1) ||
                request['description'].toLowerCase().indexOf(searchBox.toLowerCase()) !== -1)

        )
    }

    filterMyRequests(searchBox: string) {
        return this.myRequests.filter(request =>
            (request['title'].toLowerCase().indexOf(searchBox.toLowerCase()) !== -1) ||
            request['description'].toLowerCase().indexOf(searchBox.toLowerCase()) !== -1
        )
    }

    filterActiveRequests(searchBox: string) {
        return this.activeRequests.filter(request =>
            (request['title'].toLowerCase().indexOf(searchBox.toLowerCase()) !== -1) ||
            request['description'].toLowerCase().indexOf(searchBox.toLowerCase()) !== -1
        )
    }

    filterOngoingRequests(searchBox: string) {
        return this.ongoingRequests.filter(request =>
            (request['title'].toLowerCase().indexOf(searchBox.toLowerCase()) !== -1) ||
            request['description'].toLowerCase().indexOf(searchBox.toLowerCase()) !== -1
        )
    }

    filterAcceptedRequests(searchBox: string) {
        return this.acceptedRequests.filter(request =>
            (request['title'].toLowerCase().indexOf(searchBox.toLowerCase()) !== -1) ||
            request['description'].toLowerCase().indexOf(searchBox.toLowerCase()) !== -1
        )
    }

    filterCompletedRequests(searchBox: string) {
        return this.completedRequests.filter(request =>
            (request['title'].toLowerCase().indexOf(searchBox.toLowerCase()) !== -1) ||
            request['description'].toLowerCase().indexOf(searchBox.toLowerCase()) !== -1
        )
    }

    // activeCheckBox(activeCheck) {
    //     return this.

    // }


    // checkFilter() {
    //     // console.log('inside',arr);
    //     // const newArr = [];
    //     return this.filterAllRequests(this._searchBox).filter(request => {
    //         request['status'] != "active"
    //     });

    // }


    filterRequestsStatus(inputActive, inputOngoing, inputDone, inputExpired) {
        this.reloadRequests(inputActive.checked, inputOngoing.checked, inputDone.checked, inputExpired.checked);
    }

}

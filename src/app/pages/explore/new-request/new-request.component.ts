import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../services/request/request.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { NewListingComponent } from '../../marketplace/new-listing/new-listing/new-listing.component';

@Component({
    selector: 'app-new-request',
    templateUrl: './new-request.component.html',
    styleUrls: ['./new-request.component.css']
})
export class NewRequestComponent implements OnInit {
    displayName: any;
    userID: any;
    items: any;
    requestForm: FormGroup;

    constructor(
        public auth: AuthService,
        private router: Router,
        private requestService: RequestService,
        public fb: FormBuilder,
    ) {
        this.requestForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
            description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
            urgency: ['', Validators.required],
            duration: ['', Validators.required],
            incentive: ['', Validators.maxLength(200)],
        })
    }

    ngOnInit(): void {
        this.auth.getUser().pipe().subscribe(user => {

            // Get user details.
            this.userID = user.uid;
            this.displayName = user.displayName;
        })
    }

    get title() { return this.requestForm.get('title') }
    get description() { return this.requestForm.get('description') }
    get incentive() { return this.requestForm.get('incentive') }
    get duration() { return this.requestForm.get('duration') }
    get urgency() { return this.requestForm.get('urgency') }

    submitRequest() {

        //handle invalid form
        if (this.requestForm.controls['title'].invalid.valueOf() || this.requestForm.controls['incentive'].invalid.valueOf()
            || this.requestForm.controls['description'].invalid.valueOf() || this.requestForm.controls['duration'].invalid.valueOf()
            || this.requestForm.controls['urgency'].invalid.valueOf()) {
            alert("Incomplete Form!");
            return;
        }
        var formDetails = {

            // Input details
            title: this.title.value,
            description: this.description.value,
            incentive: this.incentive.value,
            duration: Number(this.duration.value),
            urgency: this.urgency.value,

            // Other details
            createdBy: this.userID,
            timeStamp: Date.now(),
            status: "active",
            helper: "nil",
            helpTimeStamp: "nil",
        }

        this.requestService.addRequest(formDetails).then(() => {
            alert("Request successfully added!");
            this.requestForm.reset();
            // location.reload();
        });


    }

}

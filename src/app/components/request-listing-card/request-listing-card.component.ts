import { Component, OnInit, Input } from '@angular/core';
import { RequestService } from "../../services/request/request.service";
declare var $: any;

@Component({
    selector: 'app-request-listing-card',
    templateUrl: './request-listing-card.component.html',
    styleUrls: ['./request-listing-card.component.css']
})
export class RequestListingCardComponent implements OnInit {
    @Input() requestID: any;
    @Input() title: any;
    @Input() description: any;


    constructor(
        private requestService: RequestService,
    ) { }

    ngOnInit(): void {
    }
    

    seeRequestDetails() {
        console.log("request ID : " + this.requestID + ", title: " + this.title + ", description: " + this.description);
        if (this.requestID && this.title && this.description) {
            var details = {
                requestID: this.requestID,
                title: this.title,
                description: this.description,
            }
            this.requestService.sendRequestDetails(details);
            $('#request-details').modal('show');
        } else {
            alert("This request has incomplete details!");
        }

    }

}

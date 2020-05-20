import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../services/request/request.service'; 
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.css']
})
export class NewRequestComponent implements OnInit {
    items:any;
    requestForm : FormGroup;

  constructor(
      private requestService: RequestService,
      public fb: FormBuilder,
  ) { 
      this.requestForm = this.fb.group({
          description: '',
        //   urgency: '',
        //   duration: '',
        //   incentive: '',
        //   contact: '',
      })
  }

  ngOnInit(): void {
      this.items
  }

  get description() { return this.requestForm.get('description') }

  submitRequest() {
      var formDetails = {
          description: this.description.value,
      }

      this.requestService.addRequest(formDetails);
      
      this.requestForm.reset();
  }

}

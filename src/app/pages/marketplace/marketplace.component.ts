import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {
  displayName: any;
  constructor(public auth: AuthService) {
    
   }

  ngOnInit(): void {
    this.auth.user.subscribe(x => {
      this.displayName = x.displayName;
    })
    
  }

}

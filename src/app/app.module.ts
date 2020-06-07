import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Firestore
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule} from '@angular/fire/storage';

// Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './pages/login/login.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RequestListingCardComponent } from './components/request-listing-card/request-listing-card.component';
import { HomeComponent } from './pages/home/home.component'
import { NewRequestComponent } from './pages/explore/new-request/new-request.component'
import {NgxPaginationModule} from 'ngx-pagination';
import { RequestDetailsComponent } from './components/request-details/request-details.component';
import { MarketplaceComponent } from './pages/marketplace/marketplace.component';
import { NewListingComponent } from './pages/marketplace/new-listing/new-listing/new-listing.component';
import { ListingService } from './services/listing/listing.service';
import { ListingCardComponent } from './components/listing-card/listing-card.component';

// My web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCRmyGZno8HZi7mLkLxpYeHNaK3aILW7cA",
    authDomain: "splashbros-126a0.firebaseapp.com",
    databaseURL: "https://splashbros-126a0.firebaseio.com",
    projectId: "splashbros-126a0",
    storageBucket: "splashbros-126a0.appspot.com",
    messagingSenderId: "382839271682",
    appId: "1:382839271682:web:10b7b924e3a6b1854b521b",
    measurementId: "G-33FQ17N2YX"
  };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ExploreComponent,
    NavbarComponent,
    RequestListingCardComponent,
    HomeComponent,
    NewRequestComponent,
    RequestDetailsComponent,
    MarketplaceComponent,
    NewListingComponent,
    ListingCardComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    NgxPaginationModule,
    NgbModule
  ],
  providers: [ListingService],
  bootstrap: [AppComponent]
})
export class AppModule {
 }

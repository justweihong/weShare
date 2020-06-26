// Angular core modules.
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { MarketplaceComponent } from './pages/marketplace/marketplace.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';

// Authentication
import { AuthGuard } from './services/auth/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';






const routes: Routes = [

    { path: 'home', component: HomeComponent},
    { path: 'login', component: LoginComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},

    // requests
    { path: 'explore', redirectTo: 'explore/all'},
    { path: 'explore/all-requests', component: ExploreComponent, canActivate: [AuthGuard]},
    { path: 'explore/my-requests', component: ExploreComponent, canActivate: [AuthGuard]},
    { path: 'explore/accepted-requests', component: ExploreComponent, canActivate: [AuthGuard]},

    // marketplace
    { path: 'marketplace', redirectTo: 'marketplace/all-listings'},
    { path: 'marketplace/all-listings', component: MarketplaceComponent, canActivate: [AuthGuard]},
    { path: 'marketplace/my-listings', component: MarketplaceComponent, canActivate: [AuthGuard]},
    { path: 'marketplace/ongoing-listings', component: MarketplaceComponent, canActivate: [AuthGuard]},
    { path: 'marketplace/completed-listings', component: MarketplaceComponent, canActivate: [AuthGuard]},


    { path: '**', redirectTo: 'home' } //wildcard
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

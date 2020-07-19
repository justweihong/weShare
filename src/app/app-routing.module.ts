// Angular core modules.
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { MarketplaceComponent } from './pages/marketplace/marketplace.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { LeaderboardComponent } from './pages/leaderboard/leaderboard.component';

// Authentication
import { AuthGuard } from './guards/auth/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileGuard } from './guards/profile/profile.guard';
import { ChatComponent } from './chat/chat.component';






const routes: Routes = [

    { path: 'home', component: HomeComponent},
    { path: 'login', component: LoginComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
    { path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuard, ProfileGuard]},

    // requests
    { path: 'explore', redirectTo: 'explore/all'},
    { path: 'explore/all-requests', component: ExploreComponent, canActivate: [AuthGuard, ProfileGuard]},
    { path: 'explore/my-requests', component: ExploreComponent, canActivate: [AuthGuard, ProfileGuard]},
    { path: 'explore/accepted-requests', component: ExploreComponent, canActivate: [AuthGuard, ProfileGuard]},

    // marketplace
    { path: 'marketplace', redirectTo: 'marketplace/all-listings'},
    { path: 'marketplace/all-listings', component: MarketplaceComponent, canActivate: [AuthGuard, ProfileGuard]},
    { path: 'marketplace/my-listings', component: MarketplaceComponent, canActivate: [AuthGuard, ProfileGuard]},
    { path: 'marketplace/ongoing-listings', component: MarketplaceComponent, canActivate: [AuthGuard, ProfileGuard]},
    { path: 'marketplace/completed-listings', component: MarketplaceComponent, canActivate: [AuthGuard, ProfileGuard]},

    // chat
    { path: 'chat', component: ChatComponent, canActivate: [AuthGuard, ProfileGuard]},
    { path: 'chat/:id', component: ChatComponent, canActivate: [AuthGuard, ProfileGuard]},

    { path: '**', redirectTo: 'home' } //wildcard
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

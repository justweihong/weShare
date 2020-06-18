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






const routes: Routes = [

    { path: 'home', component: HomeComponent}, // Landing Page
    { path: 'login', component: LoginComponent },
    { path: 'explore', component: ExploreComponent, canActivate: [AuthGuard]}, // Only registered users.
    { path: 'marketplace', component: MarketplaceComponent, canActivate: [AuthGuard]}, // Only registered users.
    { path: '**', redirectTo: 'home' }
    //{ path: 'explore', redirectTo: '/explore'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// Imports
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {UserListComponent} from './users/user-list.component';
import {RideListComponent} from "./rides/rider-list.component";

// Route Configuration
export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'users', component: UserListComponent},
  {path: 'rides', component: RideListComponent}
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);

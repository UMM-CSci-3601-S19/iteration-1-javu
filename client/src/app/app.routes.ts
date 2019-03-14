// Imports
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {RideListComponent} from "./rides/ride-list.component";


// Route Configuration
export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'rides', component: RideListComponent}
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);

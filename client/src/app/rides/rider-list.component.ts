import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Ride} from "./ride";
import {RideListService} from "./ride-list.service";

export class RideListComponent implements OnInit {

  public rides: Ride[];
  public filteredRides: Ride[];

  public rideDestination: string;


  constructor(public rideListService: RideListService) {
  }



  public filterRides(searchDestination: string): Ride[] {

    this.filteredRides = this.rides;


    if (searchDestination != null) {
      searchDestination = searchDestination.toLocaleLowerCase();

      this.filteredRides = this.filteredRides.filter(ride => {
        return !searchDestination || ride.name.toLowerCase().indexOf(searchDestination) !== -1;
      });
    }


    return this.filteredRides;
  }


  refreshRides(): Observable<Ride[]> {

    const rides: Observable<Ride[]> = this.rideListService.getRides();
    rides.subscribe(
      rides => {
        this.rides = rides;
        this.filterRides(this.rideDestination);
      },
      err => {
        console.log(err);
      });
    return rides;
  }


  ngOnInit(): void {
    this.refreshRides();
  }
}

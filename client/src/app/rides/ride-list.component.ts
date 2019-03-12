import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Ride} from "./ride";
import {RideListService} from "./ride-list.service";
import {AddRideComponent} from "./add-ride.component";
import{MatDialog} from "@angular/material";


@Component({
  selector: 'ride-list-component',
  templateUrl: 'ride-list.component.html',
  styleUrls: ['./ride-list.component.css'],
})


export class RideListComponent implements OnInit {

  public rides: Ride[];
  public filteredRides: Ride[];

  public rideDestination: string;

  private highlightedDestination: string = '';


  constructor(public rideListService: RideListService, public dialog: MatDialog) {
  }

  isHighlighted(ride: Ride): boolean {
    return ride.destination === this.highlightedDestination;
  }


  openDialog(): void {
    const newRide: Ride = {driver: '', destination: '', origin: '', roundTrip: false, departureTime: '', notes: ''};
    const dialogRef = this.dialog.open(AddRideComponent, {
      width: '500px',
      data: {ride: newRide}
    });

    dialogRef.afterClosed().subscribe(newRide => {
      if (newRide != null) {

        this.rideListService.addNewRide(newRide).subscribe(
          result => {
            this.highlightedDestination = result;
            this.refreshRides();
          },
          err => {
            // This should probably be turned into some sort of meaningful response.
            console.log('There was an error adding the ride.');
            console.log('The newRide or dialogResult was ' + JSON.stringify(newRide));
            console.log('The error was ' + JSON.stringify(err));
          });
      }
    });
  }

  openEditDialog(currentDriver: string, currentDestination: string, currentOrigin: string, currentRoundTrip: boolean, currentDepartureTime: string, currentNotes: string): void {
    const currentRide: Ride = {
      driver: currentDriver,
      destination: currentDestination,
      origin: currentOrigin,
      roundTrip: currentRoundTrip,
      departureTime: currentDepartureTime,
      notes: currentNotes
    };
    const dialogRef = this.dialog.open(EditRideComponent, {
      width: '500px',
      currentData: {ride: currentRide}
    });

    dialogRef.afterClosed().subscribe(currentRide => {
      if (currentRide != null) {

        this.rideListService.EditRide(currentRide).subscribe(
          result => {
            this.highlightedDestination = result;
            console.log("The result is " + result);
            this.refreshRides();
          },
          err => {
            console.log('There was an error editing the ride.');
            console.log('The currentRide or dialogResult was ' + JSON.stringify(currentRide));
            console.log('The error was ' + JSON.stringify(err));
          });
      }
    });
  }

  public filterRides(searchDestination: string): Ride[] {

    this.filteredRides = this.rides;

    if (searchDestination != null) {
      searchDestination = searchDestination.toLocaleLowerCase();

      this.filteredRides = this.filteredRides.filter(ride => {
        return !searchDestination || ride.destination.toLowerCase().indexOf(searchDestination) !== -1;
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

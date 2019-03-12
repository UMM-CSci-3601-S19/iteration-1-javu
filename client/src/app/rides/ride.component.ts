import {Component, OnInit} from '@angular/core';
import {RideListService} from "./ride-list.service";
import {Ride} from "./ride";

@Component({
  selector: 'ride-component',
  templateUrl: 'ride.component.html',
  styleUrls: ['./ride.component.css'],
})

export class RideComponent implements OnInit {

  public ride: Ride = null;
  private destination: string;


  constructor(private rideListService: RideListService) {
  }

  private subscribeToServiceForDestination() {
    if (this.destination) {
      this.rideListService.getRideByDestination(this.destination).subscribe(
        ride => this.ride = ride,
        err => {
          console.log(err);
        }
      );
    }
  }

  setDestination(destination: string) {
    this.destination = destination;
    this.subscribeToServiceForDestination();
  }

  ngOnInit(): void {
    this.subscribeToServiceForDestination();
  }


}

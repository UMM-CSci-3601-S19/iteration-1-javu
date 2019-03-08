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
  private driver: string;


  constructor(private rideListService: RideListService) {
  }

  private subscribeToServiceForDriver() {
    if (this.driver) {
      this.rideListService.getRideByDriver(this.driver).subscribe(
        ride => this.ride = ride,
        err => {
          console.log(err);
        }
      );
    }
  }

  setDriver(driver: string) {
    this.driver = driver;
    this.subscribeToServiceForDriver();
  }

  ngOnInit(): void {
    this.subscribeToServiceForDriver();
  }


}

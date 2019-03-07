import {Component, OnInit} from '@angular/core';
import {RideListService} from "./ride-list.service";
import {Ride} from "./ride";

@Component({
  selector: 'ride-component',
  templateUrl: 'ride.component.html',
  styleUrls: ['./ride.component.css']
})

export class RideComponent implements OnInit {
  public ride: Ride = null;

  constructor(private rideListService: RideListService) {}


}

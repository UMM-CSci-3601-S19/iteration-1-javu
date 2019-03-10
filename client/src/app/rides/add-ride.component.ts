import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Ride} from './ride';
import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";
//This validator will have to be specific to what we want validated and most likely this will be a DestinationValidator.
import {DestinationValidator} from './destination.validator';

@Component({
  selector: 'add-ride.component',
  templateUrl: 'add-ride.component.html',
})

export class AddRideComponent implements OnInit {
  addRideForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { ride: Ride }, private fb: FormBuilder) {
  }

  add_ride_validation_messages = {
    'destination': [
      {type: 'required', message: 'Destination is required'},
      {type: 'minlength', message: 'Destination must be at least 2 characters long'},
      {type: 'maxlength', message: 'Destination cannot be more than 100 characters long'}
    ],
    'driver': [
      {type: 'required', message: 'Driver is required'},
      {type: 'minlength', message: 'Driver must be at least 2 characters long'},
      {type: 'maxlength', message: 'Driver cannot be more than 50 characters long'},
      {type: 'pattern', message: 'Driver must contain only numbers and letters'}
    ],
    'origin': [
      {type: 'required', message: 'Origin is required'},
      {type: 'minlength', message: 'Origin must be at least 2 characters long'},
      {type: 'maxlength', message: 'Origin cannot be more than 100 characters long'}
    ],
    'departureTime': [
      {type: 'required', message: 'DepartureTime is required'},
      {type: 'minlength', message: 'DepartureTime must be at least 2 characters long'},
      {type: 'maxlength', message: 'DepartureTime cannot be more than 100 characters long'}
    ],
    'notes': [
      {type: 'required', message: 'Notes is required'},
      {type: 'minlength', message: 'Notes must be at least 2 characters long'},
      {type: 'maxlength', message: 'Notes cannot be more than 150 characters long'}
    ]
  };

  createForms() {
    this.addRideForm = this.fb.group({
      destination: new FormControl('destination', Validators.compose([
        //Must make a destination.validator.ts file for this next line to work
        DestinationValidator.validDestination,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.required
      ])),
      driver: new FormControl('driver', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.required,
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?')
      ])),
      origin: new FormControl('origin', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.required
      ])),
      departureTime: new FormControl('departureTime', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.required
      ])),
      notes: new FormControl('notes', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(150),
        Validators.required
      ]))

    })
  }

  ngOnInit() {
    this.createForms();
  }

}

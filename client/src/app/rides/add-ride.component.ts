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
      {type: 'maxlength', message: 'Destination cannot be more than 25 characters long'},
      {type: 'pattern', message: 'Destination must contain only numbers and letters'}
    ]
  };

  createForms() {
    this.addRideForm = this.fb.group({
      destination: new FormControl('destination', Validators.compose([
        //Must make a destination.validator.ts file for this next line to work
        DestinationValidator.validDestination,
        Validators.minLength(2),
        Validators.maxLength(25),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?'),
        Validators.required
      ]))
    })
  }

  ngOnInit() {
    this.createForms();
  }

}

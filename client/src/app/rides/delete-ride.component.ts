import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Ride} from './ride';
import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";


@Component({
  selector: 'delete-ride.component',
  templateUrl: 'delete-ride.component.html',
})

export class DeleteRideComponent implements OnInit {
  currentId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id : Object }, private fb: FormBuilder) {
  }
  ngOnInit(): void {
  }
}

import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {User} from './user';

@Component({
    selector: 'add-user.component',
    templateUrl: 'add-user.component.html',
})
export class AddUserComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {user: User}) {
    }
}

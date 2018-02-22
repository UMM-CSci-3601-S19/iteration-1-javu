import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {User} from './user';

@Component({
    selector: 'add-user.component',
    templateUrl: 'add-user.component.html',
})
export class AddUserComponent {
    constructor(
        public dialogRef: MatDialogRef<AddUserComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {user: User}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}

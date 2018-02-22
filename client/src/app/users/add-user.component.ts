import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material'
import {UserListService} from "./user-list.service";
import {User} from "./user";


@Component({
    selector: 'add-user.component',
    templateUrl: 'add-user.component.html',
})
export class AddUserComponent {
    public newUserName:string;
    public newUserAge: number;
    public newUserCompany: string;
    public newUserEmail: string;
    private userAddSuccess : Boolean = false;

    public users: User[];

    constructor(public userListService: UserListService,
        public dialogRef: MatDialogRef<AddUserComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {user: User}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}

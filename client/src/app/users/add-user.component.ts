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
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    addNewUser(name: string, age: number, company : string, email : string) : void{

        //Here we clear all the fields, there's probably a better way
        //of doing this could be with forms or something else
        this.newUserName = null;
        this.newUserAge = null;
        this.newUserCompany = null;
        this.newUserEmail = null;

        this.userListService.addNewUser(name, age, company, email).subscribe(
            succeeded => {
                this.userAddSuccess = succeeded;
                // Once we added a new User, refresh our user list.
                // There is a more efficient method where we request for
                // this new user from the server and add it to users, but
                // for this lab it's not necessary
                //this.userListComponent.refreshUsers();
            });
    }

}

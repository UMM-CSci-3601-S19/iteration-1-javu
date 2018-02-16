import {Component, OnInit} from '@angular/core';
import {UserListService} from "./user-list.service";
import {User} from "./user";
import {Observable} from "rxjs";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AddUserComponent} from "./add-user.component"

@Component({
    selector: 'user-list-component',
    templateUrl: 'user-list.component.html',
    styleUrls: ['./user-list.component.css'],
    providers: []
})

export class UserListComponent implements OnInit {
    //These are public so that tests can reference them (.spec.ts)
    public users: User[];
    public filteredUsers: User[];

    public userName : string;
    public userAge : number;
    public userCompany : string;

    public loadReady: boolean = false;

    //Inject the UserListService into this component.
    //That's what happens in the following constructor.
    //panelOpenState: boolean = false;
    //We can call upon the service for interacting
    //with the server.
    constructor(public userListService: UserListService, public dialog: MatDialog) {

    }

    openDialog(): void {
        let dialogRef = this.dialog.open(AddUserComponent, {
            width: '500px',
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }


    public filterUsers(searchName: string, searchAge: number): User[] {

        this.filteredUsers = this.users;

        //Filter by name
        if (searchName != null) {
            searchName = searchName.toLocaleLowerCase();

            this.filteredUsers = this.filteredUsers.filter(user => {
                return !searchName || user.name.toLowerCase().indexOf(searchName) !== -1;
            });
        }

        //Filter by age
        if (searchAge != null) {
            this.filteredUsers = this.filteredUsers.filter(user => {
                return !searchAge || user.age == searchAge;
            });
        }

        return this.filteredUsers;
    }

    /**
     * Starts an asynchronous operation to update the users list
     *
     */
    refreshUsers(): Observable<User[]> {
        //Get Users returns an Observable, basically a "promise" that
        //we will get the data from the server.
        //
        //Subscribe waits until the data is fully downloaded, then
        //performs an action on it (the first lambda)

        let users : Observable<User[]> = this.userListService.getUsers();
        users.subscribe(
            users => {
                this.users = users;
                this.filterUsers(this.userName, this.userAge);
            },
            err => {
                console.log(err);
            });
        return users;
    }


    loadService(): void {
        this.loadReady = true;
        this.userListService.getUsers(this.userCompany).subscribe(
            users => {
                this.users = users;
                this.filteredUsers = this.users;
            },
            err => {
                console.log(err);
            }
        );
    }


    ngOnInit(): void {
        this.refreshUsers();
        this.loadService();
    }
}

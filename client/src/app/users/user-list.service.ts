import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from "rxjs";
import "rxjs/add/operator/map";

import {User} from './user';
import {environment} from "../../environments/environment";


@Injectable()
export class UserListService {
    readonly baseUserUrl: string = environment.API_URL + "users";
    private activeUserUrl: string = this.baseUserUrl;
    public serviceContent: string = "";
    constructor(private http: HttpClient) {
    }

    getUsers(): Observable<User[]> {
        this.filterByCompany();
        return this.http.get<User[]>(this.activeUserUrl);
    }

    getUserById(id: string): Observable<User> {
        return this.http.get<User>(this.baseUserUrl + "/" + id);
    }

    filterByCompany(): void{

        if(this.serviceContent !== ""){
            console.log("I got here");
            if (this.activeUserUrl.indexOf('&') !== -1) {
                this.activeUserUrl += 'company=' + this.serviceContent + '&';
            }
            else {
                this.activeUserUrl += "?company=" + this.serviceContent + "&";
            }
        }
    }

    addNewUser(name: string, age: number, company : string, email : string): Observable<Boolean> {
        const body = {name:name, age:age, company:company, email:email};
        console.log(body);

        //Send post request to add a new user with the user data as the body with specified headers.
        return this.http.post<Boolean>(this.baseUserUrl + "/new", body);
    }
}

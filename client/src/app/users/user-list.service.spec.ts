import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {User} from './user';
import {UserListService} from './user-list.service';

describe('User list service: ', () => {
    // A small collection of test users
    const testUsers: User[] = [
        {
            _id: 'chris_id',
            name: 'Chris',
            age: 25,
            company: 'UMM',
            email: 'chris@this.that'
        },
        {
            _id: 'pat_id',
            name: 'Pat',
            age: 37,
            company: 'IBM',
            email: 'pat@something.com'
        },
        {
            _id: 'jamie_id',
            name: 'Jamie',
            age: 37,
            company: 'Frogs, Inc.',
            email: 'jamie@frogs.com'
        }
    ];
    let userListService: UserListService;
    // These are used to mock the HTTP requests so that we (a) don't have to
    // have the server running and (b) we can check exactly which HTTP
    // requests were made to ensure that we're making the correct requests.
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        // Set up the mock handling of the HTTP requests
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        // Construct an instance of the service with the mock
        // HTTP client.
        userListService = new UserListService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('getUsers() calls api/users', () => {
        // Assert that the users we get from this call to getUsers()
        // should be our set of test users. Because we're subscribing
        // to the result of getUsers(), this won't actually get
        // checked until the mocked HTTP request "returns" a response.
        // This happens when we call req.flush(testUsers) a few lines
        // down.
        userListService.getUsers().subscribe(
            users => expect(users).toBe(testUsers)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(userListService.baseUrl);
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testUsers);
    });

    it('getUserById() calls api/users/id', () => {
        const targetUser: User = testUsers[1];
        const targetId: string = targetUser._id;
        userListService.getUserById(targetId).subscribe(
            user => expect(user).toBe(targetUser)
        );

        const expectedUrl: string = userListService.baseUrl + '/' + targetId;
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(targetUser);
    });
});

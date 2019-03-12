import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Ride} from "./ride";
import {RideListService} from "./ride-list.service";

describe( 'Ride list service: ', () => {
  const testRides: Ride[] = [
    {
      driver: 'Hagrid',
      destination: 'Hogwarts',
      origin: '4 Privet Drive',
      roundTrip: true,
      departureTime: 'midnight',
      notes: 'I will be arriving in a flying motorcycle'
    },
    {
      driver: 'Lucy',
      destination: 'Narnia',
      origin: 'Wardrobe',
      roundTrip: true,
      departureTime: 'During Hide and Seek',
      notes: 'Dress for cold'
    },
    {
      driver: 'Student',
      destination: 'Morris',
      origin: 'The Outside',
      roundTrip: false,
      departureTime: 'August',
      notes: 'There is no escaping Morris'
    }
  ];

  const rRides: Ride[] = testRides.filter(ride =>
    ride.destination.toLowerCase().indexOf('r') !== -1
  );

  let rideListService: RideListService;
  let searchUrl: string;

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;


  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);

    rideListService = new RideListService(httpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });


  it('getRides() calls api/rides', () => {

    rideListService.getRides().subscribe(
      rides => expect(rides).toBe(testRides)
    );

    const req = httpTestingController.expectOne(rideListService.baseUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(testRides);
  });

  it('getRides(rideDestination) adds appropriate param string to called URL', () => {
    rideListService.getRides('r').subscribe(
      rides => expect(rides).toEqual(rRides)
    );

    const req = httpTestingController.expectOne(rideListService.baseUrl + '?destination=r&');
    expect(req.request.method).toEqual('GET');
    req.flush(rRides);
  });



});

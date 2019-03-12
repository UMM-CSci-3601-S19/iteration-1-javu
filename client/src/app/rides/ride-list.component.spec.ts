import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Ride} from './ride';
import {RideListComponent} from './ride-list.component';
import {RideListService} from './ride-list.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe('Ride list', () => {

  let rideList: RideListComponent;
  let fixture: ComponentFixture<RideListComponent>;

  let rideListServiceStub: {
    getRides: () => Observable<Ride[]>
  };

  beforeEach(()=> {
    rideListServiceStub = {
      getRides: () => Observable.of([
        {
          driver: 'Wendy Huebert',
          destination: 'Minneapolis',
          origin: 'Morris',
          roundTrip: false,
          departureTime: '5:00pm',
          notes: 'I like do drive with loud music.'
        },
        {
          driver: 'Bob Mann',
          destination: 'St. Cloud',
          origin: 'Morris',
          roundTrip: true,
          departureTime: '6:00pm',
          notes: 'I like to drive with pets.'
        },
        {
          driver: 'Jon Ruevers',
          destination: 'Big Lake',
          origin: 'Minneapolis',
          roundTrip: true,
          departureTime: '7:00pm',
          notes: 'I am down to play some music.'
        },
        {
          driver: 'Bill Williams',
          destination: 'California',
          origin: 'Morris',
          roundTrip: false,
          departureTime: '3:00pm',
          notes: 'I am fine with driving large groups of people.'
        },
        {
          driver: 'Sydney Stevens',
          destination: 'Becker',
          origin: 'Morris',
          roundTrip: true,
          departureTime: '5:00pm',
          notes: 'I hate dogs and I am scared to ride with them.'
        },
        {
          driver: 'Sydney Stevens',
          destination: 'Becker',
          origin: 'Morris',
          roundTrip: true,
          departureTime: '7:00pm',
          notes: 'I hate dogs and I am scared to ride with them.'
        }
      ])
    };

    TestBed.configureTestingModule({
      imports: [CustomModule],
      declarations: [RideListComponent],
      providers: [{provide: RideListService, useValue: rideListServiceStub}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(RideListComponent);
      rideList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('contains all the rides', () => {
    expect(rideList.rides.length).toBe(6);
  });

  it('contains a ride driver \'Wendy Huebert\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.driver === 'Wendy Huebert')).toBe(true);
  });

  it('contains a ride driver \'Sydney Stevens\'', () => {
    expect(rideList.rides.filter((ride:Ride) => ride.driver === 'Sydney Stevens').length).toBe(2);
  });

  it('contains a ride driver \'Bill Williams\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.driver === 'Bill Williams')).toBe(true);
  });

  it('Does not contain a ride driver \'Bilbo Baggins\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.driver === 'Bilbo Baggins')).toBe(false);
  });

  it('contains a ride destination \'Big Lake\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.destination === 'Big Lake')).toBe(true);
  });

  it('contains a ride destination \'Becker\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.destination === 'Becker')).toBe(true);
  });

  it('Does not contain a ride destination \'Canada\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.destination === 'canada')).toBe(false);
  });

  it('contains a ride origin \'Morris\'', () => {
    expect(rideList.rides.filter((ride: Ride) => ride.origin === 'Morris').length).toBe(5);
  });

  it('contains a ride origin \'Minneapolis\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.origin === 'Minneapolis')).toBe(true);
  });

  it('Does not contain a ride origin \'Canada\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.origin === 'canada')).toBe(false);
  });

  it('contains a ride roundTrip \'True\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.roundTrip === true));
  });

  it('contains a ride roundTrip \'False\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.roundTrip === false)).toBe(true);
  });

  it('Does not contain the correct number of ride roundTrips \'True\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.roundTrip === true));
  });

  it('contains a ride departureTime \'5:00pm\' and checks multiple cases of this departure time', () => {
    expect(rideList.rides.filter((ride: Ride) => ride.departureTime === '5:00pm').length).toBe(2);
  });

  it('contains a ride departureTime \'3:00pm\' and checks for once instance of this', () => {
    expect(rideList.rides.filter((ride: Ride) => ride.departureTime === '3:00pm').length).toBe(1);
  });

  it('Does not contain a ride departureTime \'12:00pm\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.departureTime === '12:00pm')).toBe(false);
  });

  it('contains a ride notes \'I hate dogs and I am scared to ride with them.\' and checks multiple cases of this note', () => {
    expect(rideList.rides.filter((ride: Ride) => ride.notes === 'I hate dogs and I am scared to ride with them.').length).toBe(2);
  });

  it('contains a ride notes \'I like to drive with pets.\' and checks for once instance of this', () => {
    expect(rideList.rides.some((ride: Ride) => ride.notes === 'I like to drive with pets.')).toBe(true);
  });

  it('Does not contain a ride notes \'I like to ride alone\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.notes === 'I like to ride alone')).toBe(false);
  });

});

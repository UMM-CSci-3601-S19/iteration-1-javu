import {RidePage} from './ride-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

const origFn = browser.driver.controlFlow().execute;

browser.driver.controlFlow().execute = function () {
 let args = arguments;

 // queue 100ms wait between test
 // This delay is only put here so that you can watch the browser do its thing.
 // If you're tired of it taking long you can remove this call or change the delay
 // to something smaller (even 0).
 origFn.call(browser.driver.controlFlow(), () => {
   return protractor.promise.delayed(1);
 });

 return origFn.apply(browser.driver.controlFlow(), args);
};

describe('Ride List', () => {
  let page: RidePage;

  beforeEach(() => {
    page = new RidePage();
    page.navigateTo();
  });

  it('should have a Rides title', () => {
    expect(page.getTitle()).toEqual('Rides');
  });

  it('should type something in Filter by Destination box and check that it returned correct element', () => {
    page.typeADestination('d');
    expect(page.getUniqueRide('Duluth')).toEqual('Duluth');
    page.backspace();
    page.typeADestination('Alexandria');
    expect(page.getUniqueRide('Alexandria')).toEqual('Alexandria');
  });

  it('Should have an add ride button', () => {
    page.navigateTo();
    expect(page.elementExistsWithId('addNewRide')).toBeTruthy();
  });

  it('Should open a dialog box when add ride button is clicked', () => {
    page.navigateTo();
    expect(page.elementExistsWithCss('add-ride')).toBeFalsy('There should not be a modal window yet');
    page.click('addNewRide');
    expect(page.elementExistsWithCss('add-ride')).toBeTruthy('There should be a modal window now');
  });

  describe('Add Ride', () => {

    beforeEach(() => {
      page.click('addNewRide');
    });

    it('Should actually add the ride with the information we put in the fields', () => {
      page.field('destinationField').sendKeys('New York');
      page.field('driverField').sendKeys('Bobbbo Billy');
      page.field('departureTimeField').sendKeys('In the morning');
      page.field('originField').sendKeys('Morris');
      page.field('notesField').sendKeys('I do not pick up my trash');
      page.click('roundTripCheckBox');
      expect(page.button('confirmAddRideButton').isEnabled()).toBe(true);
      page.click('confirmAddRideButton');

      const new_york_element = element(by.id('New York'));
      browser.wait(protractor.ExpectedConditions.presenceOf(new_york_element), 10000);

      expect(page.getUniqueRide('New York')).toMatch('New York.*');
    });


  });

}); 

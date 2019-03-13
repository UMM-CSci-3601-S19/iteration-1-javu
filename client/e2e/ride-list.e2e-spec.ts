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
  })
});

import {browser, element, by, promise, ElementFinder} from 'protractor';
import {Key} from 'selenium-webdriver';

export class RidePage {
  navigateTo(): promise.Promise<any> {
    return browser.get('/rides');
  }

  getTitle(){
    const title = element(by.id('ride-list-title')).getText();

    return title;
  }
}

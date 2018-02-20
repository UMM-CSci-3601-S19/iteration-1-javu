import {UserPage} from './user-list.po';
import {browser, protractor} from 'protractor';
import {Key} from "selenium-webdriver";

let origFn = browser.driver.controlFlow().execute;

// https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/
browser.driver.controlFlow().execute = function () {
    let args = arguments;

    // queue 100ms wait between test
    // This delay is only put here so that you can watch the browser do its thing.
    // If you're tired of it taking long you can remove this call
    origFn.call(browser.driver.controlFlow(), function () {
        return protractor.promise.delayed(100);
    });

    return origFn.apply(browser.driver.controlFlow(), args);
};

describe('User list', () => {
    let page: UserPage;

    beforeEach(() => {
        page = new UserPage();
    });

    it('should get and highlight Users title attribute ', () => {
        page.navigateTo();
        expect(page.getUserTitle()).toEqual('Users');
    });

    it('should type something in filter name box and check that it returned correct element', () => {
        page.navigateTo();
        page.typeAName("t");
        expect(page.getUniqueUser("kittypage@surelogic.com")).toEqual("Kitty Page");
        page.backspace();
        page.typeAName("lynn");
        expect(page.getUniqueUser("lynnferguson@niquent.com")).toEqual("Lynn Ferguson");
    });

    it('should click on the age 27 times and return 3 elements then ', () => {
        page.navigateTo();
        page.getUserByAge();
        for (let i = 0; i < 27; i++) {
            page.selectUpKey();
        }

        expect(page.getUniqueUser("stokesclayton@momentia.com")).toEqual("Stokes Clayton");

        expect(page.getUniqueUser("merrillparker@escenta.com")).toEqual("Merrill Parker");
    });

    it("Should open the expansion panel and get the company", ()=>{
        page.navigateTo();
        page.getCompany("DATA");
        browser.actions().sendKeys(Key.ENTER).perform();

        expect(page.getUniqueUser("valerieerickson@datagene.com")).toEqual("Valerie Erickson");

        //This is just to show that the panels can be opened
        browser.actions().sendKeys(Key.TAB).perform();
        browser.actions().sendKeys(Key.ENTER).perform();
    });

    it("Should allow us to filter users based on company", ()=>{
        page.navigateTo();
        page.getCompany("o");
        page.getUsers().then(function(users) {
            expect(users.length).toBe(4);
        });
        expect(page.getUniqueUser("conniestewart@ohmnet.com")).toEqual("Connie Stewart");
        expect(page.getUniqueUser("stokesclayton@momentia.com")).toEqual("Stokes Clayton");
        expect(page.getUniqueUser("kittypage@surelogic.com")).toEqual("Kitty Page");
        expect(page.getUniqueUser("margueritenorton@recognia.com")).toEqual("Marguerite Norton");
    });

    it("Should allow us to clear a search for company and then still successfully search again", ()=> {
        page.navigateTo();
        page.getCompany("m");
        page.getUsers().then(function(users) {
            expect(users.length).toBe(2);
        });
        page.clickClearCompanySearch();
        page.getUsers().then(function(users) {
            expect(users.length).toBe(10);
        });
        page.getCompany("ne");
        page.getUsers().then(function(users) {
            expect(users.length).toBe(3);
        });
    })
});

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MatDialogRef, MAT_DIALOG_DATA, MATERIAL_COMPATIBILITY_MODE} from '@angular/material';

import {AddUserComponent} from "./add-user.component";
import {CustomModule} from "../custom.module";

describe('Add user component', () => {

    let addUserComponent: AddUserComponent;
    let calledClose: boolean;
    let mockMatDialogRef = {
        close() { calledClose = true }
    };
    let data = null;
    let fixture: ComponentFixture<AddUserComponent>;

    beforeEach(async( () => {
        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [AddUserComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: data },
                { provide: MATERIAL_COMPATIBILITY_MODE, useValue: true }]
        }).compileComponents().catch(error => {
            expect(error).toBeNull();
        });
    }));

    beforeEach(() => {
        calledClose = false;
        fixture = TestBed.createComponent(AddUserComponent);
        addUserComponent = fixture.componentInstance;
    });

    it('closes properly', () => {
        addUserComponent.onNoClick();
        expect(calledClose).toBe(true);
    })

});

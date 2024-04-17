import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSchemaDialogComponent } from './add-schema-dialog.component';

describe('AddSchemaDialogComponent', () => {
  let component: AddSchemaDialogComponent;
  let fixture: ComponentFixture<AddSchemaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSchemaDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSchemaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

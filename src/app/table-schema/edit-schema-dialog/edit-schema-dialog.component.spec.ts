import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSchemaDialogComponent } from './edit-schema-dialog.component';

describe('EditSchemaDialogComponent', () => {
  let component: EditSchemaDialogComponent;
  let fixture: ComponentFixture<EditSchemaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditSchemaDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditSchemaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

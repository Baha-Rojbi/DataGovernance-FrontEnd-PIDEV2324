import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDataTableDialogComponent } from './edit-data-table-dialog.component';

describe('EditDataTableDialogComponent', () => {
  let component: EditDataTableDialogComponent;
  let fixture: ComponentFixture<EditDataTableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDataTableDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditDataTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDataTableFormComponent } from './create-data-table-form.component';

describe('CreateDataTableFormComponent', () => {
  let component: CreateDataTableFormComponent;
  let fixture: ComponentFixture<CreateDataTableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDataTableFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDataTableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

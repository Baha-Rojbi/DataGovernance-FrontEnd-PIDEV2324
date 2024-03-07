import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableListComponent } from './data-table-list.component';

describe('DataTableListComponent', () => {
  let component: DataTableListComponent;
  let fixture: ComponentFixture<DataTableListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataTableListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataTableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

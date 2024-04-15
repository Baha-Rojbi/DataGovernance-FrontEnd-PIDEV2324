import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaDetailsComponent } from './schema-details.component';

describe('SchemaDetailsComponent', () => {
  let component: SchemaDetailsComponent;
  let fixture: ComponentFixture<SchemaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemaDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchemaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

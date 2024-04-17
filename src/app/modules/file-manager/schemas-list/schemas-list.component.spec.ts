import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemasListComponent } from './schemas-list.component';

describe('SchemasListComponent', () => {
  let component: SchemasListComponent;
  let fixture: ComponentFixture<SchemasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemasListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchemasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

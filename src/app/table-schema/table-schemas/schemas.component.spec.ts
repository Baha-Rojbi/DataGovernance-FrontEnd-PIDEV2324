import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemasComponent } from './schemas.component';

describe('SchemasComponent', () => {
  let component: SchemasComponent;
  let fixture: ComponentFixture<SchemasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchemasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchemasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

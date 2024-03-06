import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserValidationListComponent } from './user-validation-list.component';

describe('UserValidationListComponent', () => {
  let component: UserValidationListComponent;
  let fixture: ComponentFixture<UserValidationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserValidationListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserValidationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

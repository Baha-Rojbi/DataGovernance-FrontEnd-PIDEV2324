import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { authorizationtionGuard } from './authorization.guard';


describe('MyGuardGuard', () => {
  let guard: authorizationtionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [authorizationtionGuard]
    });
    guard = TestBed.inject(authorizationtionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  // Write more test cases to cover different scenarios
});

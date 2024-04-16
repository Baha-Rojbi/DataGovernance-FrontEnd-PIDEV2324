import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { authenticationGuard } from './authentication.guard';


describe('MyGuardGuard', () => {
  let guard: authenticationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [authenticationGuard]
    });
    guard = TestBed.inject(authenticationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  // Write more test cases to cover different scenarios
});

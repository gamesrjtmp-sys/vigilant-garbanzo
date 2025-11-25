import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutPasosComponent } from './checkout-pasos.component';

describe('CheckoutPasosComponent', () => {
  let component: CheckoutPasosComponent;
  let fixture: ComponentFixture<CheckoutPasosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutPasosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutPasosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

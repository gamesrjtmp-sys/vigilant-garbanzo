import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacidadPoliticaComponent } from './privacidad-politica.component';

describe('PrivacidadPoliticaComponent', () => {
  let component: PrivacidadPoliticaComponent;
  let fixture: ComponentFixture<PrivacidadPoliticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacidadPoliticaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacidadPoliticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

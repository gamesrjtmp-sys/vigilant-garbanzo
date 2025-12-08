import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolucionPoliticaComponent } from './devolucion-politica.component';

describe('DevolucionPoliticaComponent', () => {
  let component: DevolucionPoliticaComponent;
  let fixture: ComponentFixture<DevolucionPoliticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevolucionPoliticaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevolucionPoliticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

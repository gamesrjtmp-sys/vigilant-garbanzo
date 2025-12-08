import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvioPoliticaComponent } from './envio-politica.component';

describe('EnvioPoliticaComponent', () => {
  let component: EnvioPoliticaComponent;
  let fixture: ComponentFixture<EnvioPoliticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvioPoliticaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvioPoliticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

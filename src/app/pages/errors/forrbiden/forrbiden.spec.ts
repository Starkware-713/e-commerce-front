import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Forrbiden } from './forrbiden';

describe('Forrbiden', () => {
  let component: Forrbiden;
  let fixture: ComponentFixture<Forrbiden>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Forrbiden]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Forrbiden);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

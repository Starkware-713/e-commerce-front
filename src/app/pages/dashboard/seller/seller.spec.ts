import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Seller } from './seller';

describe('Seller', () => {
  let component: Seller;
  let fixture: ComponentFixture<Seller>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Seller]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Seller);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerBoss } from './seller-boss';

describe('SellerBoss', () => {
  let component: SellerBoss;
  let fixture: ComponentFixture<SellerBoss>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerBoss]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerBoss);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

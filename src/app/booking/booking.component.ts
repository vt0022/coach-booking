import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, ViewEncapsulation } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BookingComponent {
  firstFormGroup = this._formBuilder.group({});
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.nullValidator],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.nullValidator],
  });
  stepperOrientation: Observable<StepperOrientation>;

  constructor(
    private _formBuilder: FormBuilder,
    breakpointObserver: BreakpointObserver
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  seatGrid: string = "repeat(5, 1fr)";
}

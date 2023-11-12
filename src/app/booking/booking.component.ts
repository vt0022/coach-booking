import { StepperOrientation } from '@angular/cdk/stepper';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, map } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Departure } from '../model/departure';
import { DepartureService } from '../service/departure.service';
import { DestinationService } from '../service/destination.service';
import { Destination } from '../model/destination';
import { LineService } from '../service/line.service';
import { Line } from '../model/line';
import { CoachType } from '../model/coachtype';
import { CoachTypeService } from '../service/coach-type.service';
import { DatePipe } from '@angular/common';
import { Seat } from '../model/seat';
import { PickUpType } from '../model/pickuptype';
import { PickUp } from '../model/pickup';
import { DropOffType } from '../model/dropofftype';
import { DropOff } from '../model/dropoff';
import { DropOffTypeService } from '../service/drop-off-type.service';
import { PickUpTypeService } from '../service/pick-up-type.service';
import { PickUpService } from '../service/pick-up.service';
import { DropOffService } from '../service/drop-off.service';
import { Ticket } from '../model/ticket';
import { TicketService } from '../service/ticket.service';
import { LineSeat } from '../model/lineseat';
import { Passenger } from '../model/passenger';
import { ResponseModel } from '../model/response';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BookingComponent implements OnInit {
  @ViewChild('stepper')
  stepper!: MatStepper;

  ///////////////////////// Reactive form để bind dữ liệu ////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  firstFormGroup = this._formBuilder.group({
    selectedDeparture: [null, Validators.required],
    selectedDestination: [null, Validators.required],
    selectedQuantity: [1, Validators.min(1)],
    isOneWay: [true, Validators.required],
  });

  secondFormGroup = this._formBuilder.group({
    passengerArray: this._formBuilder.array([
      this._formBuilder.group({
        passengerName: ['', Validators.required],
        passengerAge: ['', Validators.required],
        passengerPhone: ['', Validators.required],
        passengerMail: ['', [Validators.email, Validators.required]],
      }),
    ]),
    acceptTerms: [false, Validators.requiredTrue],
  });

  thirdFormGroup = this._formBuilder.group({
    selectedCoachType: [null, Validators.required],
    selectedCoachTypeBack: [null, Validators.required],
    selectedLine: [null, Validators.required],
    selectedLineBack: [null, Validators.required],
    selectedPickUpType: [null, Validators.required],
    selectedPickUpTypeBack: [null, Validators.required],
    selectedPickUp: [null, Validators.required],
    selectedPickUpBack: [null, Validators.required],
    selectedDropOffType: [null, Validators.required],
    selectedDropOffTypeBack: [null, Validators.required],
    selectedDropOff: [null, Validators.required],
    selectedDropOffBack: [null, Validators.required],
    houseNumber: ['', Validators.nullValidator],
    houseNumberBack: ['', Validators.nullValidator],
    note: ['', Validators.nullValidator],
  });

  ///////////////////////// Khai báo biến //////////////////////////
  //////////////////////////////////////////////////////////////////
  stepperOrientation: Observable<StepperOrientation>;
  selectedQuantity: number = 1;
  seatColumnLayout: number = 4;
  seatColumnLayoutBack: number = 4; ////
  departureList?: Departure[];
  destinationList?: Destination[];
  dateList?: Date[];
  dateListBack?: Date[]; ////
  lineList?: Line[];
  lineListBack?: Line[]; ////
  pickUpTypeList?: PickUpType[];
  dropOffTypeList?: DropOffType[];
  pickUpList?: PickUp[];
  pickUpListBack?: PickUp[]; ////
  dropOffList?: DropOff[];
  dropOffListBack?: DropOff[]; ////
  coachTypeList?: CoachType[];
  coachTypeListBack?: CoachType[]; ////
  selectedDeparture: Departure | null | undefined;
  selectedDepartureBack: Departure | null | undefined; ////
  selectedDestination: Destination | null | undefined;
  selectedDestinationBack: Destination | null | undefined; ////
  selectedDate: Date | null | undefined;
  selectedDateBack: Date | null | undefined; ////
  selectedCoachType: CoachType | null | undefined;
  selectedCoachTypeBack: CoachType | null | undefined; ////
  selectedLine: Line | null | undefined;
  selectedLineBack: Line | null | undefined; ////
  selectedSeats: Seat[] = [];
  selectedSeatsBack: Seat[] = []; ////
  selectedLineSeats: LineSeat[] = [];
  selectedLineSeatsBack: LineSeat[] = []; ////
  selectedPickUpType: PickUpType | null | undefined;
  selectedPickUpTypeBack: PickUpType | null | undefined; ////
  selectedPickUp: PickUp | null | undefined;
  selectedPickUpBack: PickUp | null | undefined; ////
  selectedDropOffType: DropOffType | null | undefined;
  selectedDropOffTypeBack: DropOffType | null | undefined; ////
  selectedDropOff: DropOff | null | undefined;
  selectedDropOffBack: DropOff | null | undefined; ////
  bookingPassengers: Passenger[] = [];
  houseNumber: string = '';
  houseNumberBack: string = ''; ////
  note: string = '';
  totalCost: number = 0;
  isOneWay: boolean = true;
  lineInfo: string = 'Vui lòng chọn ngày khởi hành từ A đến B:';
  lineInfoBack: string = 'Vui lòng chọn ngày khởi hành từ B đến A:'; ////
  noti: string = '';
  Array: any;
  ticket = new Ticket();
  isDoubleDecker: boolean = false;
  isDoubleDeckerBack: boolean = false; ////
  isStepThreeCompleted: boolean = false;
  isError: boolean = false;
  response = new ResponseModel();

  ///////////////////////// Constructor //////////////////////////
  ////////////////////////////////////////////////////////////////
  constructor(
    private _formBuilder: FormBuilder,
    breakpointObserver: BreakpointObserver,
    private departureService: DepartureService,
    private destinationService: DestinationService,
    private lineService: LineService,
    private coachTypeService: CoachTypeService,
    private pickUpTypeService: PickUpTypeService,
    private pickUpService: PickUpService,
    private dropOffTypeService: DropOffTypeService,
    private dropOffService: DropOffService,
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ///////////////////////// Render lần đầu ///////////////////////////
  ////////////////////////////////////////////////////////////////////
  ngOnInit(): void {
    this.getDepartureList();
    this.getCouchTypeList();
    this.getPickUpTypeList();
    this.getDropOffTypeList();
    this.addPassenger();
  }

  ///////////////////////// Các event của các thành phần trên giao diện ///////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////

  // Chọn nơi đi
  onSelectDeparture() {
    this.selectedDeparture = this.firstFormGroup.get('selectedDeparture')
      ?.value as Departure | null | undefined;
    this.destinationList = [];
    if (this.selectedDeparture) {
      this.destinationList = this.selectedDeparture.destinations;
      if (this.selectedDestination) {
        // Lấy danh sách ngày có chuyến xe
        this.getAvailableLinesByDesAndDep();
        this.getAvailableLinesBackByDesAndDep();
        this.lineInfo = `Vui lòng chọn ngày khởi hành từ ${this.selectedDeparture.name} đến ${this.selectedDestination.name}:`;
        this.lineInfoBack = `Vui lòng chọn ngày khởi hành từ ${this.selectedDestination.name} đến ${this.selectedDeparture.name}:`;
        this.cdr.detectChanges();
      }
      // Nơi đi trở thành nơi đến của chuyến về
      this.getDestinationBySlug();
    }
  }

  // Chọn nơi đến
  onSelectDestination() {
    this.selectedDestination = this.firstFormGroup.get('selectedDestination')
      ?.value as Destination | null | undefined;
    if (this.selectedDeparture) {
      if (this.selectedDestination) {
        // Lấy danh sách ngày có chuyến xe
        this.getAvailableLinesByDesAndDep();
        this.getAvailableLinesBackByDesAndDep();
        this.lineInfo = `Vui lòng chọn ngày khởi hành từ ${this.selectedDeparture.name} đến ${this.selectedDestination.name}:`;
        this.lineInfoBack = `Vui lòng chọn ngày khởi hành từ ${this.selectedDestination.name} đến ${this.selectedDeparture.name}:`;
        this.cdr.detectChanges();
      }
      // Nơi đến trở thành nơi đi của chuyến về
      this.getDepartureBySlug();
    }
  }

  // Chọn loại vé
  onSelectIsOneWay() {
    this.isOneWay = this.firstFormGroup.get('isOneWay')?.value as boolean;
  }

  // Chọn ngày đi
  onClickDate(date: Date) {
    this.selectedDate = date;
  }

  // Chọn ngày về
  onClickDateBack(date: Date) {
    this.selectedDateBack = date;
  }

  // Chọn số lượng người đi
  onSelectQuantity() {
    this.selectedQuantity = this.firstFormGroup.get('selectedQuantity')
      ?.value as number;
  }

  // Chọn loại giường/ghế khi đi
  onSelectCoachType() {
    this.selectedCoachType = this.thirdFormGroup.get('selectedCoachType')
      ?.value as CoachType | null | undefined;
    // Danh sách chuyến theo giờ của loại ghế/giường
    this.lineList = [];
    // Chuyến đã chọn
    this.selectedLine = null;
    // Ghế đã chọn
    this.selectedSeats = [];
    // Ghế ở của chuyến và xe đã chọn
    this.selectedLineSeats = [];
    // Tìm danh sách chuyến theo giờ
    this.getAvailableLinesByDate();
    console.log(this.lineList);
    // Đặt lại bố cục giường/ghế theo loại xe
    if (this.selectedCoachType?.name === 'Giường nằm 34') {
      this.seatColumnLayout = 5;
      this.isDoubleDecker = true;
    } else if (this.selectedCoachType?.name === 'Giường nằm') {
      this.seatColumnLayout = 5;
      this.isDoubleDecker = true;
    } else if (this.selectedCoachType?.name === 'Ghế nằm') {
      this.seatColumnLayout = 4;
      this.isDoubleDecker = false;
    } else if (this.selectedCoachType?.name === 'Phòng nằm') {
      this.seatColumnLayout = 2;
      this.isDoubleDecker = true;
    }
  }

  // Chọn loại giường/ghế khi về
  onSelectCoachTypeBack() {
    this.selectedCoachTypeBack = this.thirdFormGroup.get(
      'selectedCoachTypeBack'
    )?.value as CoachType | null | undefined;
    // Danh sách chuyến theo giờ của loại ghế/giường
    this.lineListBack = [];
    // Chuyến đã chọn
    this.selectedLineBack = null;
    // Ghế đã chọn
    this.selectedSeatsBack = [];
    // Ghế ở của chuyến và xe đã chọn
    this.selectedLineSeatsBack = [];
    // Tìm danh sách chuyến theo giờ
    this.getAvailableLinesBackByDate();
    // Đặt lại bố cục giường/ghế theo loại xe
    if (this.selectedCoachTypeBack?.name === 'Giường nằm 34') {
      this.seatColumnLayoutBack = 5;
      this.isDoubleDeckerBack = true;
    } else if (this.selectedCoachTypeBack?.name === 'Giường nằm') {
      this.seatColumnLayoutBack = 5;
      this.isDoubleDeckerBack = true;
    } else if (this.selectedCoachTypeBack?.name === 'Ghế nằm') {
      this.seatColumnLayoutBack = 4;
      this.isDoubleDeckerBack = false;
    } else if (this.selectedCoachTypeBack?.name === 'Phòng nằm') {
      this.seatColumnLayoutBack = 2;
      this.isDoubleDeckerBack = true;
    }
  }

  // Chọn chuyến đi
  onSelectLine() {
    this.selectedLine = this.thirdFormGroup.get('selectedLine')?.value as
      | Line
      | null
      | undefined;
    this.selectedSeats = [];
    this.selectedLineSeats = [];
    // Tính tổng tiền
    if (this.selectedLine && this.selectedQuantity) {
      this.totalCost =
        ((this.selectedLine.price || 0) + (this.selectedLineBack?.price || 0)) *
        this.selectedQuantity;
    }
  }

  // Chọn chuyến về
  onSelectLineBack() {
    this.selectedLineBack = this.thirdFormGroup.get('selectedLineBack')
      ?.value as Line | null | undefined;
    this.selectedSeatsBack = [];
    this.selectedLineSeatsBack = [];
    // Tính tổng tiền
    if (this.selectedLineBack && this.selectedQuantity) {
      this.totalCost =
        ((this.selectedLine?.price || 0) + (this.selectedLineBack.price || 0)) *
        this.selectedQuantity;
    }
  }

  // Nhấn nút đi tới trang chọn ghế
  onClickToSeatStep() {
    // Khôi phục lại danh sách hành khách nếu đã sửa đổi
    if (this.secondFormGroup.dirty) {
      this.bookingPassengers = [];
    }

    // Đặt các giá trị mặc định cho các trường bị ẩn
    this.setDefaultField();

    // Xác thực đầu vào
    if (this.secondFormGroup.invalid) {
      this.validateField();
    } else {
      // Lưu lại danh sách khách
      this.storePassengers();
    }
  }

  // Chọn ghế đi
  onSelectSeat(seat: Seat, lineSeat: LineSeat) {
    // Đã chọn ghế đó rồi thì loại bỏ ghế đó ra (click lần 2)
    if (this.selectedSeats.includes(seat)) {
      // Filter để tạo mảng mới không chứa ghế đã chọn
      this.selectedSeats = this.selectedSeats.filter((item) => item !== seat);
      this.selectedLineSeats = this.selectedLineSeats.filter(
        (item) => item !== lineSeat
      );
    } else if (this.selectedSeats.length < this.selectedQuantity) {
      // Check nếu chưa đủ ghế thì cho chọn
      this.selectedSeats.push(seat);
      this.selectedLineSeats.push(lineSeat);
    }
  }

  // Chọn ghế về
  onSelectSeatBack(seat: Seat, lineSeat: LineSeat) {
    // Đã chọn ghế đó rồi thì loại bỏ ghế đó ra (click lần 2)
    if (this.selectedSeatsBack.includes(seat)) {
      // Filter để tạo mảng mới không chứa ghế đã chọn
      this.selectedSeatsBack = this.selectedSeatsBack.filter(
        (item) => item !== seat
      );
      this.selectedLineSeatsBack = this.selectedLineSeatsBack.filter(
        (item) => item !== lineSeat
      );
    } else if (this.selectedSeatsBack.length < this.selectedQuantity) {
      // Check nếu chưa đủ ghế thì cho chọn
      this.selectedSeatsBack.push(seat);
      this.selectedLineSeatsBack.push(lineSeat);
    }
  }

  // Chọn phương thức đón khi đi
  onSelectPickUpType() {
    this.selectedPickUpType = this.thirdFormGroup.get('selectedPickUpType')
      ?.value as PickUpType | null | undefined;
    this.pickUpList = [];
    this.getPickUpList();
  }

  // Chọn phương thức đón khi về
  onSelectPickUpTypeBack() {
    this.selectedPickUpTypeBack = this.thirdFormGroup.get(
      'selectedPickUpTypeBack'
    )?.value as PickUpType | null | undefined;
    this.pickUpListBack = [];
    this.getPickUpListBack();
  }

  // Chọn nơi đón khi đi
  onSelectPickUp() {
    this.selectedPickUp = this.thirdFormGroup.get('selectedPickUp')?.value as
      | PickUp
      | null
      | undefined;
  }

  // Chọn nơi đón khi về
  onSelectPickUpBack() {
    this.selectedPickUpBack = this.thirdFormGroup.get('selectedPickUpBack')
      ?.value as PickUp | null | undefined;
  }

  // Chọn phương thức trả khi đi
  onSelectDropOffType() {
    this.selectedDropOffType = this.thirdFormGroup.get('selectedDropOffType')
      ?.value as DropOffType | null | undefined;
    this.dropOffList = [];
    this.getDropOffList();
  }

  // Chọn phương thức trả khi về
  onSelectDropOffTypeBack() {
    this.selectedDropOffTypeBack = this.thirdFormGroup.get(
      'selectedDropOffTypeBack'
    )?.value as DropOffType | null | undefined;
    this.dropOffListBack = [];
    this.getDropOffListBack();
  }

  // Chọn nơi trả khi đi
  onSelectDropOff() {
    this.selectedDropOff = this.thirdFormGroup.get('selectedDropOff')?.value as
      | DropOff
      | null
      | undefined;
  }

  // Chọn nơi trả khi về
  onSelectDropOffBack() {
    this.selectedDropOffBack = this.thirdFormGroup.get('selectedDropOffBack')
      ?.value as DropOff | null | undefined;
  }

  // Tiến hành đặt vé
  onClickBooking() {
    // Vé một chiều
    if (this.selectedSeats.length < this.selectedQuantity && this.isOneWay) {
      alert('Vui lòng chọn đủ ghế');
    } else if (
      // Vé khứ hồi
      (this.selectedSeats.length < this.selectedQuantity ||
        this.selectedSeatsBack.length < this.selectedQuantity) &&
      !this.isOneWay
    ) {
      alert('Vui lòng chọn đủ ghế');
    } else if (
      this.isOneWay &&
      (!this.selectedCoachType || !this.selectedPickUp || !this.selectedDropOff)
    ) {
      alert('Vui lòng chọn đầy đủ thông tin');
    } else if (
      !this.isOneWay &&
      (!this.selectedCoachType ||
        !this.selectedCoachTypeBack ||
        !this.selectedPickUp ||
        !this.selectedPickUpBack ||
        !this.selectedDropOff ||
        !this.selectedDropOffBack)
    ) {
      alert('Vui lòng chọn đầy đủ thông tin');
    } else {
      this.isStepThreeCompleted = true;
      this.stepper.next();
      // Tạo model để gửi đi
      this.ticket._oneway = this.isOneWay;
      this.ticket.number = this.selectedQuantity;
      this.ticket.note = this.thirdFormGroup.controls['note'].value!;
      if (this.isOneWay) {
        // Vé một chiều
        this.ticket.street_number =
          this.thirdFormGroup.controls['houseNumber'].value!;
        this.ticket.pickUps = [this.selectedPickUp!];
        this.ticket.dropOffs = [this.selectedDropOff!];
        this.ticket.lines = [this.selectedLine!];
        this.ticket.lineSeats = [
          ...this.selectedLineSeats!,
          ...this.selectedLineSeatsBack!,
        ];
      } else {
        // Vé khứ hồi
        this.ticket.street_number =
          this.thirdFormGroup.controls['houseNumber'].value! +
          ' --- ' +
          this.thirdFormGroup.controls['houseNumberBack'].value!;

        this.ticket.pickUps = [this.selectedPickUp!, this.selectedPickUpBack!];
        this.ticket.dropOffs = [
          this.selectedDropOff!,
          this.selectedDropOffBack!,
        ];
        this.ticket.lines = [this.selectedLine!, this.selectedLineBack!];
        this.ticket.lineSeats = [
          ...this.selectedLineSeats!,
          ...this.selectedLineSeatsBack!,
        ];
      }
      this.ticket.cost = this.totalCost;
      this.ticket._paid = false;
      this.ticket.passengers = this.bookingPassengers!;
      this.bookingTicket();
    }
  }

  ///////////////////////// Hàm phụ trợ //////////////////////////////
  //////////////////////////////////////////////////////////////////////

  // Định dạng để hiển thị giờ:phút thay cho chuyến
  formatTime(time?: string): string {
    // Khởi tạo một ngày bất kỳ
    const timeDate = new Date(`2000-01-01T${time}`);
    // Định dạng sang giờ:phút
    return this.datePipe.transform(timeDate, 'HH:mm')!;
  }

  // Tạo một form group cho một hành khách chứa các thông tin
  initPassenger(): FormGroup {
    return this._formBuilder.group({
      passengerName: ['', Validators.required],
      passengerAge: ['', Validators.required],
      passengerPhone: ['', Validators.required],
      passengerMail: ['', [Validators.email, Validators.required]],
    });
  }

  // Thêm một hành khách vào form array
  addPassenger(): void {
    for (let i = 1; i < 5; i++) {
      const passengerArray = <FormArray>(
        this.secondFormGroup.controls['passengerArray']
      );
      passengerArray.push(this.initPassenger());
    }
  }

  // Loại bỏ hành khách khỏi form array
  // (không dùng)
  removePassenger(): void {
    const passengerArray = <FormArray>(
      this.secondFormGroup.controls['passengerArray']
    );
    for (let i = 1; i < passengerArray.length; i++) {
      passengerArray.removeAt(i);
    }
  }

  // Xác thực thông tin hành khách
  validateField() {
    for (let i = 0; i < this.selectedQuantity; i++) {
      if (
        // Trống thông tin
        this.secondFormGroup
          .get('passengerArray')
          ?.get(i.toString())
          ?.get('passengerName')
          ?.hasError('required') ||
        this.secondFormGroup
          .get('passengerArray')
          ?.get(i.toString())
          ?.get('passengerAge')
          ?.hasError('required') ||
        this.secondFormGroup
          .get('passengerArray')
          ?.get(i.toString())
          ?.get('passengerMail')
          ?.hasError('required') ||
        this.secondFormGroup
          .get('passengerArray')
          ?.get(i.toString())
          ?.get('passengerPhone')
          ?.hasError('required')
      ) {
        alert('Vui lòng nhập đầy đủ thông tin');
      }
      const yearOfBirth = this.secondFormGroup
        .get('passengerArray')
        ?.get(i.toString())
        ?.get('passengerAge')
        ?.getRawValue();
      // Nhập năm sinh sai
      if (parseInt(yearOfBirth) < 1900 || parseInt(yearOfBirth) > 2023) {
        alert('Vui lòng nhập năm sinh từ 1900 đến 2023');
      } else if (
        // Nhập email sai định dạng
        this.secondFormGroup
          .get('passengerArray')
          ?.get(i.toString())
          ?.get('passengerMail')
          ?.hasError('email')
      ) {
        alert('Vui lòng email đúng định dạng ...@gmail.com');
      }
    }

    // Chưa chấp nhận điều khoản
    if (this.secondFormGroup.get('acceptTerms')?.invalid) {
      alert('Vui lòng chấp nhận điều khoản dịch vụ');
    }
  }

  // Đặt giá trị mặc định cho các trường thông tin bị ẩn
  // Bởi vì tuỳ theo số lượng người sẽ hiển thị form theo kiểu khác nhau nên input nhận được cũng sẽ thay đổi
  setDefaultField() {
    for (let i = 0; i < this.selectedQuantity; i++) {
      // Số lượng là 2 thì chỉ có một ô điện thoại
      // Số lượng >= 3 thì có thêm một ô điện thoại ở hàng 2
      if ((i === 1 && this.selectedQuantity < 3) || i > 1) {
        this.secondFormGroup
          .get('passengerArray')
          ?.get(i.toString())
          ?.get('passengerPhone')
          ?.setValue('default');
      }

      // Chỉ có một ô email duy nhất ở hàng 1
      if (i !== 0) {
        this.secondFormGroup
          .get('passengerArray')
          ?.get(i.toString())
          ?.get('passengerMail')
          ?.setValue('default@gmail.com');
      }
    }

    // Đặt mặc định cho tất cả những form group còn lại không được sử dụng
    // Nếu số lượng < 5
    for (let i = this.selectedQuantity; i < 5; i++) {
      this.secondFormGroup
        .get('passengerArray')
        ?.get(i.toString())
        ?.get('passengerPhone')
        ?.setValue('default');

      this.secondFormGroup
        .get('passengerArray')
        ?.get(i.toString())
        ?.get('passengerMail')
        ?.setValue('default@gmail.com');

      this.secondFormGroup
        .get('passengerArray')
        ?.get(i.toString())
        ?.get('passengerName')
        ?.setValue('default');

      this.secondFormGroup
        .get('passengerArray')
        ?.get(i.toString())
        ?.get('passengerAge')
        ?.setValue('default');
    }
  }

  // Lưu lại danh sách hành khách
  storePassengers() {
    for (let i = 0; i < this.selectedQuantity; i++) {
      const passenger = new Passenger();
      passenger.name = this.secondFormGroup
        .get('passengerArray')
        ?.get(i.toString())
        ?.get('passengerName')?.value as string;
      passenger.year_of_birth = this.secondFormGroup
        .get('passengerArray')
        ?.get(i.toString())
        ?.get('passengerAge')?.value as number;
      passenger.phone = this.secondFormGroup
        .get('passengerArray')
        ?.get(i.toString())
        ?.get('passengerPhone')?.value as string;
      passenger.email = this.secondFormGroup
        .get('passengerArray')
        ?.get(i.toString())
        ?.get('passengerMail')?.value as string;
      // Để rỗng thông tin nếu gặp giá trị mặc định, tức là ô nhập bị ẩn
      if (passenger.email === 'default@gmail.com') {
        passenger.email = '';
      }
      if (passenger.phone === 'default') {
        passenger.phone = '';
      }
      // Khách đầu tiên là người đặt vé
      if (i === 0) {
        passenger._booking = true;
      }
      // Đưa vào danh sách
      this.bookingPassengers.push(passenger);
    }
  }

  /////////////////////////// Hàm dịch vụ gọi API ////////////////////////////
  ////////////////////////////////////////////////////////////////////////////

  // Gọi service để lấy danh sách loại xe
  getCouchTypeList() {
    this.coachTypeService
      .getCoachTypeList()
      .subscribe((data) => (this.coachTypeList = data['data']));
  }

  // Gọi service để lấy danh sách phương thức đón
  getPickUpTypeList() {
    this.pickUpTypeService
      .getPickUpTypeList()
      .subscribe((data) => (this.pickUpTypeList = data['data']));
  }

  // Gọi service để lấy danh sách phương thức trả
  getDropOffTypeList() {
    this.dropOffTypeService
      .getDropOffTypeList()
      .subscribe((data) => (this.dropOffTypeList = data['data']));
  }

  // Gọi service để đặt vé
  bookingTicket() {
    this.ticketService.createTicket(this.ticket).subscribe((data) => {
      this.response = data;
      if (!this.response.error) {
        this.noti = 'Đặt vé thành công';
        this.isError = false;
      } else {
        this.noti = 'Úi, lỗi rồi! Vui lòng đặt lại!';
        this.isError = true;
      }
    });
  }

  //////////////// Lượt đi ////////////////

  // Gọi service để lấy danh sách nơi đi
  getDepartureList() {
    this.departureService
      .getDepartureList()
      .subscribe((data) => (this.departureList = data['data']));
  }

  // Gọi service để lấy danh sách nơi đến ứng với nơi đi
  getDestinationListByDeparture() {
    if (this.selectedDeparture?.slug) {
      this.destinationService
        ?.getDestinationsByDeparture(this.selectedDeparture?.slug)
        .subscribe((data) => {
          this.destinationList = data?.['data'];
        });
    }
  }

  // Gọi service để lấy danh sách ngày có chuyến xe ứng với nơi đi và nơi đến của lượt đi
  getAvailableLinesByDesAndDep() {
    if (this.selectedDeparture && this.selectedDestination) {
      this.lineService
        .getAvailableLinesByDesAndDep(
          this.selectedDeparture.id,
          this.selectedDestination.id
        )
        .subscribe((data) => (this.dateList = data['data']));
    }
  }

  // Gọi service để lấy danh sách chuyến đi ứng với nơi đi, nơi đến, ngày đi và loại xe của lượt đi
  getAvailableLinesByDate() {
    if (
      this.selectedDeparture &&
      this.selectedDestination &&
      this.selectedDate &&
      this.selectedCoachType
    ) {
      this.lineService
        .getAvailableLinesByDate(
          this.selectedDeparture.id,
          this.selectedDestination.id,
          this.selectedDate,
          this.selectedCoachType.id
        )
        .subscribe((data) => (this.lineList = data['data']));
    }
  }

  // Gọi service để lấy danh sách nơi đón ứng với nơi đi và phương thức đón của lượt đi
  getPickUpList() {
    if (this.selectedDeparture && this.selectedPickUpType) {
      this.pickUpService
        .getPickUpByDepartureAndPickUpType(
          this.selectedDeparture?.id,
          this.selectedPickUpType?.id
        )
        .subscribe((data) => {
          this.pickUpList = data['data'];
        });
    }
  }

  // Gọi service để lấy danh sách nơi trả ứng với nơi đến và phương thức trả của lượt đi
  getDropOffList() {
    if (this.selectedDestination && this.selectedDropOffType) {
      this.dropOffService
        .getDropOffByDestinationAndDropOffType(
          this.selectedDestination.id,
          this.selectedDropOffType.id
        )
        .subscribe((data) => (this.dropOffList = data['data']));
    }
  }

  //////////////// Lượt về ////////////////

  // Gọi service để tìm nơi đi của chuyến về
  getDepartureBySlug() {
    if (this.selectedDestination) {
      this.departureService
        .getDepartureBySlug(this.selectedDestination.slug!)
        .subscribe((data) => (this.selectedDepartureBack = data['data']));
    }
  }

  // Gọi service để tìm nơi đến của chuyến về
  getDestinationBySlug() {
    if (this.selectedDeparture) {
      this.destinationService
        .getDestinationBySlug(this.selectedDeparture.slug!)
        .subscribe((data) => (this.selectedDestinationBack = data['data']));
    }
  }

  // Gọi service để lấy danh sách ngày có chuyến xe ứng với nơi đi và nơi đến của lượt về
  getAvailableLinesBackByDesAndDep() {
    if (this.selectedDepartureBack && this.selectedDestinationBack) {
      this.lineService
        .getAvailableLinesByDesAndDep(
          this.selectedDepartureBack.id,
          this.selectedDestinationBack.id
        )
        .subscribe((data) => (this.dateListBack = data['data']));
    }
  }

  // Gọi service để lấy danh sách chuyến đi ứng với nơi đi, nơi đến, ngày đi và loại xe của lượt về
  getAvailableLinesBackByDate() {
    if (
      this.selectedDepartureBack &&
      this.selectedDestinationBack &&
      this.selectedDateBack &&
      this.selectedCoachTypeBack
    ) {
      this.lineService
        .getAvailableLinesByDate(
          this.selectedDepartureBack.id,
          this.selectedDestinationBack.id,
          this.selectedDateBack,
          this.selectedCoachTypeBack.id
        )
        .subscribe((data) => (this.lineListBack = data['data']));
    }
  }

  // Gọi service để lấy danh sách nơi đón ứng với nơi đi và phương thức đón của lượt về
  getPickUpListBack() {
    if (this.selectedDepartureBack && this.selectedPickUpTypeBack) {
      this.pickUpService
        .getPickUpByDepartureAndPickUpType(
          this.selectedDepartureBack?.id,
          this.selectedPickUpTypeBack?.id
        )
        .subscribe((data) => {
          this.pickUpListBack = data['data'];
        });
    }
  }

  // Gọi service để lấy danh sách nơi trả ứng với nơi đến và phương thức trả của lượt về
  getDropOffListBack() {
    if (this.selectedDestinationBack && this.selectedDropOffTypeBack) {
      this.dropOffService
        .getDropOffByDestinationAndDropOffType(
          this.selectedDestinationBack.id,
          this.selectedDropOffTypeBack.id
        )
        .subscribe((data) => (this.dropOffListBack = data['data']));
    }
  }
}

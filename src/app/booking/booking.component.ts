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
  ReactiveFormsModule,
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
  // Reactive form
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
    selectedLine: [null, Validators.required],
    selectedPickUpType: [null, Validators.required],
    selectedPickUp: [null, Validators.required],
    selectedDropOffType: [null, Validators.required],
    selectedDropOff: [null, Validators.required],
    houseNumber: ['', Validators.nullValidator],
    note: ['', Validators.nullValidator],
  });

  stepperOrientation: Observable<StepperOrientation>;
  ////////////////////////
  selectedQuantity: number = 1;
  seatColumnLayout: number = 4;
  departureList?: Departure[];
  destinationList?: Destination[];
  dateList?: Date[];
  lineList?: Line[];
  pickUpTypeList?: PickUpType[];
  dropOffTypeList?: DropOffType[];
  pickUpList?: PickUp[];
  dropOffList?: DropOff[];
  coachTypeList?: CoachType[];
  selectedDeparture: Departure | null | undefined;
  selectedDestination: Destination | null | undefined;
  selectedDate: Date | null | undefined;
  selectedCoachType: CoachType | null | undefined;
  selectedLine: Line | null | undefined;
  selectedSeats: Seat[] = [];
  selectedLineSeats: LineSeat[] = [];
  selectedPickUpType: PickUpType | null | undefined;
  selectedPickUp: PickUp | null | undefined;
  selectedDropOffType: DropOffType | null | undefined;
  selectedDropOff: DropOff | null | undefined;
  bookingPassengers: Passenger[] = [];
  houseNumber: string = '';
  note: string = '';
  totalCost: number = 0;
  isOneWay: boolean = true;
  lineInfo: string = 'Vui lòng chọn ngày khởi hành từ A đến B:';
  noti: string = '';
  Array: any;
  ticket = new Ticket();
  isDoubleDecker: boolean = false;
  isStepThreeCompleted: boolean = false;
  response = new ResponseModel();

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

  ngOnInit(): void {
    this.getDepartureList();
    this.getCouchTypeList();
    this.getPickUpTypeList();
    this.getDropOffTypeList();
    this.addPassenger();
  }

  // Chọn nơi đi
  onSelectDeparture() {
    this.selectedDeparture = this.firstFormGroup.get('selectedDeparture')
      ?.value as Departure | null | undefined;
    this.destinationList = [];
    if (this.selectedDeparture) {
      this.destinationList = this.selectedDeparture.destinations;
      if (this.selectedDestination) {
        this.getAvailableLinesByDesAndDep();
        this.lineInfo = `Vui lòng chọn ngày khởi hành từ ${this.selectedDeparture.name} đến ${this.selectedDestination.name}:`;
        this.cdr.detectChanges();
      }
    }
  }

  // Chọn nơi đến
  onSelectDestination() {
    this.selectedDestination = this.firstFormGroup.get('selectedDestination')
      ?.value as Destination | null | undefined;
    if (this.selectedDeparture) {
      if (this.selectedDestination) {
        this.getAvailableLinesByDesAndDep();
        this.lineInfo = `Vui lòng chọn ngày khởi hành từ ${this.selectedDeparture.name} đến ${this.selectedDestination.name}:`;
        this.cdr.detectChanges();
      }
    }
  }

  // Chọn ngày đi
  onClickDate(date: Date) {
    this.selectedDate = date;
  }

  // Chọn số lượng người đi
  onSelectQuantity() {
    this.selectedQuantity = this.firstFormGroup.get('selectedQuantity')
      ?.value as number;
  }

  // Chọn loại giường/ghế
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

  // Chọn chuyến
  onSelectLine() {
    this.selectedLine = this.thirdFormGroup.get('selectedLine')?.value as
      | Line
      | null
      | undefined;
    this.selectedSeats = [];
    this.selectedLineSeats = [];
    // Tính tổng tiền
    if (this.selectedLine && this.selectedQuantity) {
      this.totalCost = (this.selectedLine.price || 0) * this.selectedQuantity;
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

  // Chọn ghế
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

  // Chọn phương thức đón
  onSelectPickUpType() {
    this.selectedPickUpType = this.thirdFormGroup.get('selectedPickUpType')
      ?.value as PickUpType | null | undefined;
    this.pickUpList = [];
    this.getPickUpList();
  }

  // Chọn nơi đón
  onSelectPickUp() {
    this.selectedPickUp = this.thirdFormGroup.get('selectedPickUp')?.value as
      | PickUp
      | null
      | undefined;
  }

  // Chọn phương thức trả
  onSelectDropOffType() {
    this.selectedDropOffType = this.thirdFormGroup.get('selectedDropOffType')
      ?.value as DropOffType | null | undefined;
    this.dropOffList = [];
    this.getDropOffList();
  }

  // Chọn nơi trả
  onSelectDropOff() {
    this.selectedDropOff = this.thirdFormGroup.get('selectedDropOff')?.value as
      | DropOff
      | null
      | undefined;
  }

  // Tiến hành đặt vé
  onClickBooking() {
    if (this.selectedSeats.length < this.selectedQuantity) {
      alert('Vui lòng chọn đủ ghế');
    } else {
      this.isStepThreeCompleted = true;
      this.stepper.next();
      // Tạo model để gửi đi
      this.ticket._oneway = this.isOneWay;
      this.ticket.number = this.selectedQuantity;
      this.ticket.note = this.thirdFormGroup.controls['note'].value!;
      this.ticket.street_number =
        this.thirdFormGroup.controls['houseNumber'].value!;
      this.ticket.cost = this.totalCost;
      this.ticket._paid = false;
      this.ticket.pickUp = this.selectedPickUp!;
      this.ticket.dropOff = this.selectedDropOff!;
      this.ticket.line = this.selectedLine!;
      this.ticket.lineSeats = this.selectedLineSeats!;
      this.ticket.passengers = this.bookingPassengers!;
      this.bookingTicket();
    }
  }

  // Định dạng để hiển thị giờ:phút thay cho chuyến
  formatTime(time?: string): string {
    // Convert time to a Date object (assuming today's date)
    const timeDate = new Date(`2000-01-01T${time}`);
    // Format the Date object as "HH:mm"
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
  // Tuỳ theo số lượng người sẽ hiển thị form theo kiểu khác nhau
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

  // Gọi service để lấy danh sách ngày có chuyến xe ứng với nơi đi và nơi đến
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

  // Gọi service để lấy danh sách loại xe
  getCouchTypeList() {
    this.coachTypeService
      .getCoachTypeList()
      .subscribe((data) => (this.coachTypeList = data['data']));
  }

  // Gọi service để lấy danh sách chuyến đi ứng với nơi đi, nơi đến, ngày đi và loại xe
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

  // Gọi service để lấy danh sách nơi đón ứng với nơi đi và phương thức đón
  getPickUpList() {
    const departureId = this.selectedDeparture?.id ?? '';
    const pickUpTypeId = this.selectedPickUpType?.id ?? '';
    this.pickUpService
      .getPickUpByDepartureAndPickUpType(departureId, pickUpTypeId)
      .subscribe((data) => (this.pickUpList = data['data']));
  }

  // Gọi service để lấy danh sách nơi trả ứng với nơi đến và phương thức trả
  getDropOffList() {
    const destinationId = this.selectedDestination?.id ?? '';
    const dropOffTypeId = this.selectedDropOffType?.id ?? '';
    this.dropOffService
      .getDropOffByDestinationAndDropOffType(destinationId, dropOffTypeId)
      .subscribe((data) => (this.dropOffList = data['data']));
  }

  // Gọi service để đặt vé
  bookingTicket() {
    this.ticketService.createTicket(this.ticket).subscribe((data) => {
      this.response = data;
      if (!this.response.error) {
        this.noti = 'Đặt vé thành công';
      } else {
        this.noti = 'Úi, lỗi rồi! Vui lòng đặt lại!';
      }
    });
  }
}

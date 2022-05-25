import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import 'devextreme/data/odata/store';
import notify from "devextreme/ui/notify";
import {DxFormComponent, DxValidationGroupComponent} from "devextreme-angular";
import {Employee, EmployeeService} from "../services/employee.service";

@Component({
  selector: 'sample-employee-edit-popup',
  providers: [EmployeeService],
  templateUrl: 'employee-edit.component.html'
})

export class EmployeeEditComponent {
  employee: Employee;
  editMode: 'create' | 'update';
  popupVisible = false;
  genders = [{code: 'Male', text: '남자'}, {code: 'Female', text: '여자'}];

  @Output() onSaved = new EventEmitter<Employee>();

  @ViewChild(DxFormComponent, {static: false}) form: DxFormComponent;

  @ViewChild(DxValidationGroupComponent, {static: false}) validationGroup: DxValidationGroupComponent;

  constructor(private employeeService: EmployeeService) {
  }

  open(editMode: 'create' | 'update', employeeId?: number) {
    this.editMode = editMode;

    if (this.isUpdateMode()) {
      this.employeeService.find(employeeId).subscribe({
        next: (v) => {
          this.employee = v;
          this.popupVisible = true;
        },
        error: (e) => {
          console.log(e);
          notify('직원 정보를 불러오는데 오류가 발생하였습니다.', 'error', 3000);
        }
      });
    } else {
      this.employee = {} as Employee;
      this.popupVisible = true;
    }

  }

  close() {
    this.popupVisible = false;
  }

  isCreateMode() {
    return this.editMode === 'create';
  }

  isUpdateMode() {
    return this.editMode === 'update';
  }

  /** Popup Button Events */
  save = (e) => {
    const result = this.validationGroup.instance.validate();
    if (!result.isValid) {
      return;
    }

    this.popupVisible = false;
    if (this.isCreateMode()) {
      this.employeeService.create(this.employee).subscribe({
        next: (v) => {
          notify('직원 생성이 성공적으로 완료되었습니다.', 'success', 3000);
          this.onSaved.emit(v);
        },
        error: (e) => {
          console.log(e);
          notify('직원 생성에 실패하였습니다.', 'error', 3000);
        }
      });
    } else {
      this.employeeService.update(this.employee.id, this.employee).subscribe({
        next: (v) => {
          notify('직원 변경이 성공적으로 완료되었습니다.', 'success', 3000);
          this.onSaved.emit(v);
        },
        error: (e) => {
          console.log(e);
          notify('직원 변경에 실패하였습니다.', 'error', 3000);
        }
      });
    }
  }

  cancel = () => {
    this.popupVisible = false;
  }

}

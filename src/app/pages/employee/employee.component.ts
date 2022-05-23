import {Component, ViewChild} from '@angular/core';
import 'devextreme/data/odata/store';
import DataSource from "devextreme/data/data_source";
import CustomStore from "devextreme/data/custom_store";
import {Employee, EmployeeService} from "./services/employee.service";
import notify from "devextreme/ui/notify";
import {confirm} from "devextreme/ui/dialog";
import {firstValueFrom} from "rxjs";
import {DxFormComponent} from "devextreme-angular";
import {PageableService} from "../../shared/services/pageable.service";

@Component({
  selector: 'sample-employee',
  providers: [EmployeeService, PageableService],
  templateUrl: 'employee.component.html'
})

export class EmployeeComponent {

  employees: DataSource;
  selectedEmployeeId!: number;
  employee!: Employee;
  editMode!: 'create' | 'update';
  popupVisible = false;
  genders = [{code: 'Male', text: '남자'}, {code: 'Female', text: '여자'}];
  filter = '';

  @ViewChild(DxFormComponent, { static: false }) form!: DxFormComponent;

  constructor(private employeeService: EmployeeService,
              private pageableService: PageableService) {
    this.employees = new DataSource({
      store: new CustomStore({
        key: 'id',
        load: (loadOptions) => {
          const pageable = this.pageableService.getPageable(loadOptions);
          pageable.filter = this.filter;

          return firstValueFrom(this.employeeService.list(pageable)).then(page => {
            return this.pageableService.transformPage(page);
          });
        },
      })
    });
  }

  isCreateMode() {
    return this.editMode === 'create';
  }

  isUpdateMode() {
    return this.editMode === 'update';
  }

  updateSelection(e: any) {
    this.selectedEmployeeId = e.selectedRowKeys[0];
  }

  displayGender(e: any) {
    if (e.value === 'Male') {
      return '남';
    } else {
      return '여';
    }
  }

  /** Grid Toolbar Button Events */
  search() {
    this.employees.reload();
  }

  create() {
    this.editMode = 'create';
    this.employee = {} as Employee;
    this.popupVisible = true;
  }

  update() {
    this.editMode = 'update';
    this.employeeService.find(this.selectedEmployeeId).subscribe({
      next: (v) => {
        this.employee = v;
      },
      error: (e) => {
        console.log(e);
        notify('직원 정보를 불러오는데 오류가 발생하였습니다.', 'error', 3000);
      }
    });
    this.popupVisible = true;
  }

  delete() {
    const result = confirm('<i>정말로 해당 직원를 삭제하시겠습니까?</i>', '직원 삭제');
    result.then(dialogResult => {
      if (dialogResult) {
        this.employeeService.delete(this.selectedEmployeeId).subscribe({
          next: (v) => {
            notify('직원 삭제가 성공적으로 완료되었습니다.', 'success', 3000);
            this.search();
          },
          error: (e) => {
            console.log(e);
            notify('직원 삭제에 실패하였습니다.', 'error', 3000);
          }
        });
      }
    });
  }

  /** Popup Button Events */
  save = () => {
    const validationResult = this.form.instance.validate();
    if (!validationResult.isValid) {
      return;
    }
    this.popupVisible = false;
    if (this.isCreateMode()) {
      this.employeeService.create(this.employee).subscribe({
        next: (v) => {
          notify('직원 생성이 성공적으로 완료되었습니다.', 'success', 3000);
          this.search();
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
          this.search();
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

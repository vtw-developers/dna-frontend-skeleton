import {Component, ViewChild} from '@angular/core';
import 'devextreme/data/odata/store';
import DataSource from "devextreme/data/data_source";
import CustomStore from "devextreme/data/custom_store";
import {EmployeeService} from "./services/employee.service";
import {Employee} from "./services/employee.interface";
import notify from "devextreme/ui/notify";

@Component({
  templateUrl: 'employee.component.html'
})

export class EmployeeComponent {

  employees;
  employee: any;
  editMode: 'create' | 'update' = 'create';
  popupVisible = false;
  genders = [{code: 'Male', text: '남자'}, {code: 'Female', text: '여자'}];
  searchName = '';

  @ViewChild('grid') grid: any;

  constructor(private employeeService: EmployeeService) {
    this.employees = new DataSource({
      store: new CustomStore({
        key: 'id',
        load: (loadOptions) => {
          const page = loadOptions.skip;
          const size = loadOptions.take;
          const sorts = loadOptions.sort as Array<any>;

          const params = {page, size} as any;

          if (sorts) {
            const sort = sorts.pop();
            const sortColumn = sort.selector;
            const sortOrder = sort.desc ? 'desc' : 'asc';

            params.sortColumn = sortColumn;
            params.sortOrder = sortOrder;
          }

          params.searchName = this.searchName;

          return this.employeeService.list(params).toPromise().then(data => {
            let employees = {} as any;
            employees.totalCount = data.totalElements;
            employees.data = data.content;
            return employees;
          });
        },
      })
    });
  }

  getSelectedEmployeeId() {
    return this.grid.instance.getSelectedRowKeys()[0];
  }

  isCreateMode() {
    return this.editMode === 'create';
  }

  isUpdateMode() {
    return this.editMode === 'update';
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
    this.employeeService.find(this.getSelectedEmployeeId()).subscribe(
      (result) => {
        this.employee = result;
      },
      (error) => {
        console.log(error);
        notify('근무자 정보를 불러오는데 오류가 발생하였습니다.', 'error', 3000);
      }
    )
    this.popupVisible = true;
  }

  delete() {
    this.employeeService.delete(this.getSelectedEmployeeId()).subscribe(
      (result) => {
        notify('근무자 삭제가 성공적으로 완료되었습니다.', 'success', 3000);
        this.search();
      },
      (error) => {
        console.log(error);
        notify('근무자 삭제에 실패하였습니다.', 'error', 3000);
      }
    )
  }

  /** Popup Button Events */
  save = () => {
    this.popupVisible = false;
    if (this.isCreateMode()) {
      this.employee.gender = 'Male';
      this.employeeService.create(this.employee).subscribe(
        (result) => {
          notify('근무자 생성이 성공적으로 완료되었습니다.', 'success', 3000);
          this.search();
        },
        (error) => {
          console.log(error);
          notify('근무자 생성에 실패하였습니다.', 'error', 3000);
        });
    } else {
      this.employeeService.update(this.employee.id, this.employee).subscribe(
        (result) => {
          notify('근무자 변경이 성공적으로 완료되었습니다.', 'success', 3000);
          this.search();
        },
        (error) => {
          console.log(error);
          notify('근무자 변경에 실패하였습니다.', 'error', 3000);
        });
    }
  }

  cancel = () => {
    this.popupVisible = false;
  }

}

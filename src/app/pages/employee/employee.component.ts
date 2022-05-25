import {Component, ViewChild} from '@angular/core';
import 'devextreme/data/odata/store';
import DataSource from "devextreme/data/data_source";
import CustomStore from "devextreme/data/custom_store";
import {Employee, EmployeeService} from "./services/employee.service";
import notify from "devextreme/ui/notify";
import {confirm} from "devextreme/ui/dialog";
import {firstValueFrom} from "rxjs";
import {PageableService} from "../../shared/services/pageable.service";
import {EmployeeEditComponent} from "./edit/employee-edit.component";
import {DxDataGridComponent} from "devextreme-angular";

@Component({
  selector: 'sample-employee',
  providers: [EmployeeService, PageableService],
  templateUrl: 'employee.component.html'
})

export class EmployeeComponent {

  employees: DataSource;
  filter = '';

  @ViewChild(DxDataGridComponent, {static: false}) grid: DxDataGridComponent;
  @ViewChild(EmployeeEditComponent, {static: false}) editPopup: EmployeeEditComponent;

  constructor(private employeeService: EmployeeService,
              private pageableService: PageableService) {
    this.employees = new DataSource({
      store: new CustomStore({
        key: 'id',
        load: (loadOptions) => {
          this.grid.instance.clearSelection();

          const pageable = this.pageableService.getPageable(loadOptions);
          pageable.filter = this.filter;

          return firstValueFrom(this.employeeService.list(pageable)).then(page => {
            return this.pageableService.transformPage(page);
          });
        },
      })
    });
  }

  getSelectedEmployeeId(): number {
    return this.grid?.instance.getSelectedRowKeys()[0];
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
    this.editPopup.open('create');
  }

  update() {
    this.editPopup.open('update', this.getSelectedEmployeeId());
  }

  delete() {
    const result = confirm('<i>정말로 해당 직원를 삭제하시겠습니까?</i>', '직원 삭제');
    result.then(dialogResult => {
      if (dialogResult) {
        this.employeeService.delete(this.getSelectedEmployeeId()).subscribe({
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

  /** Edit Popup Events */
  onSaved(employee: Employee) {
    this.search();
  }

}

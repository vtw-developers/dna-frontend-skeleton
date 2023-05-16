import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import notify from 'devextreme/ui/notify';
import {DxFormComponent, DxPopupComponent, DxValidationGroupComponent} from 'devextreme-angular';
import {Employee} from '../services/employee.service';
import {Apollo, gql} from 'apollo-angular';

@Component({
    selector: 'sample-employee-edit-popup',
    providers: [],
    templateUrl: 'employee-edit.component.html'
})

export class EmployeeEditComponent {
    employee: Employee = {} as any;
    editMode: 'create' | 'update';
    popupVisible = false;
    genders = [{code: 'Male', text: '남자'}, {code: 'Female', text: '여자'}];

    @Output() onSaved = new EventEmitter<Employee>();

    @ViewChild(DxFormComponent, {static: false}) form: DxFormComponent;

    @ViewChild(DxValidationGroupComponent, {static: false}) validationGroup: DxValidationGroupComponent;
    @ViewChild(DxPopupComponent, {static: false}) popup: DxPopupComponent;

    constructor(private apollo: Apollo) {
    }

    open(editMode: 'create' | 'update', employeeId?: number) {
        this.validationGroup?.instance.reset();
        this.editMode = editMode;
        if (this.isUpdateMode()) {
            this.apollo.query({
                query: gql`
                    query employee($id: ID) {
                        employee(id: $id) {
                            id
                            name
                            gender
                            birthDate
                        }
                    }
                `,
                variables: {
                    id: employeeId
                }
            }).subscribe({
                next: (result: any) => {
                    this.employee = result.data.employee;
                    this.popupVisible = true;
                },
                error: (e) => {
                    console.error(e);
                    notify('직원 정보를 불러오는데 오류가 발생하였습니다.', 'error', 3000);
                }
            });
        } else {
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
        e.preventDefault();
        this.close();
        if (this.isCreateMode()) {
            this.apollo.mutate({
                mutation: gql`
                    mutation createEmployee($employee: EmployeeInput) {
                        createEmployee(employee: $employee) {
                            id
                        }
                    }
                `,
                variables: {
                    employee: this.employee
                }
            }).subscribe({
                next: (result: any) => {
                    notify('직원 생성이 성공적으로 완료되었습니다.', 'success', 3000);
                    this.onSaved.emit(result.data.createEmployee);
                },
                error: (e) => {
                    console.error(e);
                    notify('직원 생성에 실패하였습니다.', 'error', 3000);
                }
            });
        } else {
            this.apollo.mutate({
                mutation: gql`
                    mutation updateEmployee($employee: EmployeeInput) {
                        updateEmployee(employee: $employee) {
                            id
                        }
                    }
                `,
                variables: {
                    employee: this.employee
                }
            }).subscribe({
                next: (result: any) => {
                    notify('직원 변경이 성공적으로 완료되었습니다.', 'success', 3000);
                    this.onSaved.emit(result.data.updateEmployee);
                },
                error: (e) => {
                    console.error(e);
                    notify('직원 변경에 실패하였습니다.', 'error', 3000);
                }
            });
        }
    }

}

import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpParamsOptions} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Pageable} from "../../../shared/services/pageable.service";

export interface Employee {
  id: number;
  name: string;
  gender: string;
  birthDate: string | number | Date;
}

const URL = '/dna/practice/employees';

@Injectable()
export class EmployeeService {

  constructor(private http: HttpClient) {
  }

  list(params: Pageable): Observable<any> {
    return this.http.get<any>(`${URL}`, {params: params as any});
  }

  find(id: number): Observable<Employee> {
    return this.http.get<any>(`${URL}/${id}`);
  }

  create(employee: Employee): Observable<Employee> {
    return this.http.post<any>(`${URL}`, employee);
  }

  update(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<any>(`${URL}/${id}`, employee);
  }

  delete(id: number): Observable<Employee> {
    return this.http.delete<any>(`${URL}/${id}`);
  }

}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import DevExpress from "devextreme";
import {Employee} from "./employee.interface";

const URL = '/dna/practice/employees';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) {
  }

  public list(params: any): Observable<any> {
    return this.http.get<any>(`${URL}`, {params});
  }

  public find(id: number): Observable<Employee> {
    return this.http.get<any>(`${URL}/${id}`);
  }

  public create(employee: Employee) {
    console.log(employee);
    return this.http.post<any>(`${URL}`, employee);
  }

  public update(id: number, employee: Employee) {
    return this.http.put<any>(`${URL}/${id}`, employee);
  }

  public delete(id: number) {
    return this.http.delete<any>(`${URL}/${id}`);
  }

}

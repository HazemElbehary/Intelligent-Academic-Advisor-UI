import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterStudent } from '../interfaces/student/registerStudent';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { ReturnedStudent } from '../interfaces/student/returnedStudent';
import { LoginStudent } from '../interfaces/student/loginStudent';
import { ReturnedUniversity } from '../interfaces/university/ReturnedUniversity';
import { ReturnedDepartment } from '../interfaces/department/ReturnedDepartment';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://intelligentacademicadvisor.somee.com/api';


  constructor(private http: HttpClient, private router: Router, private messageService: MessageService) { }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  
  registerUser(userDetails: RegisterStudent): Observable<ReturnedStudent> {
    return this.http.post<any>(`${this.baseUrl}/register`, userDetails);
  }

  getUniversityOptions(): Observable<HttpResponse<ReturnedUniversity[]>> {
    return this.http.get<ReturnedUniversity[]>(`${this.baseUrl}/universities`, { observe: 'response' });
  }

  getDepartmentOptions(): Observable<HttpResponse<ReturnedDepartment[]>> {
    return this.http.get<ReturnedDepartment[]>(`${this.baseUrl}/departments`, { observe: 'response' });
  }
  
  loginUser(loginUser: LoginStudent): Observable<HttpResponse<ReturnedStudent>>{
    return this.http.post<any>(`${this.baseUrl}/login`, loginUser, { observe: 'response' });
  }

  isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  }

  isAuthenticated(): boolean {
    const token = this.token;
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }
}

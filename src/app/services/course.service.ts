import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReturnedCourse } from '../interfaces/course/ReturnedCourse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private baseUrl = 'http://intelligentacademicadvisor.somee.com/api';


  constructor(private http: HttpClient) { }

    getByUniversity(universityId: number): Observable<HttpResponse<ReturnedCourse[]>> {
      const token = sessionStorage.getItem('token')!;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      console.log('Fetching courses for university ID:', universityId);
      return this.http.get<ReturnedCourse[]>(`${this.baseUrl}/AUniversityCourses`, {
      params: { universityId: universityId.toString() },
      headers,
      observe: 'response'
      });
    }

    submitCompletedCourses(codes: string[]): Observable<string> {
      const token = sessionStorage.getItem('token')!;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post(`${this.baseUrl}/AddCoursesToStudent`, codes, {
        headers,
        responseType: 'text'
      });
    }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router }    from '@angular/router';
import { CourseService }     from '../../services/course.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ReturnedCourse }    from 'src/app/interfaces/course/ReturnedCourse';
import { MessageService }     from 'primeng/api';

@Component({
  selector: 'app-register-page2',
  templateUrl: './register-page2.component.html',
  styleUrls: ['./register-page2.component.css']
})
export class RegisterPage2Component implements OnInit {
  courses: ReturnedCourse[] = [];
  selectedCodes: string[] = [];       // <-- holds all checked course codes
  universityId!: number;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const uId = params['universityId'];
      if (uId != null) {
        this.universityId = +uId;
        this.loadCourses();
      }
    });
  }

  private loadCourses() {
    this.courseService.getByUniversity(this.universityId)
      .subscribe({
        next: (response: HttpResponse<ReturnedCourse[]>) => {
          this.courses = response.body || [];
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed loading courses', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load courses.' });
        }
      });
  }

  onSubmit() {
    if (this.selectedCodes.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'No Selection', detail: 'Please select at least one course.' });
      return;
    }

    this.courseService
      .submitCompletedCourses(this.selectedCodes)
      .subscribe({
        next: () => {
          this.router.navigate(['home']);
          this.messageService.add({ severity: 'success', summary: 'Submitted', detail: 'Your courses have been recorded.' });
        },
        error: (err: HttpErrorResponse) => {
          console.error('Submission failed', err);
          this.messageService.add({ severity: 'error', summary: 'Submit Error', detail: 'Failed to submit courses.' });
        }
      });
  }
}

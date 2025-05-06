import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RegisterStudent } from 'src/app/interfaces/student/registerStudent';
import { AuthService } from 'src/app/services/auth.service';
import { passwordMatchValidator } from 'src/app/shared/password-match.directive';
import { ReturnedUniversity } from 'src/app/interfaces/university/ReturnedUniversity';
import { ReturnedDepartment } from 'src/app/interfaces/department/ReturnedDepartment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  // Reactive form for user registration
  registerForm = this.fb.group({
    userName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
    fcaiid: ['', [Validators.required, Validators.pattern(/^202\d{5}$/)]],
    gpa: ['', [Validators.required, Validators.pattern(/^(?:[0-3](?:\.\d{1,2})?|4(?:\.0{1,2})?)$/)]],
    password: ['', [Validators.required, Validators.minLength(8), this.passwordComplexityValidator]],
    confirmPassword: ['', Validators.required],
    UniversityId: [null, Validators.required],
    DepartmentId: [null]
  }, {
    validators: passwordMatchValidator
  });

  // Dropdown options for universities
  UniversityOptions: { label: string; value: any }[] = [];
  DepartmentOptions: { label: string; value: any }[] = [];

  universityOptions: any[] = []; // Initialize as an empty array
  departmentOptions: any[] = []; // Initialize as an empty array

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUniversityOptions();
    this.loadDepartmentOptions();
  }

  private loadUniversityOptions() {
    this.authService.getUniversityOptions().subscribe(
      (response: HttpResponse<ReturnedUniversity[]>) => {
        if (response.body) {
          console.log('University options loaded:', response.body);
          this.UniversityOptions = response.body!.map((u: ReturnedUniversity) => ({
            label: (u as any).name,
            value: (u as any).id
          }));
        } else {
          console.warn('Response body is null.');
        }
      },
      error => {
        console.error('Failed to load university options:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load university options.' });
      }
    );
  }

  private loadDepartmentOptions() {
    this.authService.getDepartmentOptions().subscribe(
      (response: HttpResponse<ReturnedDepartment[]>) => {
        console.log('Department options response:', response);
        if (response.body) {
          console.log('Department options loaded:', response.body);
          this.DepartmentOptions = response.body!.map((u: ReturnedDepartment) => ({
            label: (u as any).name,
            value: (u as any).id
          }));
        } else {
          console.warn('Response body is null.');
        }
      },
      error => {
        console.error('Failed to load department options:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load department options.' });
      }
    );
  }

  private passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null; // Let the required validator handle empty values
    }
    const errors: ValidationErrors = {};

    if (!/[A-Z]/.test(value)) {
      errors['uppercase'] = true;
    }
    if (!/[a-z]/.test(value)) {
      errors['lowercase'] = true;
    }
    if (!/[0-9]/.test(value)) {
      errors['digit'] = true;
    }
    if (!/[@$!%*?&]/.test(value)) {
      errors['special'] = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }


  // Getters for form controls
  get userName() {
    return this.registerForm.controls['userName'];
  }

  get fcaiid() {
    return this.registerForm.controls['fcaiid'];
  }

  get gpa() {
    return this.registerForm.controls['gpa'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }

  get UniversityId() {
    return this.registerForm.controls['UniversityId'];
  }

  get DepartmentId() {
    return this.registerForm.controls['DepartmentId'];
  }

  // Method to validate password against a regex pattern
  isPasswordValid(pattern: RegExp, value: string | null): boolean {
    return pattern.test(value || '');
  }

  submitDetails() {
    if (this.registerForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary:  'Validation Error',
        detail:   'Please fill out the form correctly.'
      });
      return;
    }
  
    const postData: RegisterStudent = {
      UserName: this.registerForm.value.userName!,
      FCAIID: this.registerForm.value.fcaiid!,
      GPA: parseFloat(this.registerForm.value.gpa!),
      Password: this.registerForm.value.password!,
      UniversityId: this.registerForm.value.UniversityId!,
      DepartmentId: this.registerForm.value.DepartmentId!
    };
  
    this.authService.registerUser(postData)
      .subscribe({
        next: (response) => {
          console.log('Token:', response.token);
          sessionStorage.setItem('token', response?.token as string);
          console.log(response);
          this.messageService.add({
            severity: 'success',
            summary:  'Success',
            detail:   'Registered successfully!'
          });
          this.router.navigate(['register-page2'], { queryParams: { universityId: postData.UniversityId } });
        },
        error: (err: HttpErrorResponse) => {
          const payload = err.error as { StatusCode: number; Message: string; Details: any };

          // show the server’s Message
          const userMsg = payload?.Message ?? 'Unexpected error';
      
          this.messageService.add({
            severity: 'error',
            summary: `Error ${err.status}`,
            detail: userMsg
          });
        }
      });
  }
}

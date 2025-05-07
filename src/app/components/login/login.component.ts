import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginStudent } from 'src/app/interfaces/student/loginStudent';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = this.fb.group({
    fcaiid: ['', [Validators.required, Validators.pattern(/^202\d{5}$/)]],
    password: ['', Validators.required]
  })

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private msgService: MessageService
  ) { }

  get fcaiid() {
    return this.loginForm.controls['fcaiid'];
  }
  get password() { return this.loginForm.controls['password']; }

  loginUser() {
    const postData: LoginStudent = { 
      FCAIID: (this.fcaiid.value as unknown) as number, 
      Password: this.password.value as string 
    };
    
    this.authService.loginUser(postData).subscribe({
      next: response => {
        console.log(response);
        if (response.status === 200) {
          localStorage.setItem('token', response.body?.token as string);
          this.router.navigate(['home']);
        } else {
          this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
        }
      },
      error: err => {
        console.log(err);
        this.msgService.add({ severity: 'error', summary: 'Error', detail: 'FCAI ID or password is wrong' });
      }
    });
  }
  
}

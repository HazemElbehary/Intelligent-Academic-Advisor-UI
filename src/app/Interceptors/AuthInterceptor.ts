import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { catchError, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private messageService: MessageService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.auth.token;
    const cloned = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` }})
      : req;

    return next.handle(cloned).pipe(
      catchError((err: HttpErrorResponse) => {
        // extract your payload shape
        const payload = err.error as { StatusCode: number; Message: string; Details: any };
        const userMsg = payload?.Message ?? 'Unexpected error';

        // show the server’s Message
        this.messageService.add({
          severity: 'error',
          summary: `Error ${err.status}`,
          detail: userMsg
        });

        if (err.status === 401) {
          this.auth.logOut();
        }

        return throwError(() => err);
      })
    );
  }
}

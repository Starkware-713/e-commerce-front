import { HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next: HttpHandlerFn) => {
  const token = localStorage.getItem('token');
    
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};

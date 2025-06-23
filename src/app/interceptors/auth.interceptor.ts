import { HttpInterceptorFn, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next: HttpHandlerFn) => {
  const token = localStorage.getItem('token');
    
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = '';
      if (error.error instanceof ErrorEvent) {
        // Error del cliente
        errorMsg = `Error: ${error.error.message}`;
      } else {
        // Error del servidor
        switch (error.status) {
          case 400:
            errorMsg = 'Solicitud incorrecta';
            break;
          case 401:
            errorMsg = 'No autorizado - Por favor, inicie sesión nuevamente';
            localStorage.removeItem('token');
            break;
          case 403:
            errorMsg = 'Acceso denegado';
            break;
          case 404:
            errorMsg = 'Recurso no encontrado';
            break;
          case 422:
            errorMsg = error.error?.detail || 'Error de validación en los datos';
            break;
          case 500:
            errorMsg = 'Error interno del servidor';
            break;
          default:
            errorMsg = 'Ha ocurrido un error inesperado';
        }
      }
      return throwError(() => new Error(errorMsg));
    })
  );
};

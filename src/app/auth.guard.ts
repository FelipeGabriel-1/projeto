import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, user } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  // Observa o estado do usuário (se está logado ou não)
  return user(auth).pipe(
    map((firebaseUser) => {
      // Se há um usuário logado (firebaseUser não é null), permite o acesso
      if (firebaseUser) {
        return true;
      }

      // Se não há usuário logado, redireciona para a página de login
      return router.createUrlTree(['/home']);
    })
  );
};
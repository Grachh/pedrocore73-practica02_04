import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UsuariosService } from './usuarios.service';
import { SesionesService } from './sesiones.service';

@Injectable({
  providedIn: 'root'
})
export class RbacService {

  urlLogin = environment.urlLogin;
  urlAutorizaciones = environment.urlAutorizaciones;
  usuario: any;
  permisos: any;

  private permisosIn = new BehaviorSubject<any>({permisos: this.permisos});

  get isPermisosIn() {
    return this.permisosIn.asObservable();
  }

  constructor(private http: HttpClient,
              private router: Router,
              private usuariosService: UsuariosService,
              private sesionesService: SesionesService) {
    this.cargarEstado();
  }

  cargarEstado() {
    let id = localStorage.getItem('id');
    if(id){
      this.usuariosService.getUsuario(id)
                  .subscribe((res: any)=>{
                    this.usuario = res.usuario;
                    console.log(this.usuario);
                    this.asignaPermisos(this.usuario.rol);
                    this.crearSesion(this.usuario._id);
                  }, (error: any)=>{
                    console.log(error);
                  })
    }
  }

  login(credenciales) {
    return this.http.post(this.urlLogin, credenciales).pipe(
      map((res: any)=>{
        if(res.usuario) {
          this.usuario = res.usuario;
          localStorage.setItem('id', this.usuario._id);
          this.asignaPermisos(this.usuario.rol);
          this.crearSesion(this.usuario._id);
          // this.router.navigate(['/inicio']);
        }
        return res;
      })
    )
  }

  logout() {
    this.cerrarSesion();
    this.usuario = {};
    localStorage.removeItem('id');
    this.router.navigate(['/']);
  }

  asignaPermisos(rol) {
    return this.http.get(this.urlAutorizaciones).pipe(
      map((resp: any)=>{
        return resp;
      })
    ).subscribe((res: any)=>{
      let autorizaciones = res.autorizaciones;
      switch(rol) {
        case 'admin':
          this.permisos = autorizaciones.permisosAdmin;
          break;
        case 'empl':
          this.permisos = autorizaciones.permisosEmpl;
          break;
        case 'cfo':
          this.permisos = autorizaciones.permisosCfo;
          break;
        case 'ceo':
          this.permisos = autorizaciones.permisosCeo;
          break;
        default:
          break;  
      }
      this.permisosIn.next({permisos: this.permisos});
    }, (error: any)=>{
      console.log(error);
    })
  }

  crearSesion(id) {
    const sesion = {
      idUsuario: id,
      login: new Date()
    }
    this.sesionesService.enviarSesion(sesion)
                .subscribe((res: any)=>{
                  console.log(res);
                  
                }, (error: any)=>{
                  console.log(error);
                })
    this.router.navigate(['/inicio']);
  }

  cerrarSesion() {
    const sesion = {
      idUsuario: this.usuario._id,
      logout: new Date()
    }
    this.sesionesService.enviarSesion(sesion)
                .subscribe((res: any)=>{
                  console.log(res);
                }, (error: any)=>{
                  console.log(error);
                })

  }


}

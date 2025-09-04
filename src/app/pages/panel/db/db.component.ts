import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
// interface
import {
  DrawerFooter,
  drawerTemplate,
} from '../../../interface/global.interface';
import { DatatableServer } from '../../../interface/server.interface';
import { ColumnItemDB, DataDB, FormDB } from '../../../interface/db.interface';
import { DatatableEngine } from '../../../interface/engine.interface';
// component and-desing
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
// service
import { ServerService } from '../../../service/server/server.service';
import { EngineService } from '../../../service/engine/engine.service';
import { DbService } from '../../../service/db/db.service';
import { GlobalService } from '../../../service/global/global.service';
// Derictive
import { LimitCharsDirective } from '../../../directive/limit-chars/limit-chars.directive';

@Component({
  selector: 'app-db',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzDrawerModule,
    NzFormModule,
    NzInputModule,
    NzMessageModule,
    FormsModule,
    NzSelectModule,
    NzPopconfirmModule,
    NzToolTipModule,
    NzSwitchModule,
    NzDropDownModule,
    NzCheckboxModule,
    ReactiveFormsModule,
    LimitCharsDirective,
  ],
  templateUrl: './db.component.html',
  styleUrl: './db.component.css',
})
export class DbComponent {
  @ViewChild('drawerDb', { static: false })
  drawerTemplate?: TemplateRef<drawerTemplate>;
  @ViewChild('footerDb', { static: false })
  drawerFooter?: TemplateRef<DrawerFooter>;
  isLoading: boolean = true;
  isSaving: boolean = false;
  searchValue: string = '';
  showPassword: boolean = false;
  iconPassword: string = 'eye';

  // select engine
  isLoadingEngines: boolean = false;
  optionListEngines: Array<DatatableEngine> = [];
  optionListCopyEngines: Array<DatatableEngine> = [];

  // select serve
  isLoadingSever: boolean = false;
  optionListServe: Array<DatatableServer> = [];
  optionListCopyServe: Array<DatatableServer> = [];

  drawerRef: any;
  dataForm: DataDB = {
    activo: false,
    contrasena: '',
    creacion: '',
    descripcion_motor: '',
    esquema: '',
    id: '',
    id_motor: '',
    id_servidor: '',
    loading: false,
    modificacion: '',
    nombre_servidor: '',
    usuario: '',
  };
  edit: boolean = false; // variable usada para saber cuando se esta actualizando el registro

  validateForm: FormGroup<FormDB> = this.fb.group({
    contrasena: ['', [Validators.required]],
    esquema: ['', [Validators.required]],
    id_motor: ['', [Validators.required]],
    id_servidor: ['', [Validators.required]],
    usuario: ['', [Validators.required]],
  });

  listOfColumns: ColumnItemDB[] = [
    {
      name: 'id',
      sortOrder: null,
      sortFn: (a: DataDB, b: DataDB) =>
        JSON.stringify(a.id).localeCompare(JSON.stringify(b.id)),
      showSort: true,
    },
    {
      name: 'Motor',
      sortOrder: null,
      sortFn: (a: DataDB, b: DataDB) =>
        a.descripcion_motor.localeCompare(b.descripcion_motor),
      showSort: true,
    },
    {
      name: 'Servidor',
      sortOrder: null,
      sortFn: (a: DataDB, b: DataDB) =>
        a.nombre_servidor.localeCompare(b.nombre_servidor),
      showSort: true,
    },
    {
      name: 'Usuario',
      sortOrder: null,
      sortFn: (a: DataDB, b: DataDB) => a.usuario.localeCompare(b.usuario),
      showSort: true,
    },
    {
      name: 'Contraseña',
      sortOrder: null,
      sortFn: (a: DataDB, b: DataDB) =>
        a.contrasena.localeCompare(b.contrasena),
      showSort: false,
    },
    {
      name: 'Acciones',
      sortFn: null,
      sortOrder: null,
      showSort: false,
    },
  ];
  listOfData: DataDB[] = [];
  listOfDataCopy: DataDB[] = [];

  constructor(
    private drawerService: NzDrawerService,
    private fb: NonNullableFormBuilder,
    private serviceServer: ServerService,
    private serviceEngine: EngineService,
    private serviceDb: DbService,
    private message: NzMessageService,
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.isLoading = true;
    this.serviceDb.getAllDB().subscribe((data: any) => {
      this.isLoading = false;
      if (data.ok != undefined && data.ok == false) {
        this.message.error(
          '¡Ups! Hubo un error al obtener las bases de datos',
          { nzDuration: 2500 }
        );
        return;
      }
      this.listOfData = data.data.map(({ activo, ...rest }: any) => {
        return { ...rest, activo: activo ? true : false };
      });
      this.listOfDataCopy = this.listOfData;
    });
  }

  openTemplate(): void {
    this.drawerRef = this.drawerService.create({
      nzTitle: 'Crear Base de Datos',
      nzContent: this.drawerTemplate,
      nzFooter: this.drawerFooter,
      nzContentParams: { edit: false },
    });
  }

  openEditTemplate(data: DataDB): void {
    this.edit = true;
    this.dataForm = data;
    this.onSearchServer('');
    this.onSearchEngines('');
    this.drawerRef = this.drawerService.create({
      nzTitle: 'Editar la Base de Datos',
      nzContent: this.drawerTemplate,
      nzFooter: this.drawerFooter,
      nzContentParams: { edit: true },
    });
    this.drawerRef.nzOnClose.subscribe(() => {
      this.dataForm = this.globalService.createDefaultObject<DataDB>({
        activo: false,
        contrasena: '',
        creacion: '',
        descripcion_motor: '',
        esquema: '',
        id: '',
        id_motor: '',
        id_servidor: '',
        loading: false,
        modificacion: '',
        nombre_servidor: '',
        usuario: '',
      });
    });
  }

  changeState(dataChange: DataDB): void {
    dataChange.loading = true;
    this.serviceDb.changeState(dataChange.id).subscribe((data: any) => {
      dataChange.loading = false;
      if (data.ok != undefined && data.ok == false) {
        this.message.error(
          '<b>¡Ups!</b> Hubo un error al eliminar la base de datos',
          { nzDuration: 2500 }
        );
        dataChange.activo = !dataChange.activo;
        return;
      }
      if (data.resp != undefined && !data.resp) {
        this.message.error(`<b>¡Ups!</b> ${data.message}`, {
          nzDuration: 2500,
        });
        dataChange.activo = !dataChange.activo;
        return;
      }
      this.message.success(`<b>!Execelente!</b> ${data.message}`, {
        nzDuration: 2500,
      });
    });
  }

  submitForm(): void {
    if (!this.validateForm.valid) {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    if (this.edit) {
      this.isSaving = true;
      this.serviceDb
        .editDB(this.validateForm, this.dataForm.id)
        .subscribe((data: any) => {
          this.isSaving = false;
          if (data.ok != undefined && data.ok == false) {
            this.message.error(
              '<b>¡Ups!</b> Hubo un error al editar la base de datos',
              { nzDuration: 2500 }
            );
            return;
          }
          if (data.resp != undefined && !data.resp) {
            this.message.error(`<b>¡Ups!</b> ${data.message}`, {
              nzDuration: 2500,
            });
            return;
          }
          this.message.success(
            '<b>!Execelente!</b> Se actulizo la base de datos con exito',
            { nzDuration: 2500 }
          );
          this.drawerRef.close();
          this.edit = false;
          this.getData();
          this.dataForm = this.globalService.createDefaultObject<DataDB>({
            activo: false,
            contrasena: '',
            creacion: '',
            descripcion_motor: '',
            esquema: '',
            id: '',
            id_motor: '',
            id_servidor: '',
            loading: false,
            modificacion: '',
            nombre_servidor: '',
            usuario: '',
          });
        });
    } else {
      this.isSaving = true;
      this.serviceDb
        .saveDB(this.validateForm, this.dataForm.id)
        .subscribe((data: any) => {
          this.isSaving = false;
          if (data.ok != undefined && data.ok == false) {
            this.message.error(
              '<b>¡Ups!</b> Hubo un error al guardar la base de datos',
              { nzDuration: 2500 }
            );
            return;
          }
          if (data.resp != undefined && !data.resp) {
            this.message.error(`<b>¡Ups!</b> ${data.message}`, {
              nzDuration: 2500,
            });
            return;
          }
          this.message.success(
            '<b>¡Execelente!</b> Se guardo la base de datos con exito',
            { nzDuration: 2500 }
          );
          this.getData();
          this.drawerRef.close();
        });
    }
  }

  onSearchServer(value: string): void {
    if (!value) {
      this.isLoadingSever = true;
      this.serviceServer.getAllServersActivos().subscribe((data: any) => {
        this.isLoadingSever = false;
        if (data.ok != undefined && data.ok == false) {
          this.message.error(
            '<b>¡Ups!</b> Hubo un error al obtener los servidores',
            { nzDuration: 2500 }
          );
          return;
        }
        if (data.resp != undefined && !data.resp) {
          this.message.error(`<b>¡Ups!</b> ${data.message}`, {
            nzDuration: 2500,
          });
          return;
        }
        this.optionListCopyServe = data.data;
        this.optionListServe = data.data;
      });
    } else {
      this.optionListServe = this.optionListCopyServe.filter(
        ({ nombre_servidor }) =>
          nombre_servidor
            .toLocaleUpperCase()
            .includes(value.toLocaleUpperCase())
      );
    }
  }

  onSearchEngines(value: string): void {
    if (!value) {
      this.isLoadingEngines = true;
      this.serviceEngine.getAllEnginesActivos().subscribe((data: any) => {
        this.isLoadingEngines = false;
        if (data.ok != undefined && data.ok == false) {
          this.message.error(
            '<b>¡Ups!</b> Hubo un error al obtener los motores',
            { nzDuration: 2500 }
          );
          return;
        }
        if (data.resp != undefined && !data.resp) {
          this.message.error(`<b>¡Ups!</b> ${data.message}`, {
            nzDuration: 2500,
          });
          return;
        }
        this.optionListEngines = data.data;
      });
    } else {
      this.optionListEngines = this.optionListEngines.filter(
        ({ descripcion }) =>
          descripcion.toLocaleUpperCase().includes(value.toLocaleUpperCase())
      );
    }
  }

  changeStatePassword() {
    this.showPassword = !this.showPassword;
    this.iconPassword = this.showPassword ? 'eye-invisible' : 'eye';
  }

  close(): void {
    this.drawerRef.close();
    this.dataForm = this.globalService.createDefaultObject<DataDB>({
      activo: false,
      contrasena: '',
      creacion: '',
      descripcion_motor: '',
      esquema: '',
      id: '',
      id_motor: '',
      id_servidor: '',
      loading: false,
      modificacion: '',
      nombre_servidor: '',
      usuario: '',
    });
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.listOfData = this.listOfDataCopy.filter(
      ({ descripcion_motor, nombre_servidor, usuario }: DataDB) => {
        return (
          descripcion_motor
            .toLocaleUpperCase()
            .includes(this.searchValue.toLocaleUpperCase()) ||
          nombre_servidor
            .toLocaleUpperCase()
            .includes(this.searchValue.toLocaleUpperCase()) ||
          usuario
            .toLocaleUpperCase()
            .includes(this.searchValue.toLocaleUpperCase())
        );
      }
    );
  }
}

import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer';
import { Component, TemplateRef, ViewChild } from '@angular/core';
// interfaces
import { ColumnItemUser, DatatableUser, FormUser } from '../../../interface/user.interface';
import { DataTableUserType } from '../../../interface/user-type.interface';
import { DrawerFooter, drawerTemplate } from '../../../interface/global.interface';
// component and-desing
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
// services
import { UserService } from '../../../service/user/user.service';
import { UserTypeService } from '../../../service/user-type/user-type.service';
import { GlobalService } from '../../../service/global/global.service';
import { forbiddenNameValidator } from '../../../validators/forbidden-name.validator';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzDrawerModule,
    NzFormModule,
    NzInputModule,
    FormsModule,
    NzSelectModule,
    NzToolTipModule,
    NzSwitchModule,
    ReactiveFormsModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  @ViewChild('drawerUser', { static: false }) drawerTemplate?: TemplateRef<drawerTemplate>
  @ViewChild('footerUser', { static: false }) drawerFooter?: TemplateRef<DrawerFooter>
  isLoading: boolean = false
  isSaving: boolean = false
  stateDocker: boolean = false

  // select type user
  isLoadingTypeUser: boolean = false
  selectedTypeUser: number = 0
  optionListTypeUser: Array<DataTableUserType> = []

  drawerRef: any
  dataForm: DatatableUser = {
    id: '',
    nombre: '',
    correo: '',
    cargo: '',
    telefono: 0,
    descripcion_tipo_usuario: '',
    id_tipo_usuario: '',
    activo: false,
    loading: false
  }
  edit: boolean = false // variable usada para saber cuando se esta actualizando el registro
  searchValue: string = ''

  validateForm: FormGroup<FormUser> = this.fb.group({
    cargo: ['', [Validators.required]],
    correo: ['', [Validators.required, forbiddenNameValidator(/^[a-zA-Z0-9._%+-]+@uniminuto\.edu$/)]],
    id_tipo_usuario: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    telefono: [0, [Validators.required]]
  });

  listOfColumns: ColumnItemUser[] = [
    {
      name: 'id',
      sortOrder: null,
      sortFn: (a: DatatableUser, b: DatatableUser) => JSON.stringify(a.id).localeCompare(JSON.stringify(b.id)),
      showSort: true
    },
    {
      name: 'Nombre',
      sortOrder: null,
      sortFn: (a:DatatableUser, b:DatatableUser) => a.nombre.localeCompare(b.nombre),
      showSort: true
    },
    {
      name: 'Correo',
      sortOrder: null,
      sortFn: (a: DatatableUser, b: DatatableUser) => a.correo.localeCompare(b.correo),
      showSort: true
    },
    {
      name: 'Rol',
      sortOrder: null,
      sortFn: (a: DatatableUser, b: DatatableUser) => a.descripcion_tipo_usuario.localeCompare(b.descripcion_tipo_usuario),
      showSort: true
    },
    {
      name: 'Cargo',
      sortOrder: null,
      sortFn: (a: DatatableUser, b: DatatableUser) => a.cargo.localeCompare(b.cargo),
      showSort: true
    },
    {
      name: 'Telefono',
      sortOrder: null,
      sortFn: (a: DatatableUser, b: DatatableUser) => JSON.stringify(a.telefono).localeCompare(JSON.stringify(b.telefono)),
      showSort: true
    },
    {
      name: 'Acciones',
      sortFn: null,
      sortOrder: null,
      showSort: false
    }
  ];
  listOfData: DatatableUser[] = [];
  listOfDataCopy: DatatableUser[] = [];

  constructor(
    private drawerService: NzDrawerService,
    private fb: NonNullableFormBuilder,
    private message: NzMessageService,
    private userService: UserService,
    private userTypeService: UserTypeService,
    private globalService: GlobalService
  ) { }

  ngOnInit(): void {
    this.getData()
  }

  getData(): void {
    this.isLoading = true
    this.userService.getAllUser()
      .subscribe((data: any) => {
        this.isLoading = false
        if (data.ok != undefined && data.ok == false) {
          this.message.error('!Ups! Hubo un error al obtener los usuarios', { nzDuration: 2500 })
          return
        }
        this.listOfData = data.data
        this.listOfDataCopy = data.data
      })
  }

  openTemplate(): void {
    this.drawerRef = this.drawerService.create({
      nzTitle: 'Crear Usuario',
      nzContent: this.drawerTemplate,
      nzFooter: this.drawerFooter,
      nzContentParams: { edit: false }
    });
  }

  openEditTemplate(data: DatatableUser): void {
    this.edit = true
    this.dataForm = data
    this.selectedTypeUser = Number(data.id_tipo_usuario)
    this.onSearchTypeUser('')
    this.drawerRef = this.drawerService.create({
      nzTitle: 'Editar Usuario',
      nzContent: this.drawerTemplate,
      nzFooter: this.drawerFooter,
      nzContentParams: { edit: true }
    });
    this.drawerRef.nzOnClose.subscribe(() => {
      this.dataForm = {
        id: '',
        activo: false,
        cargo: '',
        correo: '',
        descripcion_tipo_usuario: '',
        id_tipo_usuario: '',
        nombre: '',
        telefono: 0,
        loading: false
      }
      this.selectedTypeUser = 0
    });
  }

  onSearchTypeUser(value: string): void {
    this.isLoadingTypeUser = true
    this.userTypeService.getAllUsertype().subscribe((data: any) => {
      this.isLoadingTypeUser = false
      if (data.ok != undefined && data.ok == false) {
        this.message.error('<b>!Ups!</b> Hubo un error al obtener los roles', { nzDuration: 2500 })
        return
      }
      if (data.resp != undefined && !data.resp) {
        this.message.error(`<b>¡Ups!</b> ${data.message}`, { nzDuration: 2500 })
        return
      }
      this.optionListTypeUser = data.data
    })
  }

  changeState(dataChange: DatatableUser): void {
    dataChange.loading = true
    this.userService.changeState(dataChange.id).subscribe((data: any) => {
      dataChange.loading = false
      if (data.ok != undefined && data.ok == false) {
        this.message.error('<b>!Ups!</b> Hubo un error al desactivar el usuario', { nzDuration: 2500 })
        return
      }
      if (data.resp != undefined && !data.resp) {
        this.message.error(`<b>!Ups!</b> ${data.message}`, { nzDuration: 2500 })
        return
      }
      dataChange.activo = !dataChange.activo
      this.message.success(`<b>!Excelente!</b> ${data.message}`, { nzDuration: 2500 })
    })
  }

  submitForm(): void {
    if (!this.validateForm.valid) {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty()
          control.updateValueAndValidity({ onlySelf: true })
        }
      });
      return
    }
    const { cargo, correo, id_tipo_usuario, nombre, telefono } = this.validateForm.value
    this.dataForm = {
      ...this.dataForm,
      cargo: cargo ? cargo : '',
      id_tipo_usuario: id_tipo_usuario ? id_tipo_usuario : '',
      correo: correo ? correo : '',
      nombre: nombre ? nombre : '',
      telefono: telefono ? telefono : 0
    }
    if (this.edit) {
      this.isSaving = true
      this.userService.editUser(this.dataForm)
        .subscribe((data: any) => {
          this.isSaving = false
          if (data.ok != undefined && data.ok == false) {
            this.message.error('<b>!Ups!</b> Hubo un error al editar el usuario', { nzDuration: 2500 })
            return
          }
          if (data.resp != undefined && !data.resp) {
            this.message.error(`<b>¡Ups!</b> ${data.message}`, { nzDuration: 2500 })
            return
          }
          this.message.success('<b>!Excelente!</b> Se actualizo el usuario con éxito', { nzDuration: 2500 })
          this.drawerRef.close()
          this.edit = false
          this.getData()
          this.dataForm = {
            id: '',
            activo: false,
            cargo: '',
            correo: '',
            descripcion_tipo_usuario: '',
            id_tipo_usuario: '',
            nombre: '',
            telefono: 0,
            loading: false
          }
        })
    } else {
      this.isSaving = true
      this.userService.saveUser(this.dataForm)
        .subscribe((data: any) => {
          this.isSaving = false
          if (data.ok != undefined && data.ok == false) {
            this.message.error('<b>!Ups!</b> Hubo un error al guardar el usuario', { nzDuration: 2500 })
            return
          }
          if (data.resp != undefined && !data.resp) {
            this.message.error(`<b>¡Ups!</b> ${data.message}`, { nzDuration: 2500 })
            return
          }
          this.message.success('<b>Excelente!</b> Se guardo el usuario con éxito', { nzDuration: 2500 })
          this.getData()
          this.drawerRef.close()
        })
    }
  }

  close(): void {
    this.drawerRef.close()
    this.dataForm = this.globalService.createDefaultObject<DatatableUser>({
      id: '',
      activo: false,
      cargo: '',
      correo: '',
      descripcion_tipo_usuario: '',
      id_tipo_usuario: '',
      nombre: '',
      telefono: 0,
      loading: false
    })
  }

  reset(): void{
    this.searchValue = '';
    this.search();
  }

  search(): void{
    this.listOfData = this.listOfDataCopy.filter(({ nombre, correo, descripcion_tipo_usuario, cargo, telefono  }: DatatableUser) => {
      return nombre.toLocaleLowerCase().includes(this.searchValue.toLocaleLowerCase()) ||
      correo.toLocaleLowerCase().includes(this.searchValue.toLocaleLowerCase()) ||
      descripcion_tipo_usuario.toLocaleLowerCase().includes(this.searchValue.toLocaleLowerCase())||
      cargo.toLocaleLowerCase().includes(this.searchValue.toLocaleLowerCase()) ||
      telefono.toString().includes(this.searchValue)
    });
  }
}



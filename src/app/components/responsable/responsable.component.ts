import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// component ant-desing
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';

// interfaces
import { PersonasFrontend, PersonasFrontendForm } from '../../interface/frontend.interface';
import { TableScrollX } from '../../interface/global.interface';
import { DatatableRoleProject } from '../../interface/roleproject.interface';

// services
import { UserService } from '../../service/user/user.service';
import { RoleProjectService } from '../../service/role-project/role-project.service';
import { DatatableUser } from '../../interface/user.interface';

@Component({
  selector: 'app-responsable',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    FormsModule,
    NzFormModule,
    NzSelectModule,
    NzTableModule,
    NzEmptyModule,
    NzInputModule,
    NzIconModule,
    ReactiveFormsModule,
    NzPopconfirmModule
  ],
  templateUrl: './responsable.component.html',
  styleUrl: './responsable.component.css'
})
export class ResponsableComponent {

  @Input({ required: true }) responsible: Array<PersonasFrontend>;
  @Output() responsibleChange = new EventEmitter<Array<PersonasFrontend>>();
  isAddNewResponsible: boolean;
  editCacheTableResponsible: { [key: string]: { edit: boolean; data: PersonasFrontend } };
  isLoadingResponsible: boolean;
  optionListResponsible: Array<DatatableUser>;
  optionListCopyResponsible: Array<DatatableUser>;
  isLoadingRol: boolean;
  optionListRol: Array<DatatableRoleProject>;
  optionListCopyRol: Array<DatatableRoleProject>;

  widthUser: string;
  widthRol: string;
  widthAction: string;
  scrollTableX: TableScrollX;

  constructor(
    private fb: NonNullableFormBuilder,
    private serviceUser: UserService,
    private serviceRol: RoleProjectService,
    private message: NzMessageService
  ) {
    this.isAddNewResponsible = false;
    this.responsible = [];
    this.editCacheTableResponsible = {};
    this.isLoadingResponsible = true;
    this.optionListCopyResponsible = [];
    this.optionListResponsible = [];
    this.isLoadingRol = true;
    this.optionListRol = [];
    this.optionListCopyRol = [];
    this.widthUser = '';
    this.widthRol = '';
    this.widthAction = '';
    this.scrollTableX = { x: '' };
    this.adjustColumnWidths();
    this.onSearchResponsible('');
    this.onSearchRol('');
  }

  ngOnInit() {
    this.resetIndexCache()
  }

  validateFormResponsible: FormGroup<PersonasFrontendForm> = this.fb.group({
    id_rol: ['', [Validators.required]],
    id_usuario: ['', [Validators.required]]
  });

  // Listener que detecta cambios en el tamaño de la pantalla
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.adjustColumnWidths();
  }

  adjustColumnWidths() {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 768) {
      this.widthRol = '40px';
      this.widthUser = '35px';
      this.widthAction = '14px';
      this.scrollTableX = { x: '' };
    } else {
      this.widthRol = '180px';
      this.widthUser = '180px';
      this.widthAction = '85px';
      this.scrollTableX = { x: '100hv' };
    }
  }

  submitFormResponsible(): void {
    if (!this.validateFormResponsible.valid) {
      Object.values(this.validateFormResponsible.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty()
          control.updateValueAndValidity({ onlySelf: true })
        }
      });
      return
    }
    const { id_rol, id_usuario } = this.validateFormResponsible.value;
    this.responsible = [...this.responsible, {
      id_rol: id_rol ?? "",
      id_usuario: id_usuario ?? "",
      nombre_usuario: this.getUserNameByIdResponsible(JSON.stringify(id_usuario)),
      descripcion_rol: this.getRolNameByIdRol(JSON.stringify(id_rol))
    }]
    this.editCacheTableResponsible = {
      ...this.editCacheTableResponsible,
      [this.responsible.length - 1]: {
        data: {
          id_rol: id_rol ?? "",
          id_usuario: id_usuario ?? ""
        },
        edit: false
      }
    }
    this.validateFormResponsible.reset();
    this.responsibleChange.emit(this.responsible);
  }

  addResponsible(): void {
    this.isAddNewResponsible = true
  }

  deleteResponsible(tableIndex: number): void {
    delete this.editCacheTableResponsible[tableIndex]
    this.responsible = this.responsible.filter((responsible, index) => index != tableIndex)
    this.resetIndexCache()
    this.responsibleChange.emit(this.responsible)
  }

  resetIndexCache() : void {
    this.responsible.forEach((data, index) => {
      this.editCacheTableResponsible = {
        ...this.editCacheTableResponsible,
        [JSON.stringify(index)]: {
          edit: false,
          data
        }
      }
    })
  }

  startEditResponsible(index: number): void {
    this.editCacheTableResponsible[index].edit = true;
  }

  saveEditResponsible(index: number): void {
    Object.assign(this.responsible[index], this.editCacheTableResponsible[index].data);
    this.editCacheTableResponsible[index].edit = false;
    this.responsibleChange.emit(this.responsible);
  }

  cancelEditResponsible(index: number): void {
    this.editCacheTableResponsible[index] = {
      data: { ...this.responsible[index] },
      edit: false
    };
    this.responsibleChange.emit(this.responsible);
  }

  getUserNameByIdResponsible(idResponsible: string): string {
    const filteredServe = this.optionListResponsible.filter(({ id }) => id == idResponsible);
    return filteredServe[0].nombre;
  }

  getRolNameByIdRol(idRol: string): string{
    const filteredServe = this.optionListRol.filter(({ id }) => id == idRol);
    return filteredServe[0].descripcion;
  }


  showRefResponsible(): void {
    this.isAddNewResponsible = true
  }

  onSearchResponsible(value: string): void {
    if (!value) {
      this.isLoadingResponsible = true
      this.serviceUser.getUsersActives().subscribe((data: any) => {
        this.isLoadingResponsible = false
        if (data.ok != undefined && data.ok == false) {
          this.message.error('<b>¡Ups!</b> Hubo un error al obtener los usuarios', { nzDuration: 2500 })
          return
        }
        if (data.resp != undefined && !data.resp) {
          this.message.error(`<b>¡Ups!</b> ${data.message}`, { nzDuration: 2500 })
          return
        }
        this.optionListResponsible = data.data;
        this.optionListCopyResponsible = data.data;
      })
    } else {
      this.optionListResponsible = this.optionListCopyResponsible.filter(({ nombre }) => nombre.toLocaleUpperCase().includes(value.toLocaleUpperCase()))
    }
  }

  onSearchRol(value: string) {
    if (!value) {
      this.isLoadingRol = true
      this.serviceRol.getAllRoleProjects().subscribe((data: any) => {
        this.isLoadingRol = false
        if (data.ok != undefined && data.ok == false) {
          this.message.error('<b>¡Ups!</b> Hubo un error al obtener los roles', { nzDuration: 2500 })
          return
        }
        if (data.resp != undefined && !data.resp) {
          this.message.error(`<b>¡Ups!</b> ${data.message}`, { nzDuration: 2500 })
          return
        }
        this.optionListRol = data.data;
        this.optionListCopyRol = data.data;
      })
    } else {
      this.optionListRol = this.optionListCopyRol.filter(({ descripcion }) => descripcion.toLocaleUpperCase().includes(value.toLocaleUpperCase()))
    }
  }

}

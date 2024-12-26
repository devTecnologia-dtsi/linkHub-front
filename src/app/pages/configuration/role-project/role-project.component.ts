import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// interfaces
import { DrawerFooter, drawerTemplate } from '../../../interface/global.interface';
import { ColumnItemRoleProject, DataRoleProject, DatatableRoleProject, FormRoleProject } from '../../../interface/roleproject.interface';
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
// services
import { RoleProjectService } from '../../../service/role-project/role-project.service';
import { GlobalService } from '../../../service/global/global.service';
@Component({
  selector: 'app-role-project',
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
    ReactiveFormsModule
  ],
  templateUrl: './role-project.component.html',
  styleUrl: './role-project.component.css'
})
export class RoleProjectComponent {

  @ViewChild('drawerRoleProject', { static: false }) drawerTemplate?: TemplateRef<drawerTemplate>
  @ViewChild('footerRoleProject', { static: false }) drawerFooter?: TemplateRef<DrawerFooter>
  isLoading: boolean = true
  isSaving: boolean = false

  drawerRef: any
  dataForm: DatatableRoleProject = {
    descripcion: '',
    id: '',
    activo: false,
    loading: false
  }
  edit: boolean = false // variable usada para saber cuando se esta actualizando el registro
  searchValue: string = ''

  validateForm: FormGroup<FormRoleProject> = this.fb.group({ descripcion: ['', [Validators.required]] });

  listOfColumns: ColumnItemRoleProject[] = [
    {
      name: 'id',
      sortOrder: null,
      sortFn: (a: DatatableRoleProject, b: DatatableRoleProject) => JSON.stringify(a.id).localeCompare(JSON.stringify(b.id)),
      showSort: true
    },
    {
      name: 'Rol',
      sortOrder: null,
      sortFn: (a: DatatableRoleProject, b: DatatableRoleProject) => a.descripcion.localeCompare(b.descripcion),
      showSort: true
    },
    {
      name: 'Acciones',
      sortFn: null,
      sortOrder: null,
      showSort: false
    }
  ];
  listOfDataCopy: DatatableRoleProject[] = [];
  listOfData: DatatableRoleProject[] = [];

  constructor(
    private drawerService: NzDrawerService,
    private fb: NonNullableFormBuilder,
    private serviceRoleProject: RoleProjectService,
    private message: NzMessageService,
    private globalService: GlobalService
  ) { }

  ngOnInit(): void {
    this.getData()
  }

  getData(): void {
    this.isLoading = true
    this.serviceRoleProject.getAllRoleProjects()
      .subscribe((data: any) => {
        this.isLoading = false
        if (data.ok != undefined && data.ok == false) {
          this.message.error('<b>!Ups!</b> Hubo un error al obtener los roles', { nzDuration: 2500 })
          return
        }
        this.listOfData = data.data
        this.listOfDataCopy = data.data
      })
  }

  openTemplate(): void {
    this.drawerRef = this.drawerService.create({
      nzTitle: 'Crear Rol de Proyecto',
      nzContent: this.drawerTemplate,
      nzFooter: this.drawerFooter,
      nzContentParams: { edit: false }
    });
  }

  openEditTemplate(data: DataRoleProject): void {
    this.edit = true
    this.dataForm = data
    this.drawerRef = this.drawerService.create({
      nzTitle: 'Editar Rol de Proyecto',
      nzContent: this.drawerTemplate,
      nzFooter: this.drawerFooter,
      nzContentParams: { edit: true }
    });
    this.drawerRef.nzOnClose.subscribe(() => {
      this.dataForm = { descripcion: '', id: '', activo: false, loading: false }
    });
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
    const { descripcion } = this.validateForm.value

    if (this.edit) {
      this.isSaving = true
      this.dataForm = { ...this.dataForm, descripcion: descripcion ? descripcion : '' }
      this.serviceRoleProject.editRoleProject({ ...this.dataForm, descripcion: descripcion ? descripcion : '' })
        .subscribe((data: any) => {
          this.isSaving = false
          if (data.resp != undefined && data.resp == false) {
            this.message.error(`<b>!Ups!</b> ${data.message}`, { nzDuration: 2500 })
            return
          }
          this.message.success('<b>!Excelente!</b> Se actualizo el rol con éxito', { nzDuration: 2500 })
          this.drawerRef.close()
          this.edit = false
          this.listOfData = this.listOfData.map((data) => {
            return (data.id == this.dataForm.id) ? { ...data, descripcion: this.dataForm.descripcion } : data
          })
          this.dataForm = { descripcion: '', id: '', activo: false, loading: false }
        })
    } else {
      this.isSaving = true
      this.serviceRoleProject.saveRoleProject(descripcion)
        .subscribe((data: any) => {
          this.isSaving = false
          if (data.resp != undefined && data.resp == false) {
            this.message.error(`<b>!Ups!</b> ${data.message}`, { nzDuration: 2500 })
            return
          }
          this.message.success('<b>!Excelente!</b> Se guardo el rol con éxito', { nzDuration: 2500 })
          this.getData()
          this.drawerRef.close()
        })
    }
  }

  changeState(dataChange: DatatableRoleProject): void {
    dataChange.loading = true
    this.serviceRoleProject.changeState(dataChange.id).subscribe((data: any) => {
      dataChange.loading = false
      if (data.ok != undefined && data.ok == false) {
        this.message.error('<b>!Ups!</b> Hubo un error al eliminar la base de datos', { nzDuration: 2500 })
        return
      }
      if (data.resp != undefined && !data.resp) {
        this.message.error(`<b>!Ups!</b> ${data.message}`, { nzDuration: 2500 })
        return
      }
      dataChange.activo = !dataChange.activo
      this.message.success(`<b>!Execelente!</b> ${data.message}`, { nzDuration: 2500 })
    })
  }

  close(): void {
    this.drawerRef.close()
    this.dataForm = this.globalService.createDefaultObject<DatatableRoleProject>({
      descripcion: '',
      id: '',
      activo: false,
      loading: false
    })
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.listOfData = this.listOfDataCopy.filter(({ descripcion }: DatatableRoleProject) => {
      return descripcion.toLocaleUpperCase().includes(this.searchValue.toLocaleUpperCase())
    });
  }
}

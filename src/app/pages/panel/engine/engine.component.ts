import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer';
// interfaces
import { DrawerFooter, drawerTemplate } from '../../../interface/global.interface';
import { ColumnItemEngine, DatatableEngine, FormEngine } from '../../../interface/engine.interface';
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
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
// services
import { EngineService } from '../../../service/engine/engine.service';
import { GlobalService } from '../../../service/global/global.service';
@Component({
  selector: 'app-engine',
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
    ReactiveFormsModule
  ],
  templateUrl: './engine.component.html',
  styleUrl: './engine.component.css'
})
export class EngineComponent {
  @ViewChild('drawerEngine', { static: false }) drawerTemplate?: TemplateRef<drawerTemplate>
  @ViewChild('footerEngine', { static: false }) drawerFooter?: TemplateRef<DrawerFooter>
  isLoading: boolean = true
  isSaving: boolean = false
  isDeleting: boolean = false
  searchValue: string = '';
  drawerRef: any
  dataForm: DatatableEngine = {
    id: '',
    descripcion: '',
    activo: false,
    loading: false
  }
  edit: boolean = false // variable usada para saber cuando se esta actualizando el registro

  validateForm: FormGroup<FormEngine> = this.fb.group({ descripcion: ['', [Validators.required]] });

  listOfColumns: ColumnItemEngine[] = [
    {
      name: 'id',
      sortOrder: null,
      sortFn: (a: DatatableEngine, b: DatatableEngine) => JSON.stringify(a.id).localeCompare(JSON.stringify(b.id)),
      showSort: true
    },
    {
      name: 'Motor',
      sortOrder: null,
      sortFn: (a: DatatableEngine, b: DatatableEngine) => a.descripcion.localeCompare(b.descripcion),
      showSort: true
    },
    {
      name: 'Acciones',
      sortFn: null,
      sortOrder: null,
      showSort: false
    }
  ];
  listOfData: DatatableEngine[] = [];
  listOfDataCopy :DatatableEngine[] = [];

  constructor(
    private drawerService: NzDrawerService,
    private fb: NonNullableFormBuilder,
    private serviceEngine: EngineService,
    private message: NzMessageService,
    private globalService: GlobalService
  ) { }

  ngOnInit(): void {
    this.getData()
  }

  getData(): void {
    this.isLoading = true
    this.serviceEngine.getAllEngines()
      .subscribe((data: any) => {
        this.isLoading = false
        if (data.ok != undefined && data.ok == false) {
          this.message.error('¡Ups! Hubo un error al obtener los motores', { nzDuration: 2500 })
          return
        }
        this.listOfData = data.data
        this.listOfDataCopy = data.data
      })
  }

  openTemplate(): void {
    this.drawerRef = this.drawerService.create({
      nzTitle: 'Crear Motor',
      nzContent: this.drawerTemplate,
      nzFooter: this.drawerFooter,
      nzContentParams: { edit: false }
    });
  }

  openEditTemplate(data: DatatableEngine): void {
    this.edit = true
    this.dataForm = data
    this.drawerRef = this.drawerService.create({
      nzTitle: 'Editar Motor',
      nzContent: this.drawerTemplate,
      nzFooter: this.drawerFooter,
      nzContentParams: { edit: true }
    });
    this.drawerRef.nzOnClose.subscribe(() => {
      this.dataForm = {
        id: '',
        descripcion: '',
        activo: false,
        loading: false
      }
    });
  }

  changeState(dataChange: DatatableEngine): void {
    dataChange.loading = true
    this.serviceEngine.changeState(dataChange.id).subscribe((data: any) => {
      dataChange.loading = false
      if (data.ok != undefined && data.ok == false) {
        this.message.error('<b>¡Ups!</b> Hubo un error al eliminar el motor', { nzDuration: 2500 })
        return
      }
      if (data.resp != undefined && !data.resp) {
        this.message.error(`<b>¡Ups!</b> ${data.message}`, { nzDuration: 2500 })
        return
      }
      dataChange.activo = !dataChange.activo
      this.message.success(`<b>¡Excelente!</b> ${data.message}`, { nzDuration: 2500 })
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
    const { descripcion } = this.validateForm.value

    if (this.edit) {
      this.isSaving = true
      this.dataForm = { ...this.dataForm, descripcion: descripcion ? descripcion : '' }
      this.serviceEngine.editEngines(this.dataForm)
        .subscribe((data: any) => {
          this.isSaving = false
          if (data.ok != undefined && data.ok == false) {
            this.message.error('<b>¡Ups!</b> Hubo un error al editar el motor', { nzDuration: 2500 })
            return
          }
          if (data.resp != undefined && !data.resp) {
            this.message.error(`<b>¡Ups!</b> ${data.message}`, { nzDuration: 2500 })
            return
          }
          this.message.success('<b>¡Excelente!</b> Se actualizo el motor con éxito', { nzDuration: 2500 })
          this.drawerRef.close()
          this.edit = false
          this.listOfData = this.listOfData.map((data) => {
            return (data.id == this.dataForm.id) ? { ...data, descripcion: this.dataForm.descripcion } : data
          })
          this.dataForm = {
            id: '',
            descripcion: '',
            activo: false,
            loading: false
          }
        })
    } else {
      this.isSaving = true
      this.serviceEngine.saveEngine(descripcion)
        .subscribe((data: any) => {
          this.isSaving = false
          if (data.ok != undefined && data.ok == false) {
            this.message.error('<b>¡Ups!</b> Hubo un error al guardar el motor', { nzDuration: 2500 })
            return
          }
          if (data.resp != undefined && !data.resp) {
            this.message.error(`<b>¡Ups!</b> ${data.message}`, { nzDuration: 2500 })
            return
          }
          this.message.success('<b>¡Excelente!</b> Se guardo el motor con exito', { nzDuration: 2500 })
          this.getData()
          this.drawerRef.close()
        })
    }
  }

  close(): void {
    this.drawerRef.close()
    this.dataForm = this.globalService.createDefaultObject<DatatableEngine>(this.dataForm)
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.listOfData = this.listOfDataCopy.filter(({descripcion}: DatatableEngine) => {
      return descripcion.toLocaleUpperCase().includes(this.searchValue.toLocaleUpperCase())
    })
  }
}

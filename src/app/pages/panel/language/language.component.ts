import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer';
// interfaces
import { DrawerFooter, drawerTemplate } from '../../../interface/global.interface';
import { FormLanguage, DataTableLanguage, ColumnItemLanguage, DataLanguage } from '../../../interface/language.interface';
// component and-desing
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
// services
import {languageService} from '../../../service/language/language.service';
import { GlobalService } from '../../../service/global/global.service';

@Component({
  selector: 'app-language',
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
  templateUrl: './language.component.html',
  styleUrl: './language.component.css'
})
export class languageComponent {
  @ViewChild('drawerLanguage', { static: false }) drawerTemplate?: TemplateRef<drawerTemplate>
  @ViewChild('footerLanguage', { static: false }) drawerFooter?: TemplateRef<DrawerFooter>
  isLoading: boolean = true
  isSaving: boolean = false
  searchValue: string = ''

  drawerRef: any
  dataForm: DataTableLanguage = {
    activo: false,
    nombre: '',
    id: '',
    loading: false
  }
  edit: boolean = false // variable usada para saber cuando se esta actualizando el registro

  validateForm: FormGroup<FormLanguage> = this.fb.group({
    nombre: ['', [Validators.required]]
  });

  listOfColumns: ColumnItemLanguage[] = [
    {
      name: 'id',
      sortOrder: null,
      sortFn: (a: DataLanguage, b: DataLanguage) => JSON.stringify(a.id).localeCompare(JSON.stringify(b.id)),
      showSort: true

    },
    {
      name: 'Nombre',
      sortOrder: null,
      sortFn: (a: DataLanguage, b:DataLanguage) => JSON.stringify(a.nombre).localeCompare(JSON.stringify(b.nombre)),
      showSort: true

    },
    {
      name: 'Acciones',
      sortFn: null,
      sortOrder: null,
      showSort:false
    }
  ];
  listOfData: DataLanguage[] = [];
  listOfDataCopy: DataLanguage[] = [];

  constructor(
    private drawerService: NzDrawerService,
    private fb: NonNullableFormBuilder,
    private languageService: languageService,
    private message: NzMessageService,
    private globalService: GlobalService
  ) { }

  ngOnInit(): void {
    this.getData()
  }

  getData(): void {
    this.isLoading = true
    this.languageService.getAllLanguage()
      .subscribe((data: any) => {
        this.isLoading = false
        if (data.ok != undefined && data.ok == false) {
          this.message.error('¡Ups! Hubo un error al obtener los lenguajes', { nzDuration: 2500 })
          return
        }
        this.listOfData = data.data
        this.listOfDataCopy = data.data
      })
  }

  openTemplate(): void {
    this.drawerRef = this.drawerService.create({
      nzTitle: 'Crear Lenguaje',
      nzContent: this.drawerTemplate,
      nzFooter: this.drawerFooter,
      nzContentParams: { edit: false }
    });
  }

  openEditTemplate(data: DataTableLanguage): void {
    this.edit = true
    this.dataForm = data
    this.drawerRef = this.drawerService.create({
      nzTitle: 'Editar Lenguaje',
      nzContent: this.drawerTemplate,
      nzFooter: this.drawerFooter,
      nzContentParams: { edit: true }
    });
    this.drawerRef.nzOnClose.subscribe(() => {
      this.dataForm = {
        activo: false,
        nombre: '',
        id: '',
        loading: false
      }
    });
  }

  changeState(dataChange: DataTableLanguage): void {
    dataChange.loading = true
    this.languageService.changeState(dataChange.id).subscribe((data: any) => {
      dataChange.loading = false
      if (data.ok != undefined && data.ok == false) {
        this.message.error('<b>¡Ups!</b> Hubo un error al eliminar el lenguaje', { nzDuration: 2500 })
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
    const { nombre } = this.validateForm.value
    this.dataForm = {
      ...this.dataForm,
      nombre: nombre ? nombre : ''
    }
    if (this.edit) {
      this.isSaving = true
      this.languageService.editLanguage(this.dataForm)
        .subscribe((data: any) => {
          this.isSaving = false
          if (data.ok != undefined && data.ok == false) {
            this.message.error('<b>¡Ups!</b> Hubo un error al editar el lenguaje', { nzDuration: 2500 })
            return
          }
          if (data.resp != undefined && !data.resp) {
            this.message.error(`<b>¡Ups!</b> ${data.message}`, { nzDuration: 2500 })
            return
          }
          this.message.success('<b>¡Excelente!</b> Se actualizo el lenguaje con éxito', { nzDuration: 2500 })
          this.drawerRef.close()
          this.edit = false
          this.getData()
          this.dataForm = {
            activo: false,
            nombre: '',
            id: '',
            loading: false
          }
        })
    } else {
      this.isSaving = true
      this.languageService.saveLanguage(this.dataForm)
        .subscribe((data: any) => {
          this.isSaving = false
          if (data.ok != undefined && data.ok == false) {
            this.message.error('<b>¡Ups!</b> Hubo un error al guardar el lenguaje', { nzDuration: 2500 })
            return
          }
          if (data.resp != undefined && !data.resp) {
            this.message.error(`<b>¡Ups!</b> ${data.message}`, { nzDuration: 2500 })
            return
          }
          this.message.success('<b>¡Excelente!</b> Se guardo el lenguaje con éxito', { nzDuration: 2500 })
          this.getData()
          this.dataForm = {
            activo: false,
            nombre: '',
            id: '',
            loading: false
          }
          this.drawerRef.close()
        })
    }
  }

  close(): void{
    this.drawerRef.close()
    this.dataForm = this.globalService.createDefaultObject<DataLanguage>(this.dataForm)
  }

  reset(): void{
    this.searchValue = '';
    this.search();
  }

  search(): void{
    this.listOfData = this.listOfDataCopy.filter(({nombre}: DataLanguage) => {
      return nombre.toLocaleUpperCase().includes(this.searchValue.toLocaleUpperCase())
    });
  }
}

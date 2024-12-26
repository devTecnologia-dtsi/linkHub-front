import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer';
// interfaces
import { DrawerFooter, drawerTemplate } from '../../../interface/global.interface';
import { ColumnItemDocument, DatatableDocument, FormDocument } from '../../../interface/document.interface';
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
import { DocumentService } from '../../../service/document/document.service';
import { GlobalService } from '../../../service/global/global.service';
@Component({
  selector: 'app-document',
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
  templateUrl: './document.component.html',
  styleUrl: './document.component.css'
})
export class DocumentComponent {
  @ViewChild('drawerDocument', { static: false }) drawerTemplate?: TemplateRef<drawerTemplate>
  @ViewChild('footerDocument', { static: false }) drawerFooter?: TemplateRef<DrawerFooter>
  isLoading: boolean = true
  isSaving: boolean = false
  searchValue: string = '';

  drawerRef: any
  dataForm: DatatableDocument = {
    id: '',
    nombre_documento: '',
    activo: false,
    loading: false
  }
  edit: boolean = false // variable usada para saber cuando se esta actualizando el registro

  validateForm: FormGroup<FormDocument> = this.fb.group({ descripcion: ['', [Validators.required]] });

  listOfColumns: ColumnItemDocument[] = [
    {
      name: 'id',
      sortOrder: null,
      sortFn: (a: DatatableDocument, b:DatatableDocument)=> JSON.stringify(a.id).localeCompare(JSON.stringify(b.id)),
      showSort: true
    },
    {
      name: 'Documento',
      sortOrder: null,
      sortFn: (a: DatatableDocument, b: DatatableDocument)=> a.nombre_documento.localeCompare(b.nombre_documento),
      showSort: true
    },
    {
      name: 'Acciones',
      sortFn: null,
      sortOrder: null,
      showSort: false
    }
  ];

  listOfData: DatatableDocument[] = [];
  listOfDataCopy: DatatableDocument[] = [];

  constructor(
    private drawerService: NzDrawerService,
    private fb: NonNullableFormBuilder,
    private serviceDocument: DocumentService,
    private message: NzMessageService,
    private globalService: GlobalService

  ) { }

  ngOnInit(): void {
    this.getData()
  }

  getData(): void {
    this.isLoading = true
    this.serviceDocument.getAllDocuments()
      .subscribe((data: any) => {
        this.isLoading = false
        if (data.ok != undefined && data.ok == false) {
          this.message.error('!Ups! Hubo un error al obtener los ambientes', { nzDuration: 2500 })
          return
        }
        this.listOfData = data.data
        this.listOfDataCopy = data.data
      })
  }

  openTemplate(): void {
    this.drawerRef = this.drawerService.create({
      nzTitle: 'Crear Documento',
      nzContent: this.drawerTemplate,
      nzFooter: this.drawerFooter,
      nzContentParams: { edit: false }
    });
  }

  openEditTemplate(data: DatatableDocument): void {
    this.edit = true
    this.dataForm = data
    this.drawerRef = this.drawerService.create({
      nzTitle: 'Editar Documento',
      nzContent: this.drawerTemplate,
      nzFooter: this.drawerFooter,
      nzContentParams: { edit: true }
    });
    this.drawerRef.nzOnClose.subscribe(() => {
      this.dataForm = {
        id: '',
        nombre_documento: '',
        activo: false,
        loading: false
      }
    });
  }

  changeState(dataChange: DatatableDocument): void {
    dataChange.loading = true
    this.serviceDocument.changeState(dataChange.id).subscribe((data: any) => {
      dataChange.loading = false
      if (data.ok != undefined && data.ok == false) {
        this.message.error('<b>!Ups!</b> Hubo un error al eliminar el documento', { nzDuration: 2500 })
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
    const { descripcion } = this.validateForm.value

    if (this.edit) {
      this.isSaving = true
      this.dataForm = { ...this.dataForm, nombre_documento: descripcion ? descripcion : '' }
      this.serviceDocument.editDocument({ ...this.dataForm, nombre_documento: descripcion ? descripcion : '' })
        .subscribe((data: any) => {
          this.isSaving = false
          if (data.ok != undefined && data.ok == false) {
            this.message.error('<b>!Ups!</b> Hubo un error al editar el documento', { nzDuration: 2500 })
            return
          }
          if (data.resp != undefined && !data.resp) {
            this.message.error(`<b>¡Ups!</b> ${data.message}`, { nzDuration: 2500 })
            return
          }
          this.message.success('<b>!Excelente!</b> Se actulizo el documento con exito', { nzDuration: 2500 })
          this.drawerRef.close()
          this.edit = false
          this.listOfData = this.listOfData.map((data) => {
            return (data.id == this.dataForm.id) ? { ...data, nombre_documento: this.dataForm.nombre_documento } : data
          })
          this.dataForm = { 
            id: '',
            nombre_documento: '',
            activo: false,
            loading: false
          }
        })
    } else {
      this.isSaving = true
      this.serviceDocument.saveDocument(descripcion)
        .subscribe((data: any) => {
          this.isSaving = false
          if (data.ok != undefined && data.ok == false) {
            this.message.error('<b>!Ups!</b> Hubo un error al guardar el documento', { nzDuration: 2500 })
            return
          }
          if (data.resp != undefined && !data.resp) {
            this.message.error(`<b>¡Ups! ${data.message}`, { nzDuration: 2500 })
            return
          }
          this.message.success('<b>!Excelente!</b> Se guardo el documento con exito', { nzDuration: 2500 })
          this.getData()
          this.drawerRef.close()
        })
    }
  }

  close(): void {
    this.drawerRef.close()
    this.dataForm = this.globalService.createDefaultObject<DatatableDocument>(this.dataForm)
  }

  reset(): void{
    this.searchValue = '';
    this.search();
  }

  search(): void{
    this.listOfData = this.listOfDataCopy.filter(({ nombre_documento }: DatatableDocument) => {
      return nombre_documento.toLocaleUpperCase().includes(this.searchValue.toLocaleUpperCase())
    });
  }

}

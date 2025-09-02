import { Component, HostListener, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// interfaces
import { DrawerFooter, drawerTemplate } from '../../../interface/global.interface';
import { DataTableLanguage } from '../../../interface/language.interface';
import { ColumnItemBackend, DataTableBackend, FormBackend } from '../../../interface/backend.interface';

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
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAlertModule } from 'ng-zorro-antd/alert';

// Services
import { GlobalService } from '../../../service/global/global.service';
import { languageService } from '../../../service/language/language.service';
import { BackendService } from '../../../service/backend/backend.service';

// components
import { ServerComponent } from '../../../components/server/server.component';
import { ResponsableComponent } from '../../../components/responsable/responsable.component';
import { DocumentsComponent } from '../../../components/documents/documents.component';
import { forbiddenNameValidator } from '../../../validators/forbidden-name.validator';

@Component({
  selector: 'app-backend',
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
    NzTabsModule,
    NzEmptyModule,
    NzCardModule,
    NzAlertModule,
    ReactiveFormsModule,
    ServerComponent,
    BackendComponent,
    ResponsableComponent,
    DocumentsComponent
  ],
  templateUrl: './backend.component.html',
  styleUrl: './backend.component.css'
})
export class BackendComponent {

  @ViewChild('drawerBackend', { static: false }) drawerTemplate?: TemplateRef<drawerTemplate>
  @ViewChild('footerBackend', { static: false }) drawerFooter?: TemplateRef<DrawerFooter>
  isLoading: boolean = true
  isSaving: boolean = false
  searchValue: string = ''
  expandSet = new Set<string>();

  sizeWindow: 'large' | 'default' = "default";

  drawerRef: any
  dataForm: DataTableBackend = {
    activo: false,
    autenticacion: '',
    body: '',
    coleccion: '',
    creacion: '',
    descripcion_lenguaje: '',
    id: '',
    id_lenguaje: '',
    metodo: '',
    modificacion: '',
    URL_Versionamiento: '',
    documentos: [],
    responsables: [],
    servidores: [],
    nombre_backend: '',
    endpoint: '',
    loading: false
  }
  edit: boolean = false // variable usada para saber cuando se esta actualizando el registro
  isAddNewBackend: boolean = false

  // select lenguage
  isLoadingLenguage: boolean = false;
  selectedLenguage: number = 0;
  optionListLenguage: Array<DataTableLanguage> = [];
  optionListCopyLenguage: Array<DataTableLanguage> = [];


  validateForm: FormGroup<FormBackend> = this.fb.group({
    autenticacion: ['', [Validators.required]],
    body: ['', []],
    coleccion: ['', [Validators.required, forbiddenNameValidator([/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/[^\s]*)?$/])]],
    id_lenguaje: ['', [Validators.required]],
    metodo: ['', [Validators.required]],
    url_versionamiento: ['', [Validators.required, forbiddenNameValidator([/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/[^\s]*)?$/])]],
    nombre_backend: ['', [Validators.required]],
    endpoint: ['', [Validators.required]]
  });

  listOfColumns: ColumnItemBackend[] = [
    {
      name: '',
      sortOrder: null,
      sortFn: null,
      showSort: false
    },
    {
      name: 'Nombre Backend',
      sortOrder: null,
      sortFn: (a: DataTableBackend, b: DataTableBackend) => a.nombre_backend.localeCompare(b.nombre_backend),
      showSort: true
    },
    {
      name: 'Metodo',
      sortOrder: null,
      sortFn: (a: DataTableBackend, b: DataTableBackend) => a.metodo.localeCompare(b.metodo),
      showSort: true
    },
    {
      name: 'Endpoint',
      sortOrder: null,
      sortFn: (a: DataTableBackend, b: DataTableBackend) => a.endpoint.localeCompare(b.endpoint),
      showSort: true
    },
    {
      name: 'Autenticación',
      sortOrder: null,
      sortFn: (a: DataTableBackend, b: DataTableBackend) => a.autenticacion.localeCompare(b.autenticacion),
      showSort: true
    },
    {
      name: "Url's",
      sortOrder: null,
      sortFn: null,
      showSort: false
    },
    {
      name: 'Acciones',
      sortFn: null,
      sortOrder: null,
      showSort: false
    }
  ];
  listOfData: DataTableBackend[] = [];
  listOfDataCopy: DataTableBackend[] = [];

  constructor(
    private drawerService: NzDrawerService,
    private fb: NonNullableFormBuilder,
    private serviceBackend: BackendService,
    private serviceLenguage: languageService,
    private message: NzMessageService,
    private globalService: GlobalService
  ) { }

  ngOnInit(): void {
    this.getData()
    this.setWidthWindow(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setWidthWindow(window.innerWidth);
  }

  setWidthWindow(widthWindow: number): void {
    this.sizeWindow = widthWindow > 720 ? 'large' : 'default';
  }

  getData(): void {
    this.isLoading = true
    this.serviceBackend.getAllBackends()
      .subscribe((data: any) => {
        this.isLoading = false
        if (data.ok != undefined && data.ok == false) {
          this.message.error('¡Ups! Hubo un error al obtener los backends', { nzDuration: 2500 })
          return
        }
        const dataConverted = data.data.map(({ documentos, servidores, responsables, ...rest }: any ) => {
          return {
            ...rest,
            documentos: JSON.parse(documentos),
            servidores: JSON.parse(servidores),
            responsables: JSON.parse(responsables)
          }
        });
        this.listOfData = dataConverted
        this.listOfDataCopy = dataConverted
      })
  }


  openTemplate(): void {
    this.drawerRef = this.drawerService.create({
      nzTitle: 'Crear Backend',
      nzContent: this.drawerTemplate,
      nzFooter: this.drawerFooter,
      nzContentParams: { edit: false },
      nzSize: this.sizeWindow
    });
    this.drawerRef.nzOnClose.subscribe(() => this.close());
  }

  openEditTemplate(data: DataTableBackend): void {
    this.edit = true
    this.onSearchLenguage('')
    this.dataForm = data
    this.drawerRef = this.drawerService.create({
      nzTitle: 'Editar Backend',
      nzContent: this.drawerTemplate,
      nzFooter: this.drawerFooter,
      nzContentParams: { edit: true },
      nzSize: this.sizeWindow
    });
    this.drawerRef.nzOnClose.subscribe(() => this.close());
  }

  changeState(dataChange: DataTableBackend): void {
    dataChange.loading = true
    this.serviceBackend.changeState(dataChange.id).subscribe((data: any) => {
      dataChange.loading = false
      if (data.ok != undefined && data.ok == false) {
        this.message.error('<b>¡Ups!</b> Hubo un error al cambiar el estado backend', { nzDuration: 2500 })
        return
      }
      if (data.resp != undefined && !data.resp) {
        this.message.error(`<b>¡Ups!</b> ${data.message}`, { nzDuration: 2500 })
        return
      }
      dataChange.activo = !dataChange.activo
      this.message.success(`<b>¡Execelente!</b> ${data.message}`, { nzDuration: 2500 })
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
    const dataToSave: DataTableBackend = {
      ...this.dataForm,
      ...this.validateForm.value
    }
    if (this.edit) {
      this.isSaving = true
      this.serviceBackend.editBackend(dataToSave, this.dataForm.id)
        .subscribe((data: any) => {
          this.isSaving = false
          if (data.ok != undefined && data.ok == false) {
            this.message.error('<b>¡Ups!</b> Hubo un error al editar el frontend', { nzDuration: 2500 })
            return
          }
          if (data.resp != undefined && !data.resp) {
            this.message.error(`<b>¡Ups!</b> ${data.message}`, { nzDuration: 2500 })
            return
          }
          this.message.success('<b>!Execelente!</b> Se actulizo el frontend con exito', { nzDuration: 2500 })
          this.drawerRef.close()
          this.edit = false
          this.getData()
          this.dataForm = this.globalService.createDefaultObject<DataTableBackend>({
            activo: false,
            autenticacion: '',
            body: '',
            coleccion: '',
            creacion: '',
            descripcion_lenguaje: '',
            id: '',
            id_lenguaje: '',
            metodo: '',
            modificacion: '',
            URL_Versionamiento: '',
            documentos: [],
            responsables: [],
            servidores: [],
            nombre_backend: '',
            endpoint: '',
            loading: false
          })
        })
    } else {
      this.isSaving = true
      this.serviceBackend.saveBackend(dataToSave)
        .subscribe((data: any) => {
          this.isSaving = false
          if (data.ok != undefined && data.ok == false) {
            this.message.error('<b>¡Ups!</b> Hubo un error al guardar el backend', { nzDuration: 2500 })
            return
          }
          if (data.resp != undefined && !data.resp) {
            this.message.error(`<b>¡Ups!</b> ${data.message}`, { nzDuration: 2500 })
            return
          }
          this.message.success('<b>¡Execelente!</b> Se guardo el backend con exito', { nzDuration: 2500 })
          this.getData()
          this.drawerRef.close()
        })
    }
  }

  onSearchLenguage(value: string): void {
    if (!value) {
      this.isLoadingLenguage = true;
      this.serviceLenguage.getLanguageActive().subscribe((data: any) => {
        this.isLoadingLenguage = false;
        if (data.ok != undefined && data.ok == false) {
          this.message.error('<b>¡Ups!</b> Hubo un error al obtener los lenguajes', { nzDuration: 2500 })
          return
        }
        if (data.resp != undefined && !data.resp) {
          this.message.error(`<b>¡Ups!</b> ${data.message}`, { nzDuration: 2500 })
          return
        }
        this.optionListLenguage = data.data;
        this.optionListCopyLenguage = data.data;
      })
    } else {
      this.optionListLenguage = this.optionListCopyLenguage.filter(({ nombre }) => nombre.toLocaleUpperCase().includes(value.toLocaleUpperCase()))
    }
  }

  close(): void {
    this.drawerRef.close()
    this.dataForm = this.globalService.createDefaultObject<DataTableBackend>({
      activo: false,
      autenticacion: '',
      body: '',
      coleccion: '',
      creacion: '',
      descripcion_lenguaje: '',
      id: '',
      id_lenguaje: '',
      metodo: '',
      modificacion: '',
      URL_Versionamiento: '',
      documentos: [],
      responsables: [],
      servidores: [],
      nombre_backend: '',
      endpoint: '',
      loading: false
    })
    this.edit = false
    this.isAddNewBackend = false
    this.getData()
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.listOfData = this.listOfDataCopy.filter(({ autenticacion, metodo }: DataTableBackend) => {
      return autenticacion.toLocaleUpperCase().includes(this.searchValue.toLocaleUpperCase()) ||
        metodo.toLocaleUpperCase().includes(this.searchValue.toLocaleUpperCase());
    });
  }

  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

}

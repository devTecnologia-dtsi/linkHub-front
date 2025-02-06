import { Component, HostListener, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// interfaces
import { DrawerFooter, drawerTemplate } from '../../../interface/global.interface';
import { ColumnItemFrontend, DataFrontend, FormFrontend } from '../../../interface/frontend.interface';
import { DataTableLanguage } from '../../../interface/language.interface';

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
import { FrontendService } from '../../../service/frontend/frontend.service';
import { languageService } from '../../../service/language/language.service';

// components
import { ServerComponent } from '../../../components/server/server.component';
import { BackendComponent } from '../../../components/backend/backend.component';
import { ResponsableComponent } from '../../../components/responsable/responsable.component';
import { DocumentsComponent } from '../../../components/documents/documents.component';
import { forbiddenNameValidator } from '../../../validators/forbidden-name.validator';

@Component({
  selector: 'app-frontend',
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
    ReactiveFormsModule,
    NzAlertModule,
    ServerComponent,
    BackendComponent,
    ResponsableComponent,
    DocumentsComponent
  ],
  templateUrl: './frontend.component.html',
  styleUrl: './frontend.component.css'
})
export class FrontendComponent {
  @ViewChild('drawerFrontend', { static: false }) drawerTemplate?: TemplateRef<drawerTemplate>
  @ViewChild('footerFrontend', { static: false }) drawerFooter?: TemplateRef<DrawerFooter>
  isLoading: boolean = true
  isSaving: boolean = false
  searchValue: string = ''

  sizeWindow: 'large' | 'default' = "default";

  drawerRef: any
  dataForm: DataFrontend = {
    id: '',
    activo: false,
    backends: [],
    creacion: '',
    descripcion_proyecto: '',
    documentos: [],
    id_lenguaje: '',
    loading: false,
    modificacion: '',
    nombre_proyecto: '',
    responsables: [],
    servidores: [],
    url: '',
    url_versionamiento: '',
    tipoApp: false
  }
  edit: boolean = false // variable usada para saber cuando se esta actualizando el registro
  isAddNewServe: boolean = false
  expandSet = new Set<string>();

  // select lenguage
  isLoadingLenguage: boolean = false;
  selectedLenguage: number = 0;
  optionListLenguage: Array<DataTableLanguage> = [];
  optionListCopyLenguage: Array<DataTableLanguage> = [];


  validateForm: FormGroup<FormFrontend> = this.fb.group({
    nombre_proyecto: ['', [Validators.required]],
    descripcion_proyecto: ['', [Validators.required]],
    url: ['', [Validators.required]],
    url_versionamiento: ['', [Validators.required, forbiddenNameValidator(/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/[^\s]*)?$/)]],
    id_lenguaje: ['', [Validators.required]],
    tipoApp: [false, [Validators.required]]
  });

  listOfColumns: ColumnItemFrontend[] = [
    {
      name: '',
      sortOrder: null,
      sortFn: null,
      showSort: false
    },
    {
      name: 'Proyecto',
      sortOrder: null,
      sortFn: (a: DataFrontend, b: DataFrontend) => a.nombre_proyecto.localeCompare(b.nombre_proyecto),
      showSort: true
    },
    {
      name: 'Descripcion',
      sortOrder: null,
      sortFn: (a: DataFrontend, b: DataFrontend) => a.descripcion_proyecto.localeCompare(b.descripcion_proyecto),
      showSort: true
    },
    {
      name: "Url's",
      sortOrder: null,
      sortFn: null,
      showSort: false
    },
    {
      name: 'Tipo App',
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
  listOfData: DataFrontend[] = [];
  listOfDataCopy: DataFrontend[] = [];

  constructor(
    private drawerService: NzDrawerService,
    private fb: NonNullableFormBuilder,
    private serviceFrontend: FrontendService,
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
    this.serviceFrontend.getAllFrontends()
      .subscribe((data: any) => {
        this.isLoading = false
        if (data.ok != undefined && data.ok == false) {
          this.message.error('¡Ups! Hubo un error al obtener los frontend', { nzDuration: 2500 })
          return
        }
        const dataConverted = data.data.map(({ documentos, servidores, responsables, backends, ...rest }: any) => {
          return {
            ...rest,
            documentos: JSON.parse(documentos),
            servidores: JSON.parse(servidores),
            responsables: JSON.parse(responsables),
            backends: JSON.parse(backends)
          }
        })
        this.listOfData = dataConverted
        this.listOfDataCopy = dataConverted
      })
  }


  openTemplate(): void {
    this.drawerRef = this.drawerService.create({
      nzTitle: 'Crear Frontend',
      nzContent: this.drawerTemplate,
      nzFooter: this.drawerFooter,
      nzContentParams: { edit: false },
      nzSize: this.sizeWindow
    });
    this.drawerRef.nzOnClose.subscribe(() => this.close());
  }

  openEditTemplate(data: DataFrontend): void {
    this.edit = true
    this.onSearchLenguage('');
    this.dataForm = data
    this.drawerRef = this.drawerService.create({
      nzTitle: 'Editar Frontend',
      nzContent: this.drawerTemplate,
      nzFooter: this.drawerFooter,
      nzContentParams: { edit: true },
      nzSize: this.sizeWindow
    });
    this.drawerRef.nzOnClose.subscribe(() => this.close());
  }

  changeState(dataChange: DataFrontend): void {
    dataChange.loading = true
    this.serviceFrontend.changeState(dataChange.id).subscribe((data: any) => {
      dataChange.loading = false
      if (data.ok != undefined && data.ok == false) {
        this.message.error('<b>!Ups!</b> Hubo un error al eliminar el frontend', { nzDuration: 2500 })
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
    const dataToSave: DataFrontend = {
      ...this.dataForm,
      ...this.validateForm.value
    }
    if (this.edit) {
      this.isSaving = true
      this.serviceFrontend.editFrontend(dataToSave, this.dataForm.id)
        .subscribe((data: any) => {
          this.isSaving = false
          if (data.ok != undefined && data.ok == false) {
            this.message.error('<b>!Ups!</b> Hubo un error al editar el frontend', { nzDuration: 2500 })
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
          this.dataForm = this.globalService.createDefaultObject<DataFrontend>({
            id: '',
            activo: false,
            backends: [],
            creacion: '',
            descripcion_proyecto: '',
            documentos: [],
            id_lenguaje: '',
            loading: false,
            modificacion: '',
            nombre_proyecto: '',
            responsables: [],
            servidores: [],
            url: '',
            url_versionamiento: '',
            tipoApp: false
          })
        })
    } else {
      this.isSaving = true
      this.serviceFrontend.saveFrontend(dataToSave, this.dataForm.id)
        .subscribe((data: any) => {
          this.isSaving = false
          if (data.ok != undefined && data.ok == false) {
            this.message.error('<b>!Ups!</b> Hubo un error al guardar el frontend', { nzDuration: 2500 })
            return
          }
          if (data.resp != undefined && !data.resp) {
            this.message.error(`<b>¡Ups!</b> ${data.message}`, { nzDuration: 2500 })
            return
          }
          this.message.success('<b>¡Execelente!</b> Se guardo el frontend con exito', { nzDuration: 2500 })
          this.getData()
          this.drawerRef.close()
        })
    }
  }


  onSearchLenguage(value: string): void {
    if (!value) {
      this.isLoadingLenguage = true;
      this.serviceLenguage.getAllLanguage().subscribe((data: any) => {
        this.isLoadingLenguage = false;
        if (data.ok != undefined && data.ok == false) {
          this.message.error('<b>!Ups!</b> Hubo un error al obtener los lenguajes', { nzDuration: 2500 })
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
    this.dataForm = this.globalService.createDefaultObject<DataFrontend>({
      id: '',
      activo: false,
      backends: [],
      creacion: '',
      descripcion_proyecto: '',
      documentos: [],
      id_lenguaje: '',
      loading: false,
      modificacion: '',
      nombre_proyecto: '',
      responsables: [],
      servidores: [],
      url: '',
      url_versionamiento: '',
      tipoApp: false
    })
    this.isAddNewServe = false
    this.getData()
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.listOfData = this.listOfDataCopy.filter(({ descripcion_proyecto, url, url_versionamiento, nombre_proyecto }: DataFrontend) => {
      return nombre_proyecto.toLocaleUpperCase().includes(this.searchValue.toLocaleUpperCase()) ||
        descripcion_proyecto.toLocaleUpperCase().includes(this.searchValue.toLocaleUpperCase()) ||
        url.toLocaleUpperCase().includes(this.searchValue.toLocaleUpperCase()) ||
        url_versionamiento.toLocaleUpperCase().includes(this.searchValue.toLocaleUpperCase())
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

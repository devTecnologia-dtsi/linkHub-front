import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer';
// interfaces
import {
  DrawerFooter,
  drawerTemplate,
} from '../../../interface/global.interface';
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
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
// services
import {
  ColumnItemOs,
  DatatableOs,
  FormOs,
} from '../../../interface/os.interface';
import { OsService } from '../../../service/os/os.service';
import { GlobalService } from '../../../service/global/global.service';
// Directives
import { LimitCharsDirective } from '../../../directive/limit-chars/limit-chars.directive';

@Component({
  selector: 'app-os',
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
    ReactiveFormsModule,
    LimitCharsDirective,
    NzCheckboxModule,
  ],
  templateUrl: './os.component.html',
  styleUrl: './os.component.css',
})
export class OsComponent {
  @ViewChild('drawerOs', { static: false })
  drawerTemplate?: TemplateRef<drawerTemplate>;
  @ViewChild('footerOs', { static: false })
  drawerFooter?: TemplateRef<DrawerFooter>;
  isLoading: boolean = true;
  isSaving: boolean = false;
  searchValue: string = '';
  drawerRef: any;
  dataForm: DatatableOs = {
    nombre: '',
    id: '',
    version: '',
    activo: false,
    loading: false,
  };
  edit: boolean = false; // variable usada para saber cuando se esta actualizando el registro

  validateForm: FormGroup<FormOs> = this.fb.group({
    nombre: ['', [Validators.required]],
    version: ['', [Validators.required]],
  });

  listOfColumns: ColumnItemOs[] = [
    {
      name: 'id',
      sortOrder: null,
      sortFn: (a: DatatableOs, b: DatatableOs) =>
        JSON.stringify(a.id).localeCompare(JSON.stringify(b.id)),
      showSort: true,
    },
    {
      name: 'Sistema Operativo',
      sortOrder: null,
      sortFn: (a: DatatableOs, b: DatatableOs) =>
        a.nombre.localeCompare(b.nombre),
      showSort: true,
    },
    {
      name: 'Version',
      sortOrder: null,
      sortFn: (a: DatatableOs, b: DatatableOs) =>
        a.version.localeCompare(b.version),
      showSort: true,
    },
    {
      name: 'Acciones',
      sortFn: null,
      sortOrder: null,
      showSort: false,
    },
  ];
  listOfData: DatatableOs[] = [];
  listOfDataCopy: DatatableOs[] = [];

  constructor(
    private drawerService: NzDrawerService,
    private fb: NonNullableFormBuilder,
    private serviceOs: OsService,
    private message: NzMessageService,
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.isLoading = true;
    this.serviceOs.getAllOs().subscribe((data: any) => {
      this.isLoading = false;
      if (data.ok != undefined && data.ok == false) {
        this.message.error(
          '¡Ups! Hubo un error al obtener los sistemas operativos',
          { nzDuration: 3000 }
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
      nzTitle: 'Crear Sistema Operativo',
      nzContent: this.drawerTemplate,
      nzFooter: this.drawerFooter,
      nzContentParams: { edit: false },
    });
  }

  openEditTemplate(data: DatatableOs): void {
    this.edit = true;
    this.dataForm = data;
    this.drawerRef = this.drawerService.create({
      nzTitle: 'Editar Sistema Operativo',
      nzContent: this.drawerTemplate,
      nzFooter: this.drawerFooter,
      nzContentParams: { edit: true },
    });
    this.drawerRef.nzOnClose.subscribe(() => {
      this.dataForm = {
        nombre: '',
        id: '',
        version: '',
        activo: false,
        loading: false,
      };
    });
  }

  changeState(dataChange: DatatableOs): void {
    dataChange.loading = true;
    this.serviceOs.changeState(dataChange.id).subscribe((data: any) => {
      dataChange.loading = false;
      if (data.ok != undefined && data.ok == false) {
        this.message.error(
          '<b>¡Ups!</b> Hubo un error al actualizar el sistema operativo',
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
      this.message.success(
        '<b>¡Excelente!</b> Se actualizó con éxito el sistema operativo',
        { nzDuration: 2500 }
      );
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
    const { nombre, version } = this.validateForm.value;

    if (this.edit) {
      this.isSaving = true;
      this.dataForm = {
        ...this.dataForm,
        nombre: nombre ? nombre : '',
        version: version ? version : '',
      };
      this.serviceOs.editOs(this.dataForm).subscribe((data: any) => {
        this.isSaving = false;
        if (data.ok != undefined && data.ok == false) {
          this.message.error(
            '<b>¡Ups!</b> Hubo un error al editar el sistema operativo',
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
          '<b>¡Excelente!</b> Se actulizo el sistema operativo con exito',
          { nzDuration: 2500 }
        );
        this.drawerRef.close();
        this.edit = false;
        this.listOfData = this.listOfData.map((data) => {
          return data.id == this.dataForm.id
            ? {
                ...data,
                nombre: this.dataForm.nombre,
                version: this.dataForm.version,
              }
            : data;
        });
        this.dataForm = {
          nombre: '',
          id: '',
          version: '',
          activo: false,
          loading: false,
        };
      });
    } else {
      this.isSaving = true;
      this.serviceOs.saveOs(nombre, version).subscribe((data: any) => {
        this.isSaving = false;
        if (data.ok != undefined && data.ok == false) {
          this.message.error(
            '<b>¡Ups!</b> Hubo un error al guardar el sistema operativo',
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
          '<b>¡Excelente!</b> Se guardo el sistema operativo con éxito',
          { nzDuration: 2500 }
        );
        this.getData();
        this.drawerRef.close();
      });
    }
  }

  close(): void {
    this.drawerRef.close();
    this.dataForm = this.globalService.createDefaultObject<DatatableOs>(
      this.dataForm
    );
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.listOfData = this.listOfDataCopy.filter(
      ({ nombre, version }: DatatableOs) => {
        return (
          nombre
            .toLocaleUpperCase()
            .includes(this.searchValue.toLocaleUpperCase()) ||
          version
            .toLocaleUpperCase()
            .includes(this.searchValue.toLocaleUpperCase())
        );
      }
    );
  }
}

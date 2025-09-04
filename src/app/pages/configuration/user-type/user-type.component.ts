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
import {
  FormUserType,
  DataTableUserType,
  ColumnItemTypeUser,
} from '../../../interface/user-type.interface';
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
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
// services
import { UserTypeService } from '../../../service/user-type/user-type.service';
import { GlobalService } from '../../../service/global/global.service';
// Derectives
import { LimitCharsDirective } from '../../../directive/limit-chars/limit-chars.directive';

@Component({
  selector: 'app-user-type',
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
    NzCheckboxModule,
    ReactiveFormsModule,
    LimitCharsDirective,
  ],
  templateUrl: './user-type.component.html',
  styleUrl: './user-type.component.css',
})
export class UserTypeComponent {
  @ViewChild('drawerUserType', { static: false })
  drawerTemplate?: TemplateRef<drawerTemplate>;
  @ViewChild('footerUserType', { static: false })
  drawerFooter?: TemplateRef<DrawerFooter>;
  isLoading: boolean = true;
  isSaving: boolean = false;
  searchValue: string = '';

  drawerRef: any;
  dataForm: DataTableUserType = {
    activo: false,
    descripcion: '',
    id: '',
    loading: false,
  };
  edit: boolean = false; // variable usada para saber cuando se esta actualizando el registro

  validateForm: FormGroup<FormUserType> = this.fb.group({
    descripcion: ['', [Validators.required]],
  });

  listOfColumns: ColumnItemTypeUser[] = [
    {
      name: 'id',
      sortOrder: null,
      sortFn: (a: DataTableUserType, b: DataTableUserType) =>
        JSON.stringify(a.id).localeCompare(JSON.stringify(b.id)),
      showSort: true,
    },
    {
      name: 'Descripción',
      sortOrder: null,
      sortFn: (a: DataTableUserType, b: DataTableUserType) =>
        JSON.stringify(a.id).localeCompare(JSON.stringify(b.id)),
      showSort: true,
    },
    {
      name: 'Acciones',
      sortFn: null,
      sortOrder: null,
      showSort: false,
    },
  ];
  listOfData: DataTableUserType[] = [];
  listOfDataCopy: DataTableUserType[] = [];

  constructor(
    private drawerService: NzDrawerService,
    private fb: NonNullableFormBuilder,
    private userTypeService: UserTypeService,
    private message: NzMessageService,
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.isLoading = true;
    this.userTypeService.getAllUsertype().subscribe((data: any) => {
      this.isLoading = false;
      if (data.ok != undefined && data.ok == false) {
        this.message.error(
          '¡Ups! Hubo un error al obtener los tipos de usuario',
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
      nzTitle: 'Crear Tipo de Usuario',
      nzContent: this.drawerTemplate,
      nzFooter: this.drawerFooter,
      nzContentParams: { edit: false },
    });
  }

  openEditTemplate(data: DataTableUserType): void {
    this.edit = true;
    this.dataForm = data;
    this.drawerRef = this.drawerService.create({
      nzTitle: 'Editar Tipo de Usuario',
      nzContent: this.drawerTemplate,
      nzFooter: this.drawerFooter,
      nzContentParams: { edit: true },
    });
    this.drawerRef.nzOnClose.subscribe(() => {
      this.dataForm = {
        activo: false,
        descripcion: '',
        id: '',
        loading: false,
      };
    });
  }

  changeState(dataChange: DataTableUserType): void {
    dataChange.loading = true;
    this.userTypeService.changeState(dataChange.id).subscribe((data: any) => {
      dataChange.loading = false;
      if (data.ok != undefined && data.ok == false) {
        this.message.error(
          '<b>¡Ups!</b> Hubo un error al eliminar el tipo de usuario',
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
      this.message.success(`<b>¡Excelente!</b> ${data.message}`, {
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
    const { descripcion } = this.validateForm.value;
    this.dataForm = {
      ...this.dataForm,
      descripcion: descripcion ? descripcion : '',
    };
    if (this.edit) {
      this.isSaving = true;
      this.userTypeService
        .editUserType(this.dataForm)
        .subscribe((data: any) => {
          this.isSaving = false;
          if (data.ok != undefined && data.ok == false) {
            this.message.error(
              '<b>¡Ups!</b> Hubo un error al editar el tipo de usuario',
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
            '<b>¡Excelente!</b> Se actualizo el tipo de usuario con éxito',
            { nzDuration: 2500 }
          );
          this.drawerRef.close();
          this.edit = false;
          this.getData();
          this.dataForm = {
            activo: false,
            descripcion: '',
            id: '',
            loading: false,
          };
        });
    } else {
      this.isSaving = true;
      this.userTypeService
        .saveUserType(this.dataForm)
        .subscribe((data: any) => {
          this.isSaving = false;
          if (data.ok != undefined && data.ok == false) {
            this.message.error(
              '<b>¡Ups!</b> Hubo un error al guardar el tipo de usuario',
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
            '<b>¡Excelente!</b> Se guardo el tipo de usuario con éxito',
            { nzDuration: 2500 }
          );
          this.getData();
          this.dataForm = {
            activo: false,
            descripcion: '',
            id: '',
            loading: false,
          };
          this.drawerRef.close();
        });
    }
  }

  close(): void {
    this.drawerRef.close();
    this.dataForm = this.globalService.createDefaultObject<DataTableUserType>(
      this.dataForm
    );
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.listOfData = this.listOfDataCopy.filter(
      ({ descripcion }: DataTableUserType) => {
        return descripcion
          .toLocaleUpperCase()
          .includes(this.searchValue.toLocaleUpperCase());
      }
    );
  }
}

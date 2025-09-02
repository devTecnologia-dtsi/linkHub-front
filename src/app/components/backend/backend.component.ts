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
import { BackendsFrontend, BackendsFrontendForm } from '../../interface/frontend.interface';
import { TableScrollX } from '../../interface/global.interface';

// services
import { DataTableBackend } from '../../interface/backend.interface';
import { BackendService } from '../../service/backend/backend.service';

@Component({
  selector: 'app-backend',
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
  templateUrl: './backend.component.html',
  styleUrl: './backend.component.css'
})
export class BackendComponent {

  @Input({ required: true }) backends: Array<BackendsFrontend>;
  @Output() backendsChange = new EventEmitter<Array<BackendsFrontend>>();
  isAddNewBackend: boolean;
  editCacheTableBackends: { [key: string]: { edit: boolean; data: BackendsFrontend } };
  isLoadingBackend: boolean;
  optionListBackends: Array<DataTableBackend>;
  optionListCopyBackends: Array<DataTableBackend>;

  widthBackend: string;
  widthDescription: string;
  widthAction: string;
  scrollTableX: TableScrollX;


  constructor(
    private fb: NonNullableFormBuilder,
    private serviceBackend: BackendService,
    private message: NzMessageService
  ) {
    this.isAddNewBackend = false;
    this.backends = [];
    this.editCacheTableBackends = {};
    this.isLoadingBackend = true;
    this.optionListCopyBackends = [];
    this.optionListBackends = [];
    this.widthBackend = '';
    this.widthDescription = '';
    this.widthAction = '';
    this.scrollTableX = { x: '' };
    this.adjustColumnWidths();
    this.onSearchBackend('');
  }

  ngOnInit() {
    this.resetIndexCache()
  }

  // Listener que detecta cambios en el tamaño de la pantalla
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.adjustColumnWidths();
  }

  adjustColumnWidths() {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 768) {
      this.widthBackend = '40px';
      this.widthDescription = '35px';
      this.widthAction = '14px';
      this.scrollTableX = { x: '' };
    } else {
      this.widthBackend = '180px';
      this.widthDescription = '180px';
      this.widthAction = '85px';
      this.scrollTableX = { x: '100hv' };
    }
  }

  validateFormBackend: FormGroup<BackendsFrontendForm> = this.fb.group({
    descripcion: ['', [Validators.required]],
    id: ['', [Validators.required]]
  });

  submitFormBackend(): void {
    if (!this.validateFormBackend.valid) {
      Object.values(this.validateFormBackend.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty()
          control.updateValueAndValidity({ onlySelf: true })
        }
      });
      return
    }
    const { id, descripcion } = this.validateFormBackend.value;
    this.backends = [...this.backends, {
      id_backend: id ?? "",
      descripcion: descripcion ?? "",
      nombre_backend: this.getNameByIdBackend(JSON.stringify(id))
    }]
    this.editCacheTableBackends = {
      ...this.editCacheTableBackends,
      [this.backends.length - 1]: {
        data: {
          id_backend: id ?? "",
          descripcion: descripcion ?? ""
        },
        edit: false
      }
    }
    this.validateFormBackend.reset();
    this.backendsChange.emit(this.backends);
  }

  addBackend(): void {
    this.isAddNewBackend = true
  }

  resetIndexCache(): void {
    this.backends.forEach((data, index) => {
      this.editCacheTableBackends = {
        ...this.editCacheTableBackends,
        [JSON.stringify(index)]: {
          edit: false,
          data
        }
      }
    })
  }

  deleteBackend(tableIndex: number): void {
    delete this.editCacheTableBackends[tableIndex]
    this.backends = this.backends.filter((bakcend, index) => index != tableIndex)
    this.resetIndexCache()
    this.backendsChange.emit(this.backends)
  }

  startEditBackend(tableIndex: number): void {
    console.log(this.editCacheTableBackends[tableIndex])
    this.editCacheTableBackends[tableIndex].edit = true;
  }

  saveEditBackend(index: number): void {
    Object.assign(this.backends[index], this.editCacheTableBackends[index].data);
    this.editCacheTableBackends[index].edit = false;
    this.backendsChange.emit(this.backends);
  }

  cancelEditBackend(index: number): void {
    this.editCacheTableBackends[index] = {
      data: { ...this.backends[index] },
      edit: false
    };
    this.backendsChange.emit(this.backends);
  }

  getNameByIdBackend(idBackend: string): string {
    const filteredBackend = this.optionListBackends.filter(({ id }) => id == idBackend);
    return filteredBackend[0].nombre_backend;
  }


  showRefBackend(): void {
    this.isAddNewBackend = true
  }

  onSearchBackend(value: string): void {
    if (!value) {
      this.isLoadingBackend = true
      this.serviceBackend.getBackendsActives().subscribe((data: any) => {
        this.isLoadingBackend = false
        if (data.ok != undefined && data.ok == false) {
          this.message.error('<b>¡Ups!</b> Hubo un error al obtener los backends', { nzDuration: 2500 })
          return
        }
        if (data.resp != undefined && !data.resp) {
          this.message.error(`<b>¡Ups!</b> ${data.message}`, { nzDuration: 2500 })
          return
        }
        this.optionListBackends = data.data;
        this.optionListCopyBackends = data.data;
      })
    } else {
      this.optionListBackends = this.optionListCopyBackends.filter(({ nombre_backend }) => nombre_backend.toLocaleUpperCase().includes(value.toLocaleUpperCase()))
    }
  }

}

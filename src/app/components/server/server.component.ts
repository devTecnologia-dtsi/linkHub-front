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
import { ServidoresFrontend, ServidoresFrontendForm } from '../../interface/frontend.interface';
import { DatatableServer } from '../../interface/server.interface';

// services
import { ServerService } from '../../service/server/server.service';
import { TableScrollX } from '../../interface/global.interface';

// Directives
import { LimitCharsDirective } from '../../directive/limit-chars/limit-chars.directive';


@Component({
  selector: 'app-server',
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
    NzPopconfirmModule,
    LimitCharsDirective
  ],
  templateUrl: './server.component.html',
  styleUrl: './server.component.css'
})
export class ServerComponent {

  @Input({ required: true }) servidores: Array<ServidoresFrontend>;
  @Output() servidoresChange = new EventEmitter<Array<ServidoresFrontend>>();
  isAddNewServe: boolean;
  editCacheTableServers: { [key: string]: { edit: boolean; data: ServidoresFrontend } };
  isLoadingServers: boolean;
  optionListServers: Array<DatatableServer>;
  optionListCopyServers: Array<DatatableServer>;

  widthServer: string;
  widthServerUrl: string;
  widthAction: string;
  scrollTableX: TableScrollX;

  constructor(
    private fb: NonNullableFormBuilder,
    private serviceServer: ServerService,
    private message: NzMessageService
  ) {
    this.isAddNewServe = false;
    this.servidores = [];
    this.editCacheTableServers = {};
    this.isLoadingServers = true;
    this.optionListCopyServers = [];
    this.optionListServers = [];
    this.widthServer = '';
    this.widthServerUrl = '';
    this.widthAction = '';
    this.scrollTableX = { x: '' };
    this.adjustColumnWidths();
    this.onSearchServer('');
  }

  ngOnInit() {
    this.resetIndexCache()
  }

  validateFormServe: FormGroup<ServidoresFrontendForm> = this.fb.group({
    id_servidor: ['', [Validators.required]],
    url_servidor: ['', [Validators.required]]
  });

  // Listener que detecta cambios en el tamaño de la pantalla
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.adjustColumnWidths();
  }

  adjustColumnWidths() {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 768) {
      this.widthServer = '40px';
      this.widthServerUrl = '35px';
      this.widthAction = '14px';
      this.scrollTableX = { x: '' };
    } else {
      this.widthServer = '180px';
      this.widthServerUrl = '180px';
      this.widthAction = '85px';
      this.scrollTableX = { x: '100hv' };
    }
  }

  submitFormServe(): void {
    if (!this.validateFormServe.valid) {
      Object.values(this.validateFormServe.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty()
          control.updateValueAndValidity({ onlySelf: true })
        }
      });
      return
    }
    const { id_servidor, url_servidor } = this.validateFormServe.value;
    this.servidores = [...this.servidores, {
      id_servidor: id_servidor ?? "",
      url_servidor: url_servidor ?? "",
      nombre_servidor: this.getNameByIdServer(JSON.stringify(id_servidor))
    }]
    this.editCacheTableServers = {
      ...this.editCacheTableServers,
      [this.servidores.length - 1]: {
        data: {
          id_servidor: id_servidor ?? "",
          url_servidor: url_servidor ?? ""
        },
        edit: false
      }
    }
    this.validateFormServe.reset();
    this.servidoresChange.emit(this.servidores);
  }

  addServer(): void {
    this.isAddNewServe = true
  }

  deleteServe(tableIndex: number): void {
    delete this.editCacheTableServers[tableIndex]
    this.servidores = this.servidores.filter((server, index) => index != tableIndex)
    this.resetIndexCache()
    this.servidoresChange.emit(this.servidores)
  }

  resetIndexCache(): void {
    this.servidores.forEach((data, index) => {
      this.editCacheTableServers = {
        ...this.editCacheTableServers,
        [JSON.stringify(index)]: {
          edit: false,
          data
        }
      }
    })
  }

  startEditServe(index: number): void {
    this.editCacheTableServers[index].edit = true;
  }

  saveEditServe(index: number): void {
    Object.assign(this.servidores[index], this.editCacheTableServers[index].data);
    this.editCacheTableServers[index].edit = false;
    this.servidoresChange.emit(this.servidores);
  }

  cancelEditServe(index: number): void {
    this.editCacheTableServers[index] = {
      data: { ...this.servidores[index] },
      edit: false
    };
    this.servidoresChange.emit(this.servidores);
  }

  getNameByIdServer(idServer: string): string {
    const filteredServe = this.optionListServers.filter(({ id }) => id == idServer);
    return filteredServe[0].nombre_servidor;
  }


  showRefServe(): void {
    this.isAddNewServe = true
  }

  onSearchServer(value: string): void {
    if (!value) {
      this.isLoadingServers = true
      this.serviceServer.getAllServersActivos().subscribe((data: any) => {
        this.isLoadingServers = false
        if (data.ok != undefined && data.ok == false) {
          this.message.error('<b>¡Ups!</b> Hubo un error al obtener los servidores', { nzDuration: 2500 })
          return
        }
        if (data.resp != undefined && !data.resp) {
          this.message.error(`<b>¡Ups!</b> ${data.message}`, { nzDuration: 2500 })
          return
        }
        this.optionListServers = data.data;
        this.optionListCopyServers = data.data;
      })
    } else {
      this.optionListServers = this.optionListCopyServers.filter(({ nombre_servidor }) => nombre_servidor.toLocaleUpperCase().includes(value.toLocaleUpperCase()))
    }
  }

}

import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer';
// interfaces
import { DrawerFooter, drawerTemplate } from '../../../interface/global.interface';
import { ColumnItemServer, DatatableServer, FormServer } from '../../../interface/server.interface';
import { DatatableEnviroment } from '../../../interface/enviroment.interface';
import { DatatableOs } from '../../../interface/os.interface';
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
import { ServerService } from '../../../service/server/server.service';
import { EnviromentService } from '../../../service/enviroment/enviroment.service';
import { OsService } from '../../../service/os/os.service';

@Component({
  selector: 'app-server',
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
  templateUrl: './server.component.html',
  styleUrl: './server.component.css'
})
export class ServerComponent {
  @ViewChild('drawerServer', { static: false }) drawerTemplate?: TemplateRef<drawerTemplate>
  @ViewChild('footerServer', { static: false }) drawerFooter?: TemplateRef<DrawerFooter>
  isLoading: boolean = false
  isSaving: boolean = false
  stateDocker: boolean = false

  // select enviromenbt
  isLoadingEnviroments: boolean = false
  selectedEnviroment: number = 0
  optionListEnviroments: Array<DatatableEnviroment> = []
  allEnviroments: any[] = [];

  // select Os
  isLoadingOs: boolean = false
  selectedOs: number = 0
  optionListOs: Array<DatatableOs> = []
  allOs: any[] = [];

  searchValue: string = ''
  listOfDataCopy: DatatableServer[] = [];

  drawerRef: any
  dataForm: DatatableServer = {
    id_ambiente: '',
    id: '',
    id_sistema_operativo: '',
    ip: '',
    activo: false,
    creacion: '',
    descripcion_ambiente: '',
    modificacion: '',
    nombre_servidor: '',
    nombre_sistema_operativo: '',
    docker: false,
    loading: false
  }
  edit: boolean = false // variable usada para saber cuando se esta actualizando el registro

  validateForm: FormGroup<FormServer> = this.fb.group({
    nombre_servidor: ['', [Validators.required]],
    ambiente: ['', [Validators.required]],
    docker: [false, [Validators.required]],
    sistema_operativo: ['', [Validators.required]],
    ip: ['', [Validators.required]]
  });

  listOfColumns: ColumnItemServer[] = [
    {
      name: 'id',
      sortOrder: null,
      sortFn: (a: DatatableServer, b: DatatableServer) => a.id.localeCompare(b.id),
      showSort: true
    },
    {
      name: 'Nombre Servidor',
      sortOrder: null,
      sortFn: (a: DatatableServer, b: DatatableServer) => a.nombre_servidor.localeCompare(b.nombre_servidor),
      showSort: true
    },
    {
      name: 'IP',
      sortOrder: null,
      sortFn: (a: DatatableServer, b: DatatableServer) => a.ip.localeCompare(b.ip),
      showSort: true
    },
    {
      name: 'Sistema Operativo',
      sortOrder: null,
      sortFn: (a: DatatableServer, b: DatatableServer) => a.nombre_sistema_operativo.localeCompare(b.nombre_sistema_operativo),
      showSort: true
    },
    {
      name: 'Ambiente',
      sortOrder: null,
      sortFn: (a: DatatableServer, b: DatatableServer) => a.descripcion_ambiente.localeCompare(b.descripcion_ambiente),
      showSort: true
    },
    {
      name: 'Docker',
      sortOrder: null,
      sortFn: null,
      showSort: false
    },
    {
      name: 'Acciones',
      sortOrder: null,
      sortFn: null,
      showSort: false
    }
  ];
  listOfData: DatatableServer[] = [];

  constructor(
    private drawerService: NzDrawerService,
    private fb: NonNullableFormBuilder,
    private serviceServer: ServerService,
    private serviceEnviroment: EnviromentService,
    private serviceOs: OsService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.getData()
  }

  getData(): void {
    this.isLoading = true
    this.serviceServer.getAllServers()
      .subscribe((data: any) => {
        this.isLoading = false
        if (data.ok != undefined && data.ok == false) {
          this.message.error('!Ups! Hubo un error al obtener los servidores', { nzDuration: 2500 })
          return
        }
        this.listOfData = data.data;
        this.listOfDataCopy = data.data
      })
  }

  openTemplate(): void {
    this.drawerRef = this.drawerService.create({
      nzTitle: 'Crear Servidor',
      nzContent: this.drawerTemplate,
      nzFooter: this.drawerFooter,
      nzContentParams: { edit: false }
    });
  }

  openEditTemplate(data: DatatableServer): void {
    this.edit = true
    this.dataForm = data
    this.selectedEnviroment = Number(data.id_ambiente)
    this.selectedOs = Number(data.id_sistema_operativo)
    this.stateDocker = data.docker
    this.onSearchEnviroment('')
    this.onSearchOs('')
    this.drawerRef = this.drawerService.create({
      nzTitle: 'Editar Servidor',
      nzContent: this.drawerTemplate,
      nzFooter: this.drawerFooter,
      nzContentParams: { edit: true }
    });
    this.drawerRef.nzOnClose.subscribe(() => {
      this.dataForm = {
        id: '',
        id_ambiente: '',
        id_sistema_operativo: '',
        ip: '',
        activo: false,
        creacion: '',
        descripcion_ambiente: '',
        modificacion: '',
        nombre_servidor: '',
        nombre_sistema_operativo: '',
        docker: false,
        loading: false
      }
      this.selectedEnviroment = 0
      this.selectedOs = 0
      this.stateDocker = false
    });
  }

  changeState(dataChange: DatatableServer): void {
    dataChange.loading = true
    this.serviceServer.changeState(dataChange.id).subscribe((data: any) => {
      dataChange.loading = false
      if (data.ok != undefined && data.ok == false) {
        this.message.error('<b>!Ups!</b> Hubo un error al eliminar el servidor', { nzDuration: 2500 })
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
    const { docker, nombre_servidor, ambiente, ip, sistema_operativo } = this.validateForm.value
    this.dataForm = {
      ...this.dataForm,
      nombre_servidor: nombre_servidor ? nombre_servidor : '',
      id_ambiente: ambiente ? ambiente : '',
      id_sistema_operativo: sistema_operativo ? sistema_operativo : '',
      ip: ip ? ip : '',
      docker: docker ? docker : false
    }
    if (this.edit) {
      this.isSaving = true
      this.serviceServer.editServer(this.dataForm)
        .subscribe((data: any) => {
          this.isSaving = false
          if (data.ok != undefined && data.ok == false) {
            this.message.error('<b>!Ups!</b> Hubo un error al editar el servidor', { nzDuration: 2500 })
            return
          }
          if (data.resp != undefined && !data.resp) {
            this.message.error(`<b>¡Ups!</b> ${data.message}`, { nzDuration: 2500 })
            return
          }
          this.message.success('<b>!Execelente!</b> Se actulizo el servidor con exito', { nzDuration: 2500 })
          this.drawerRef.close()
          this.edit = false
          this.getData()
          this.dataForm = {
            id: '',
            id_ambiente: '',
            id_sistema_operativo: '',
            ip: '',
            activo: false,
            creacion: '',
            descripcion_ambiente: '',
            modificacion: '',
            nombre_servidor: '',
            nombre_sistema_operativo: '',
            docker: false,
            loading: false
          }
        })
    } else {
      this.isSaving = true
      this.serviceServer.saveServer(this.dataForm)
        .subscribe((data: any) => {
          this.isSaving = false
          if (data.ok != undefined && data.ok == false) {
            this.message.error('<b>!Ups!</b> Hubo un error al guardar el motor', { nzDuration: 2500 })
            return
          }
          if (data.resp != undefined && !data.resp) {
            this.message.error(`<b>¡Ups!</b> ${data.message}`, { nzDuration: 2500 })
            return
          }
          this.message.success('<b>¡Execelente!</b> Se guardo el motor con exito', { nzDuration: 2500 })
          this.getData()
          this.drawerRef.close()
        })
    }
  }

  onSearchEnviroment(value: string): void {
      this.isLoadingEnviroments = true;
      if (!value) {
          this.serviceEnviroment.getAllEnviromentsActivos().subscribe((data: any) => {
              this.isLoadingEnviroments = false; // Oculta el indicador de carga
              if (data.resp !== undefined && !data.resp) {
                  this.message.error(`<b>¡Ups!</b> ${data.message}`, { nzDuration: 2500 });
                  return;
              }
              this.allEnviroments = data.data;
              this.optionListEnviroments = this.allEnviroments;
          });
      } else {
          this.optionListEnviroments = this.allEnviroments.filter(({ descripcion }) =>
              descripcion.toLocaleUpperCase().includes(value.toLocaleUpperCase())
          );
          this.isLoadingEnviroments = false;
      }
  }

  onSearchOs(value: string): void {
    this.isLoadingOs = true;
    if (!value) {
      this.serviceOs.getAllOsActivos().subscribe((data: any) => {
        this.isLoadingOs = false; // Oculta el indicador de carga
            if (data.resp !== undefined && !data.resp) {
                this.message.error(`<b>¡Ups!</b> ${data.message}`, { nzDuration: 2500 });
                return;
            }
            this.allOs = data.data;
            this.optionListOs = this.allOs;
        });
    } else {
        this.optionListOs = this.allOs.filter(({ nombre }) =>
          nombre.toLocaleUpperCase().includes(value.toLocaleUpperCase())
        );
        this.isLoadingOs = false;
    }
}

close(): void {
    this.drawerRef.close()
    this.dataForm = {
      id: '',
      id_ambiente: '',
      id_sistema_operativo: '',
      ip: '',
      activo: false,
      creacion: '',
      descripcion_ambiente: '',
      modificacion: '',
      nombre_servidor: '',
      nombre_sistema_operativo: '',
      docker: false,
      loading: false
    }
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.listOfData = this.listOfDataCopy.filter(({ descripcion_ambiente, nombre_servidor, nombre_sistema_operativo, ip }: DatatableServer) => {
      return descripcion_ambiente.toLocaleUpperCase().includes(this.searchValue.toLocaleUpperCase()) ||
        nombre_servidor.toLocaleUpperCase().includes(this.searchValue.toLocaleUpperCase()) ||
        nombre_sistema_operativo.toLocaleUpperCase().includes(this.searchValue.toLocaleUpperCase()) ||
        ip.toLocaleUpperCase().includes(this.searchValue.toLocaleUpperCase())
    });
  }
}

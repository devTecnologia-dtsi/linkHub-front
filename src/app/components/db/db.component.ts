import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import {
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { TableScrollX } from '../../interface/global.interface';

// services
import { DbBackend } from '../../interface/backend.interface';
import { DbService } from '../../service/db/db.service';
import { DBBackendForm } from '../../interface/db.interface';

@Component({
  selector: 'app-db',
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
  ],
  templateUrl: './db.component.html',
  styleUrl: './db.component.css',
})
export class DbComponent {
  @Input({ required: true }) db: Array<DbBackend>;
  @Output() dbChange = new EventEmitter<Array<DbBackend>>();
  isAddNewBd: boolean;
  editCacheTableDb: {
    [key: string]: { edit: boolean; data: DbBackend };
  };
  isLoadingDb: boolean;
  optionListBd: Array<DbBackend>;
  optionListCopyBd: Array<DbBackend>;

  widthBd: string;
  widthUbicacion: string;
  widthNota: string;
  widthAccion: string;
  scrollTableX: TableScrollX;

  constructor(
    private fb: NonNullableFormBuilder,
    private serviceDb: DbService,
    private message: NzMessageService
  ) {
    this.isAddNewBd = false;
    this.db = [];
    this.editCacheTableDb = {};
    this.isLoadingDb = true;
    this.optionListCopyBd = [];
    this.optionListBd = [];
    this.widthBd = '';
    this.widthUbicacion = '';
    this.widthAccion = '';
    this.widthNota = '';
    this.scrollTableX = { x: '' };
    this.adjustColumnWidths();
    this.onSearchDb('');
  }

  validateFormDb: FormGroup<DBBackendForm> = this.fb.group({
    id_db: ['', [Validators.required]],
  });

  // Listener que detecta cambios en el tamaño de la pantalla
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.adjustColumnWidths();
  }

  adjustColumnWidths() {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 768) {
      this.widthBd = '40px';
      this.widthAccion = '20px';
      this.scrollTableX = { x: '' };
    } else {
      // Pantallas pequeñas
      this.widthBd = '180px';
      this.widthAccion = '85px';
      this.scrollTableX = { x: '100hv' };
    }
  }

  ngOnInit() {
    this.resetIndexCache();
  }

  submitFormBD(): void {
    if (!this.validateFormDb.valid) {
      Object.values(this.validateFormDb.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    const { id_db } = this.validateFormDb.value;
    this.db = [
      ...this.db,
      {
        id: id_db ?? '',
        esquema: this.getNameByIdDb(JSON.stringify(id_db)),
      },
    ];
    this.editCacheTableDb = {
      ...this.editCacheTableDb,
      [this.db.length - 1]: {
        data: {
          id: id_db ?? '',
        },
        edit: false,
      },
    };
    this.validateFormDb.reset();
    this.dbChange.emit(this.db);
  }

  addDb(): void {
    this.isAddNewBd = true;
  }

  deleteDb(tableIndex: number): void {
    delete this.editCacheTableDb[tableIndex];
    this.db = this.db.filter((document, index) => index != tableIndex);
    this.resetIndexCache();
    this.dbChange.emit(this.db);
  }

  resetIndexCache(): void {
    this.db.forEach((data, index) => {
      this.editCacheTableDb = {
        ...this.editCacheTableDb,
        [JSON.stringify(index)]: {
          edit: false,
          data,
        },
      };
    });
  }

  startEditDb(index: number): void {
    this.editCacheTableDb[index].edit = true;
  }

  saveEditDocument(index: number): void {
    Object.assign(this.db[index], this.editCacheTableDb[index].data);
    this.editCacheTableDb[index].edit = false;
    this.dbChange.emit(this.db);
  }

  cancelEditDocument(index: number): void {
    this.editCacheTableDb[index] = {
      data: { ...this.db[index] },
      edit: false,
    };
    this.dbChange.emit(this.db);
  }

  getNameByIdDb(idDb: string): string {
    const filteredServe = this.optionListBd.filter(({ id }) => id == idDb);
    return filteredServe[0].esquema;
  }

  showRefDocument(): void {
    this.isAddNewBd = true;
  }

  onSearchDb(value: string): void {
    if (!value) {
      this.isLoadingDb = true;
      this.serviceDb.getAllDBActives().subscribe((data: any) => {
        this.isLoadingDb = false;
        if (data.ok != undefined && data.ok == false) {
          this.message.error(
            '<b>¡Ups!</b> Hubo un error al obtener los documentos',
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
        this.optionListBd = data.data;
        this.optionListCopyBd = data.data;
      });
    } else {
      this.optionListBd = this.optionListCopyBd.filter(({ esquema }) =>
        esquema.toLocaleUpperCase().includes(value.toLocaleUpperCase())
      );
    }
  }
}

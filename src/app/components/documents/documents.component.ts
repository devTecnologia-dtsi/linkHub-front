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
import {
  DocumentosFrontend,
  DocumentosFrontendForm,
} from '../../interface/frontend.interface';
import { DatatableDocument } from '../../interface/document.interface';
import { TableScrollX } from '../../interface/global.interface';

// services
import { DocumentService } from '../../service/document/document.service';

// Directives
import { LimitCharsDirective } from '../../directive/limit-chars/limit-chars.directive';

@Component({
  selector: 'app-documents',
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
    LimitCharsDirective,
  ],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css',
})
export class DocumentsComponent {
  @Input({ required: true }) document: Array<DocumentosFrontend>;
  @Output() documentChange = new EventEmitter<Array<DocumentosFrontend>>();
  isAddNewDocument: boolean;
  editCacheTableDocument: {
    [key: string]: { edit: boolean; data: DocumentosFrontend };
  };
  isLoadingDocument: boolean;
  optionListDocument: Array<DatatableDocument>;
  optionListCopyDocument: Array<DatatableDocument>;

  widthDocumento: string;
  widthUbicacion: string;
  widthNota: string;
  widthAccion: string;
  scrollTableX: TableScrollX;

  constructor(
    private fb: NonNullableFormBuilder,
    private serviceDocument: DocumentService,
    private message: NzMessageService
  ) {
    this.isAddNewDocument = false;
    this.document = [];
    this.editCacheTableDocument = {};
    this.isLoadingDocument = true;
    this.optionListCopyDocument = [];
    this.optionListDocument = [];
    this.widthDocumento = '';
    this.widthUbicacion = '';
    this.widthAccion = '';
    this.widthNota = '';
    this.scrollTableX = { x: '' };
    this.adjustColumnWidths();
    this.onSearchDocument('');
  }

  validateFormDocument: FormGroup<DocumentosFrontendForm> = this.fb.group({
    id_documento: ['', [Validators.required]],
    nota: ['', [Validators.required]],
    ubicacion: ['', [Validators.required]],
  });

  // Listener que detecta cambios en el tamaño de la pantalla
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.adjustColumnWidths();
  }

  adjustColumnWidths() {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 768) {
      this.widthDocumento = '40px';
      this.widthUbicacion = '35px';
      this.widthNota = '35px';
      this.widthAccion = '20px';
      this.scrollTableX = { x: '' };
    } else {
      // Pantallas pequeñas
      this.widthDocumento = '180px';
      this.widthUbicacion = '150px';
      this.widthNota = '150px';
      this.widthAccion = '85px';
      this.scrollTableX = { x: '100hv' };
    }
  }

  ngOnInit() {
    this.resetIndexCache();
  }

  submitFormDocument(): void {
    if (!this.validateFormDocument.valid) {
      Object.values(this.validateFormDocument.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    const { id_documento, nota, ubicacion } = this.validateFormDocument.value;
    this.document = [
      ...this.document,
      {
        id_documento: id_documento ?? '',
        nota: nota ?? '',
        ubicacion: ubicacion ?? '',
        nombre_documento: this.getNameByIdDocument(
          JSON.stringify(id_documento)
        ),
      },
    ];
    this.editCacheTableDocument = {
      ...this.editCacheTableDocument,
      [this.document.length - 1]: {
        data: {
          id_documento: id_documento ?? '',
          nota: nota ?? '',
          ubicacion: ubicacion ?? '',
        },
        edit: false,
      },
    };
    this.validateFormDocument.reset();
    this.documentChange.emit(this.document);
  }

  addDocument(): void {
    this.isAddNewDocument = true;
  }

  deleteDocument(tableIndex: number): void {
    delete this.editCacheTableDocument[tableIndex];
    this.document = this.document.filter(
      (document, index) => index != tableIndex
    );
    this.resetIndexCache();
    this.documentChange.emit(this.document);
  }

  resetIndexCache(): void {
    this.document.forEach((data, index) => {
      this.editCacheTableDocument = {
        ...this.editCacheTableDocument,
        [JSON.stringify(index)]: {
          edit: false,
          data,
        },
      };
    });
  }

  startEditDocument(index: number): void {
    this.editCacheTableDocument[index].edit = true;
  }

  saveEditDocument(index: number): void {
    Object.assign(
      this.document[index],
      this.editCacheTableDocument[index].data
    );
    this.editCacheTableDocument[index].edit = false;
    this.documentChange.emit(this.document);
  }

  cancelEditDocument(index: number): void {
    this.editCacheTableDocument[index] = {
      data: { ...this.document[index] },
      edit: false,
    };
    this.documentChange.emit(this.document);
  }

  getNameByIdDocument(idDocument: string): string {
    const filteredServe = this.optionListDocument.filter(
      ({ id }) => id == idDocument
    );
    return filteredServe[0].nombre_documento;
  }

  showRefDocument(): void {
    this.isAddNewDocument = true;
  }

  onSearchDocument(value: string): void {
    if (!value) {
      this.isLoadingDocument = true;
      this.serviceDocument.getDocumentActives().subscribe((data: any) => {
        this.isLoadingDocument = false;
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
        this.optionListDocument = data.data;
        this.optionListCopyDocument = data.data;
      });
    } else {
      this.optionListDocument = this.optionListCopyDocument.filter(
        ({ nombre_documento }) =>
          nombre_documento
            .toLocaleUpperCase()
            .includes(value.toLocaleUpperCase())
      );
    }
  }
}

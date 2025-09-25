import { FormControl } from '@angular/forms';
import { NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

export interface FormFrontend {
  nombre_proyecto: FormControl<string>;
  descripcion_proyecto: FormControl<string>;
  url: FormControl<string>;
  url_versionamiento: FormControl<string>;
  id_lenguaje: FormControl<string>;
  tipoApp: FormControl<boolean>;
}

export interface ResponseFrontend {
  resp: boolean;
  data: Array<DataFrontend>;
}

export interface DataFrontend {
  id: string;
  id_lenguaje: string;
  nombre_proyecto: string;
  url: string;
  descripcion_proyecto: string;
  url_versionamiento: string;
  responsables: Array<PersonasFrontend>;
  servidores: Array<ServidoresFrontend>;
  backends: Array<BackendsFrontend>;
  documentos: Array<DocumentosFrontend>;
  creacion: string;
  modificacion: string;
  activo: boolean;
  loading: boolean;
  tipoApp: boolean;
}

export interface DatatableFrontend {
  id: string;
  id_lenguaje: string;
  nombre_proyecto: string;
  url: string;
  descripcion_proyecto: string;
  url_versionamiento: string;
  responsables: Array<PersonasFrontend>;
  servidores: Array<ServidoresFrontend>;
  backends: Array<BackendsFrontend>;
  documentos: Array<DocumentosFrontend>;
  creacion: string;
  modificacion: string;
  activo: boolean;
  loading: boolean;
  tipoApp: boolean;
}

export interface PersonasFrontend {
  id_rol: string;
  id_usuario: string;
  nombre_usuario: string;
  descripcion_rol: string;
}

export interface ServidoresFrontend {
  url_servidor: string;
  id_servidor: string;
  nombre_servidor: string;
}

export interface BackendsFrontend {
  nombre_backend: string;
  descripcion: string;
  id_backend: string;
}

export interface DocumentosFrontend {
  id_documento: string;
  ubicacion: string;
  nota: string;
  nombre_documento: string;
}

export interface ColumnItemFrontend {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<DataFrontend> | null;
  showSort: boolean;
}

// interface form
export interface ServidoresFrontendForm {
  url_servidor: FormControl<string>;
  id_servidor: FormControl<string>;
}

export interface BackendsFrontendForm {
  descripcion: FormControl<string>;
  id: FormControl<string>;
}

export interface PersonasFrontendForm {
  id_rol: FormControl<string>;
  id_usuario: FormControl<string>;
}

export interface DocumentosFrontendForm {
  id_documento: FormControl<string>;
  ubicacion: FormControl<string>;
  nota: FormControl<string>;
}

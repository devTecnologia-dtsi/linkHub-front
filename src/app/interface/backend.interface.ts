import { FormControl } from "@angular/forms";
import { NzTableSortFn, NzTableSortOrder } from "ng-zorro-antd/table";

export interface FormBackend {
    autenticacion: FormControl<string>;
    metodo: FormControl<string>;
    body: FormControl<string>;
    coleccion: FormControl<string>;
    id_lenguaje: FormControl<string>;
    url_versionamiento: FormControl<string>;
    nombre_backend: FormControl<string>;
    endpoint: FormControl<string>;
}

export interface ResponseBackend {
    resp: boolean,
    data: Array<DataTableBackend>
}

export interface DataTableBackend {
    id: string;
    nombre_backend: string;
    endpoint: string;
    id_lenguaje: string;
    descripcion_lenguaje: string;
    autenticacion: string;
    metodo: string;
    body: string;
    coleccion: string;
    creacion: string;
    modificacion: string;
    URL_Versionamiento: string;
    activo: boolean;
    responsables: Array<ResponsablesBackend>;
    servidores: Array<ServidoresBackend>;
    documentos: Array<DocumentosBackend>;
    loading: boolean
}

export interface ColumnItemBackend {
    name: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: NzTableSortFn<DataTableBackend> | null;
    showSort: boolean;
}

export interface ResponsablesBackend {
    nombre_usuario: string;
    descripcion_rol: string;
    id_rol: string;
    id_usuario: string
}

export interface ServidoresBackend {
    nombre_servidor: string;
    url_servidor: string;
    id_servidor: string;
}

export interface BackendsBackend {
    descripcion: string;
    id: string
}

export interface DocumentosBackend {
    nombre_documento: string;
    id_documento: string;
    ubicacion: string;
    nota: string;
}

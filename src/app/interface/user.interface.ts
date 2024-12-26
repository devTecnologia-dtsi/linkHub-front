import { FormControl } from "@angular/forms";
import { NzTableSortFn, NzTableSortOrder } from "ng-zorro-antd/table";

export interface FormUser {
    nombre: FormControl<string>;
    correo: FormControl<string>;
    id_tipo_usuario: FormControl<string>;
    cargo: FormControl<string>;
    telefono: FormControl<number>;
}

export interface DataItemUser {
    id: string;
    nombre: string;
    correo: string;
    cargo: string;
    telefono: number;
    id_tipo_usuario: string;
    activo: boolean;
    loading: boolean;
    descripcion_tipo_usuario: string;
}

export interface ResponseUser {
    resp: boolean,
    data: Array<DataItemUser>
}

export interface DatatableUser {
    id: string;
    nombre: string;
    correo: string;
    cargo: string;
    telefono: number;
    id_tipo_usuario: string;
    activo: boolean;
    loading: boolean;
    descripcion_tipo_usuario: string;
}

export interface ColumnItemUser {
    name: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: NzTableSortFn<DataItemUser> | null;
    showSort: boolean;
}
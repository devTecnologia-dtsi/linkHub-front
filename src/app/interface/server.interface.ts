import { FormControl } from "@angular/forms";
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from "ng-zorro-antd/table";

export interface FormServer {
    nombre_servidor: FormControl<string>;
    ip: FormControl<string>;
    ambiente: FormControl<string>;
    sistema_operativo: FormControl<string>;
    docker: FormControl<boolean>;
}

export interface ResponseServer {
    resp: boolean,
    data: Array<DataServer>
}

export interface DataServer {
    id: string;
    id_sistema_operativo: string;
    id_ambiente: string;
    ip: string;
    creacion: string;
    modificacion: string;
    activo: boolean;
}

export interface DatatableServer {
    id: string;
    descripcion_ambiente:string;
    nombre_servidor: string;
    nombre_sistema_operativo: string;
    id_sistema_operativo: string;
    id_ambiente: string;
    ip: string;
    creacion: string;
    modificacion: string;
    activo: boolean;
    docker: boolean;
    loading: boolean;
}

export interface ColumnItemServer {
    name: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: NzTableSortFn<DatatableServer> | null;
    showSort: boolean;
}

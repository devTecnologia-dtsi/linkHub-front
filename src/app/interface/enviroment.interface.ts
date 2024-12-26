import { FormControl } from "@angular/forms";
import { NzTableSortFn, NzTableSortOrder } from "ng-zorro-antd/table";

export interface FormEnviroment {
    descripcion: FormControl<string>;
}

export interface ResponseEnviroment {
    resp: boolean,
    data: Array<DataEnviroment>
}

export interface DataEnviroment {
    id: string;
    descripcion: string;
    activo: boolean
}

export interface DatatableEnviroment {
    id: string;
    descripcion: string;
    activo: boolean;
    loading: boolean;
}

export interface ColumnItemEnviroment {
    name: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: NzTableSortFn<DatatableEnviroment> | null;
    shoWSort: boolean;
}

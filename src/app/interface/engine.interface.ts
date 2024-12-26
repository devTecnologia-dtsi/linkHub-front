import { FormControl } from "@angular/forms";
import { NzTableSortFn, NzTableSortOrder } from "ng-zorro-antd/table";

export interface FormEngine {
    descripcion: FormControl<string>;
}

export interface ResponseEngine {
    resp: boolean,
    data: Array<DataEngine>
}

export interface DataEngine {
    id: string;
    descripcion: string;
    activo: boolean
}

export interface DatatableEngine {
    id: string;
    descripcion: string;
    activo: boolean;
    loading: boolean;
}

export interface ColumnItemEngine {
    name: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: NzTableSortFn<DatatableEngine> | null;
    showSort: boolean;
}

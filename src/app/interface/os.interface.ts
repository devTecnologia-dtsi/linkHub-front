import { FormControl } from "@angular/forms";
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from "ng-zorro-antd/table";

export interface FormOs {
    nombre: FormControl<string>;
    version: FormControl<string>;
}

export interface ResponseOs {
    resp: boolean,
    data: Array<DataOs>
}

export interface DataOs {
    id: string;
    nombre: string;
    version: string;
    activo: boolean;
}

export interface DatatableOs {
    id: string;
    nombre: string;
    version: string;
    loading: boolean;
    activo: boolean;
}

export interface ColumnItemOs {
    name: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: NzTableSortFn<DatatableOs> | null;
    showSort: boolean; 
}

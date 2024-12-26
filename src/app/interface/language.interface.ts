import { FormControl } from "@angular/forms";
import { NzTableSortFn, NzTableSortOrder } from "ng-zorro-antd/table";

export interface FormLanguage {
    nombre: FormControl<string>;
}

export interface DataTableLanguage {
    id: string;
    nombre: string;
    activo: boolean;
    loading: boolean;
}

export interface ResponseLanguage {
    resp: boolean,
    data: Array<DataLanguage>
}

export interface DataLanguage {
    id: string;
    nombre: string;
    activo: boolean;
    loading: boolean;
}

export interface ColumnItemLanguage {
    name: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: NzTableSortFn<DataTableLanguage> | null;
    showSort: boolean;
}


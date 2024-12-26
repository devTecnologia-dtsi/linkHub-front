import { FormControl } from "@angular/forms";
import { NzTableSortFn, NzTableSortOrder } from "ng-zorro-antd/table";

export interface FormUserType {
    descripcion: FormControl<string>;
}

export interface DataTableUserType {
    id: string;
    descripcion: string;
    activo: boolean;
    loading: boolean;
}

export interface ResponseUserType {
    resp: boolean,
    data: Array<DataUsertype>
}

export interface DataUsertype {
    id: string;
    descripcion: string;
    activo: boolean
}

export interface ColumnItemTypeUser {
    name: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: NzTableSortFn<DataTableUserType> | null;
    showSort: boolean;
}


import { FormControl } from "@angular/forms";
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from "ng-zorro-antd/table";

export interface FormRoleProject {
    descripcion: FormControl<string>;
}

export interface ResponseRoleProject {
    resp: boolean,
    data: Array<DataRoleProject>
}

export interface DataRoleProject {
    id: string;
    descripcion: string;
    activo: boolean;
    loading: boolean;
}

export interface DatatableRoleProject {
    id: string;
    descripcion: string;
    activo: boolean;
    loading: boolean;
}

export interface ColumnItemRoleProject {
    name: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: NzTableSortFn<DatatableRoleProject> | null;
    showSort: boolean;
}

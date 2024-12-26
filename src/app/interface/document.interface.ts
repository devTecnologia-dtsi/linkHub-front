import { FormControl } from "@angular/forms";
import { NzTableSortFn, NzTableSortOrder } from "ng-zorro-antd/table";

export interface FormDocument {
    descripcion: FormControl<string>;
}

export interface ResponseDocument {
    resp: boolean,
    data: Array<DataDocument>
}

export interface DataDocument {
    id: string;
    descripcion: string;
    activo: boolean
}

export interface DatatableDocument {
    id: string;
    nombre_documento: string;
    loading: boolean;
    activo: boolean;
}

export interface ColumnItemDocument {
    name: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: NzTableSortFn<DatatableDocument> | null;
    showSort: boolean;
}

import { FormControl } from '@angular/forms';
import { NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

export interface FormDB {
  id_motor: FormControl<string>;
  id_servidor: FormControl<string>;
  esquema: FormControl<string>;
  usuario: FormControl<string>;
  contrasena: FormControl<string>;
}

export interface ResponseDB {
  resp: boolean;
  data: Array<DataDB>;
}

export interface DataDB {
  id: string;
  id_motor: string;
  id_servidor: string;
  esquema: string;
  usuario: string;
  contrasena: string;
  activo: boolean;
  descripcion_motor: string;
  nombre_servidor: string;
  loading: boolean;
  modificacion: string;
  creacion: string;
}

export interface DatatableDB {
  id: string;
  descripcion_ambiente: string;
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

export interface ColumnItemDB {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<DataDB> | null;
  showSort: boolean;
}

export interface DBBackendForm {
  id_db: FormControl<string>;
}

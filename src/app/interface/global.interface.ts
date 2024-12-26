import { NzDrawerRef } from "ng-zorro-antd/drawer";

export interface drawerTemplate {
    $implicit: { value: string };
    drawerRef: NzDrawerRef<string>;
}

export interface DrawerFooter {
    drawerRef: NzDrawerRef<string>;
}

export interface TableScrollX {
    x: string
}
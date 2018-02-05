import { Pipe, PipeTransform } from '@angular/core';

/**
 * orderby機能を提供する。
 *
 * sqlで例えると下記機能を提供する
 *  * order by param1 ASC(DESC)
 *  * order by param1 ASC(DESC) , param2 ASC(DESC)
 *
 * example
 * ```
 * // html
 * <ng-container *ngFor="let h of hoge | async | orderBy:order" >
 *   h.param1
 * </ng-container>
 *
 * // component.ts
 * order = new OrderByParam();
 * this.order.set('param1', 'ASC'); // order by param1 ASC
 * this.order.set('param1', 'ASC', 'param2', 'DESC'); // order by param1 ASC , param2 DESC
 * ```
 *
 * 比較する値がnull,undefinedの場合、無限大数とする。もし無限小数としたい場合、nullHandlingMin関数を呼ぶ
 * ```
 * this.order.nullHandlingMin();
 * ```
 * @export
 * @class OrderByPipe
 * @implements {PipeTransform}
 */
@Pipe({
    name: 'orderBy',
    pure: false // パラメータが変わった場合にソートを動作させるためにはfalseにしないといけない
})
export class OrderByPipe implements PipeTransform {
    transform(value: any, param: OrderByParam): any {
        // console.log(param);
        if (!value) {
            return value;
        }
        if (!param) {
            return value;
        }

        if (!param.sortColumn) {
            return value;
        }

        return value.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';
            let propertyOrderBy = 'ASC';
            [propertyA, propertyB] = [a[param.sortColumn], b[param.sortColumn]];
            let valA = isNaN(+propertyA) ? propertyA : +propertyA;
            let valB = isNaN(+propertyB) ? propertyB : +propertyB;

            valA = (valA) ? valA : param.nullHandling;
            valB = (valB) ? valB : param.nullHandling;
            propertyOrderBy = param.orderBy;
            // 同じ値だった場合かつ同一時のカラム指定が存在した場合
            if (valA === valB && param.reserveColumn) {
                [propertyA, propertyB] = [a[param.reserveColumn], b[param.reserveColumn]];
                valA = isNaN(+propertyA) ? propertyA : +propertyA;
                valB = isNaN(+propertyB) ? propertyB : +propertyB;

                valA = (valA) ? valA : param.nullHandling;
                valB = (valB) ? valB : param.nullHandling;
                propertyOrderBy = param.reserveOrderBy;
            }
            return (valA > valB ? -1 : 1) * (propertyOrderBy === 'ASC' ? -1 : 1);
        });
    }
}
/**
 * ソートする規則を設定する.
 *
 * デフォルトではカラム値がnullもしくはundefineの場合はNumber.MAX_VALUEとして扱う
 * カラム値がnullもしくはundefineの取り扱いをNumber.MIN_VALUEとして扱う場合は{{nullHandlingMin()}}を呼ぶ
 * @export
 * @class OrderByParam
 */
export class OrderByParam {
    sortColumn: string;
    orderBy: 'ASC' | 'DESC';
    reserveColumn: string;
    reserveOrderBy: 'ASC' | 'DESC';
    nullHandling = Number.MAX_VALUE;

    /**
     * Creates an instance of OrderByParam.
     * @param {string} [sortColumn] ソート対象カラム名
     * @param {('ASC' | 'DESC')} [orderBy] ソート順(default:ASC(昇順))
     * @memberof OrderByParam
     */
    constructor(sortColumn?: string, orderBy?: 'ASC' | 'DESC') {
        this.nullHandling = Number.MAX_VALUE;
        if (!sortColumn) {
            this.sortColumn = sortColumn;
        }
        if (!orderBy) {
            this.orderBy = 'ASC';
            this.reserveOrderBy = 'ASC';
        }
    }

    /**
     * ソートするカラム名、order順を設定する
     *
     * sortColumnをhoge1、reserveColumnをhoge2にした場合、<code>order by hoge1 ,hoge2</code>と同様になる。
     *
     * @param {string} sortColumn カラム名
     * @param {string} [orderBy] ASC or DESC
     * @param {string} [reserveColumn] カラム名。sortColumnの値が同一だった場合の第二ソートカラム名
     * @param {string} [reserveOrderBy] ASC or DESC
     * @memberof OrderByParam
     */
    set(sortColumn: string, orderBy?: string, reserveColumn?: string, reserveOrderBy?: string) {
        this.sortColumn = sortColumn;
        this.orderBy = this.getOrderBy(orderBy);
        if (reserveColumn) {
            this.reserveColumn = reserveColumn;
        }
        if (reserveOrderBy) {
            this.reserveOrderBy = this.getOrderBy(reserveOrderBy);
        }
    }

    /**
     * null,undefined値の取り扱いを{Number.MIN_VALUE}とする
     * @memberof OrderByParam
     */
    nullHandlingMin() {
        this.nullHandling = Number.MIN_VALUE;
    }

    /**
     * null,undefined値の取り扱いを{Number.MAX_VALUE}とする
     * @memberof OrderByParam
     */
    nullHandlingMax() {
        this.nullHandling = Number.MAX_VALUE;
    }

    private _changeOrderBy() {
        if (this.orderBy === 'ASC') {
            this.orderBy = 'DESC';
        } else {
            this.orderBy = 'ASC';
        }
    }

    private getOrderBy(val: string): ('ASC' | 'DESC') {
        if (val === 'ASC') {
            return 'ASC';
        }
        return 'DESC';
    }

    private _setOrderBy(val: string) {
        this.orderBy = this.getOrderBy(val);
    }

}
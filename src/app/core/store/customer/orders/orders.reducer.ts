import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Order } from 'ish-core/models/order/order.model';
import { setErrorOn, setLoadingOn } from 'ish-core/utils/ngrx-creators';

import {
  createOrder,
  createOrderFail,
  createOrderSuccess,
  loadOrder,
  loadOrderFail,
  loadOrderSuccess,
  loadOrders,
  loadOrdersFail,
  loadOrdersSuccess,
  selectOrder,
} from './orders.actions';

export const orderAdapter = createEntityAdapter<Order>({
  selectId: order => order.id,
});

export interface OrdersState extends EntityState<Order> {
  loading: boolean;
  selected: string;
  error: HttpError;
}

export const initialState: OrdersState = orderAdapter.getInitialState({
  loading: false,
  selected: undefined,
  error: undefined,
});

export const ordersReducer = createReducer(
  initialState,
  on(selectOrder, (state: OrdersState, action) => ({
    ...state,
    selected: action.payload.orderId,
  })),
  setLoadingOn(loadOrders, loadOrder, createOrder),
  on(createOrderSuccess, loadOrderSuccess, (state: OrdersState, action) => {
    const { order } = action.payload;

    return {
      ...orderAdapter.upsertOne(order, state),
      selected: order.id,
      loading: false,
      error: undefined,
    };
  }),
  on(loadOrdersSuccess, (state: OrdersState, action) => {
    const { orders } = action.payload;
    return {
      ...orderAdapter.setAll(orders, state),
      loading: false,
      error: undefined,
    };
  }),
  setErrorOn(loadOrdersFail, loadOrderFail, createOrderFail)
);

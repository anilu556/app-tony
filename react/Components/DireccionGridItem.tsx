import React from "react";
import {FC} from "react";
// @ts-ignore
import styles from '../styles.css'

export interface propsDireccionGritItem {
  item: any,
  handleDireccionSeleccionada: Function,
  form: any
}

const DireccionGridItem: FC<propsDireccionGritItem> = (
  {item, handleDireccionSeleccionada, form}
  ) => {

  return (
    <>
      <input className={styles.checkbox} type="radio" name="direccionSeleccionada" onChange={() => handleDireccionSeleccionada(item.id)}/>
      <li className={`vtex-flex-layout-0-x-body-table-item`}>{`${form.rfc}`}</li>
      <li className={`vtex-flex-layout-0-x-body-table-item ${styles.headerItemCentered}`}>{`${item.Street}`}</li>
      <li className={`vtex-flex-layout-0-x-body-table-item ${styles.headerItemCentered}`}>{`${item.AddressNumber}`}</li>
      <li className={`vtex-flex-layout-0-x-body-table-item ${styles.headerItemCentered}`}>{`${item.AddressNumberInterior !== '' || null || undefined? item.AddressNumberInterior : '-'}`}</li>
      <li className={`vtex-flex-layout-0-x-body-table-item ${styles.headerItemCentered}`}>{`${item.Suburb}`}</li>
      <li className={`vtex-flex-layout-0-x-body-table-item ${styles.headerItemCentered}`}>{`${item.City}`}</li>
      <li className={`vtex-flex-layout-0-x-body-table-item ${styles.lastlibodygrid} ${styles.headerItemCentered}`}>{`${item.State}`}</li>
  </>
  );
};

export default DireccionGridItem;


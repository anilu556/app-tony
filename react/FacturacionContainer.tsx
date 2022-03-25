/* Este componente renderiza el formulario de facturacion, hace consulta por API a servidor
de Tony para traer lista de colonias dependiendo el CP ingresado en el formulario, también en caso
de no encontrar ningun dato de ese CP con sulta en Master data tabla de estados de mexico para dropdown*/

import React from 'react'
// @ts-ignore
import { Input, Button, Dropdown, Alert } from 'vtex.styleguide'
// @ts-ignore
import styles from './styles.css'
import ModalDirecciones from './ModalDirecciones'
import Captcha from './Components/Captcha'

function FacturacionContainer({
  handleChangeBilling,
  handleChangeForm,
  handleChangeCodigoPostal,
  handleChangeFormaPago,
  handleChangeUsoCFDI,
  closeNotification,
  seleccionarEstado,
  handleChangePersonaFisica,
  handleChangePersonaMoral,
  showNotification,
  checkFisica,
  checkMoral,
  errorRFC,
  form,
  optionsCFDI,
  optionsFormaPago,
  dropdownEstados,
  dropdownColonias,
  isLoading,
  setForm,
  rfcValido,
  setErrorRFC,
  isReadOnly,
  setIsReadOnly,
  errorCP,
  createRandomNum,
  captchaNumb,
  handleCaptchaAnswer,
  showNotifCaptcha,
  seleccionarColonia,
  colonias,
  codigoPostal,
  getColonias,
  setDropdownColonias,
}: {
  handleChangeBilling: any
  handleChangeForm: any
  handleChangeCodigoPostal: any
  handleChangeFormaPago: any
  handleChangeUsoCFDI: any
  closeNotification: any
  seleccionarEstado: any
  handleChangePersonaFisica: any
  handleChangePersonaMoral: any
  showNotification: any
  checkFisica: any
  checkMoral: any
  errorRFC: any
  form: any
  optionsCFDI: any
  optionsFormaPago: any
  dropdownEstados: any
  dropdownColonias: any
  isLoading: any
  setForm: any
  rfcValido: any
  setErrorRFC: any
  isReadOnly: any
  setIsReadOnly: any
  errorCP: any
  createRandomNum: any
  captchaNumb: any
  handleCaptchaAnswer: any
  showNotifCaptcha: any
  seleccionarColonia: any
  colonias: any
  codigoPostal: any
  getColonias: any
  setDropdownColonias: any
}) {
  return (
    <>
      <div className={styles.facturacionContainer}>
        <p className={`vtex-flex-layout-0-x-disclosure-facturacion`}>
          Favor de llenar los datos solicitados. Al generar la factura se te
          enviará vía correo electrónico.
        </p>

        {showNotification ? (
          <>
            <Alert type="success" onClose={() => closeNotification(false)}>
              Tu factura se encuentra en proceso de envío al correo que
              proporcionaste
            </Alert>
            <br />
          </>
        ) : null}

        <div className={styles.checkbox}>
          <h3 className={styles.checkboxTitle}>Persona</h3>
          <div className={styles.checkboxContainer}>
            <div className={`mb3 vtex-flex-layout-0-x-checkbox-option`}>
              <input
                className={`vtex-flex-layout-0-x-checkbox-icon`}
                type="radio"
                checked={checkFisica}
                id="option-fisica"
                name="default-checkbox-group"
                onChange={handleChangePersonaFisica}
                value="persona-fisica"
              />
              Física
            </div>
            <div className={`mb3 vtex-flex-layout-0-x-checkbox-option`}>
              <input
                className={`vtex-flex-layout-0-x-checkbox-icon`}
                type="radio"
                checked={checkMoral}
                id="option-moral"
                name="default-checkbox-group"
                onChange={handleChangePersonaMoral}
                value="persona-moral"
              />
              Moral
            </div>
          </div>
        </div>

        <form
          autoComplete="off"
          className={`vtex-flex-layout-0-x-formContainer-facturacion`}
        >
          <h2 className="vtex-input__label db mb3 w-100 c-on-base t-body lh-copy">
            Datos Generales
          </h2>

          <div className={styles.idThree}>
            <div className={styles.inThree}>
              <Input
                placeholder="XXX1902127X3"
                size="Regular"
                label="RFC"
                name="rfc"
                maxLength={13}
                minLength={13}
                value={form.rfc}
                onChange={handleChangeForm}
                errorMessage={errorRFC}
              />
            </div>

            <div
              className={`${checkMoral == true ? styles.hide : styles.active} ${
                styles.inThree
              }`}
            >
              <Input
                placeholder="Empresa SA de CV"
                size="Regular"
                label="Razon social"
                name="razonSocial"
                value={form.razonSocial}
                onChange={handleChangeForm}
                errorMessage=""
              />
            </div>

            <div
              className={`${
                checkFisica == true ? styles.hide : styles.active
              } ${styles.inThree}`}
            >
              <Input
                placeholder="Nombre"
                size="Regular"
                label="Nombre(s)"
                name="nombre"
                value={form.nombre}
                onChange={handleChangeForm}
                errorMessage=""
              />
            </div>

            <div
              className={`${
                checkFisica == true ? styles.hide : styles.active
              } ${styles.inThree}`}
            >
              <Input
                placeholder="Primer apellido"
                size="Regular"
                label="Primer apellido"
                name="primerApellido"
                value={form.primerApellido}
                onChange={handleChangeForm}
                errorMessage=""
              />
            </div>

            <div
              className={`${
                checkFisica == true ? styles.hide : styles.active
              } ${styles.inThree}`}
            >
              <Input
                placeholder="Segundo apellido"
                size="Regular"
                label="Segundo apellido"
                name="segundoApellido"
                value={form.segundoApellido}
                onChange={handleChangeForm}
                errorMessage=""
              />
            </div>

            <div className={styles.inThree}>
              <Input
                type="email"
                placeholder="correo@ejemplo.com"
                size="Regular"
                label="Correo electrónico"
                name="correo"
                value={form.correo}
                onChange={handleChangeForm}
              />
            </div>

            <div className={styles.inThree}>
              <Input
                type="tel"
                placeholder="0000000000"
                size="Regular"
                label="Teléfono"
                name="telefono"
                value={form.telefono}
                onChange={handleChangeForm}
              />
            </div>

            <div className={styles.inThree}>
              <Dropdown
                label="Uso de CFDI"
                placeholder="Uso de CFDI"
                size="Regular"
                options={optionsCFDI.sort((x: any, y: any) =>
                  x.value.localeCompare(y.value)
                )}
                value={form.usoCFDI}
                onChange={(_: any, v: any) => handleChangeUsoCFDI({ value: v })}
              />
            </div>

            <div className={styles.inThree}>
              <Dropdown
                label="Forma de pago"
                placeholder="Forma de pago"
                size="Regular"
                options={optionsFormaPago.sort((x: any, y: any) =>
                  x.value.localeCompare(y.value)
                )}
                value={form.formaPago}
                onChange={(_: any, v: any) =>
                  handleChangeFormaPago({ value: v })
                }
              />
            </div>

            <div className={styles.inThree}>
              <Input
                placeholder="0000000000000"
                size="Regular"
                label="Número de pedido"
                name="numeroPedido"
                maxLength={13}
                minLength={13}
                value={form.numeroPedido || ''}
                onChange={handleChangeForm}
                errorMessage=""
              />
            </div>
          </div>

          <div className={`vtex-flex-layout-0-x-btn-modal`}>
            <ModalDirecciones
              form={form}
              setForm={setForm}
              rfcValido={rfcValido}
              setErrorRFC={setErrorRFC}
              errorRFC={errorRFC}
              dropdownEstados={dropdownEstados}
              setIsReadOnly={setIsReadOnly}
              getColonias={getColonias}
              colonias={colonias}
              isReadOnly={isReadOnly}
              dropdownColonias={dropdownColonias}
              setDropdownColonias={setDropdownColonias}
            />
          </div>

          <h2 className="vtex-input__label db mb3 w-100 c-on-base t-body lh-copy">
            Domicilio Fiscal
          </h2>

          <div className={styles.idThree}>
            <div className={styles.inThree}>
              <Input
                label="Calle"
                placeholder="Calle"
                size="Regular"
                name="calle"
                readOnly={isReadOnly}
                value={form.calle}
                onChange={handleChangeForm}
              />
            </div>

            <div className={styles.idTwo}>
              <div className={styles.inTwo}>
                <Input
                  label="Numero exterior"
                  placeholder="Número exterior"
                  size="Regular"
                  name="numero"
                  readOnly={isReadOnly}
                  value={form.numero}
                  onChange={handleChangeForm}
                />
              </div>
              <div className={styles.inTwo}>
                <Input
                  label="Numero interior"
                  placeholder="Número interior"
                  size="Regular"
                  name="numeroInterior"
                  readOnly={isReadOnly}
                  value={form.numeroInterior}
                  onChange={handleChangeForm}
                />
              </div>
            </div>

            <div className={styles.inThree}>
              <Input
                label="Entre calles o intersección"
                placeholder="Entre calles"
                size="Regular"
                name="BetweenStreets"
                readOnly={isReadOnly}
                value={form.BetweenStreets}
                onChange={handleChangeForm}
                errorMessage=""
              />
            </div>

            <div className={styles.inThree}>
              <Input
                label="Código postal"
                placeholder="Código postal"
                size="Regular"
                name="codigoPostal"
                maxLength={5}
                minLength={5}
                readOnly={isReadOnly}
                value={codigoPostal}
                onChange={handleChangeCodigoPostal}
                errorMessage={errorCP}
              />
            </div>

            <div className={styles.inThree}>
              {colonias.length <= 0 ? (
                <Input
                  label="Colonia"
                  placeholder="Colonia"
                  size="Regular"
                  name="colonia"
                  readOnly={isReadOnly}
                  value={form.colonia}
                  onChange={handleChangeForm}
                />
              ) : (
                <Dropdown
                  label="Colonia"
                  placeholder="Colonia"
                  size="Regular"
                  name="colonia"
                  disabled={isReadOnly}
                  value={form.colonia}
                  options={dropdownColonias.sort((x: any, y: any) =>
                    x.label.localeCompare(y.label)
                  )}
                  onChange={(_: any, v: any) =>
                    seleccionarColonia({ seleccion: v })
                  }
                />
              )}
            </div>

            <div className={styles.inThree}>
              {colonias.length <= 0 ? (
                <Input
                  label="Ciudad"
                  placeholder="Ciudad (Municipio)"
                  size="Regular"
                  name="ciudad"
                  readOnly={isReadOnly}
                  value={form.ciudad}
                  onChange={handleChangeForm}
                />
              ) : (
                <Input
                  label="Ciudad"
                  placeholder="Ciudad (Municipio)"
                  size="Regular"
                  name="ciudad"
                  readOnly={true}
                  value={form.ciudad}
                  onChange={handleChangeForm}
                />
              )}
            </div>
            <div className={styles.inThree}>
              {colonias.length <= 0 ? (
                <Dropdown
                  label="Estado"
                  placeholder="Estado"
                  size="Regular"
                  disabled={isReadOnly}
                  value={form.estado}
                  options={dropdownEstados.sort((x: any, y: any) =>
                    x.label.localeCompare(y.label)
                  )}
                  onChange={(_: any, v: any) =>
                    seleccionarEstado({ seleccion: v })
                  }
                />
              ) : (
                <Input
                  label="Estado"
                  placeholder="Estado"
                  size="Regular"
                  name="Estado"
                  readOnly={true}
                  value={form.estado}
                  onChange={handleChangeForm}
                />
              )}
            </div>
          </div>

          <Captcha
            isLoading={isLoading}
            createRandomNum={createRandomNum}
            captchaNumb={captchaNumb}
            handleCaptchaAnswer={handleCaptchaAnswer}
            showNotifCaptcha={showNotifCaptcha}
            closeNotification={closeNotification}
          />

          <div className={`vtex-flex-layout-0-x-boton-facturacion-container`}>
            <Button
              variation="primary"
              block
              onClick={handleChangeBilling}
              isLoading={isLoading}
            >
              Enviar
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

export default FacturacionContainer

//Modal creado para extender la funcionalidad del formulario de facturacion, con este componente
//se carga un modal con una tabla donde el usuario previamente habiendo ingresado un RFC valido
//puede guardar distintas direcciones para posteriormente poder ingresar y seleccionar una de las direcciones
//que guardo para rellenar el formulario mas rapido

import React, { useState } from 'react'
// @ts-ignore
import { Modal, Button, Input, Dropdown, Alert } from 'vtex.styleguide'
import { AppKey, AppToken } from './keys'
import DireccionGridItem from './Components/DireccionGridItem'
// @ts-ignore
import styles from './styles.css'

const ModalDirecciones: any = ({
  setForm,
  form,
  rfcValido,
  errorRFC,
  setErrorRFC,
  dropdownEstados,
  isReadOnly,
  setIsReadOnly,
  getColonias,
  colonias,
  dropdownColonias,
}: {
  setForm: any
  form: any
  rfcValido: any
  errorRFC: any
  setErrorRFC: any
  dropdownEstados: any
  isReadOnly: any
  setIsReadOnly: any
  getColonias: any
  colonias: any
  dropdownColonias: any
}) => {
  const [isModalAdressOpen, setIsModalAdressOpen] = useState(false)
  const [isModalLoadingOpen, setIsModalLoadingOpen] = useState(false)
  const [isModalAddAddressOpen, setIsModalAddAddressOpen] = useState(false)
  const [listaDirecciones, setListaDirecciones] = useState([])
  const [direccionSeleccionada, setDireccionSeleccionada] = useState('')
  const [showNotifAddressCreated, setShowNotifAddressCreated] = useState(false)
  const [showNotifMissingRFC, setShowNotifMissingRFC] = useState(false)
  const [errorCP, setErrorCP] = useState('')
  const [
    showNotifMissingAddressInfo,
    setShowNotifMissingAddressInfo,
  ] = useState(false)
  const [addressForm, setAddressForm] = useState({
    rfc: form.rfc,
    calle: '',
    numero: '',
    numeroInterior: '',
    BetweenStreets: '',
    colonia: '',
    codigoPostal: '',
    ciudad: '',
    estado: '',
  })

  const seleccionarColoniaAddressForm = (coloniaSeleccionada: any) => {
    setAddressForm({
      ...addressForm,
      colonia: coloniaSeleccionada.seleccion,
      ciudad: colonias[0].nomciudad,
      estado: colonias[0].nomestado,
    })
  }

  let codigoPostal
  const handleChangeCodigoPostalAddress = (e: any) => {
    codigoPostal = e.currentTarget.value
    setAddressForm({ ...addressForm, codigoPostal: codigoPostal })
    if (codigoPostal.length === 5) {
      setErrorCP('')
      getColonias(codigoPostal)
    } else {
      setErrorCP('Ingresa un código postal válido')
    }
    console.log(codigoPostal)
    console.log(codigoPostal.length)
  }

  const getAdresses = async () => {
    let direccionesGuardadas = []

    try {
      let url = `/api/dataentities/DireccionesV1/search?_where=Rfc%3D${form.rfc}&_schema=mdv1`
      let config = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'X-VTEX-API-AppKey': AppKey,
          'X-VTEX-API-AppToken': AppToken,
        },
      }
      const res = await fetch(url, config)
      direccionesGuardadas = await res.json()
      setListaDirecciones(direccionesGuardadas)
    } catch (error) {
      console.log('Ocurrio un error al obtener las direcciones', error)
      return false
    }

    if (direccionesGuardadas.length == 0) {
      setTimeout(() => {
        getAdresses()
      }, 7000)
    }
    return false
  }

  const getSelectedAdress = async () => {
    let direccion = []

    try {
      let url = `/api/dataentities/DireccionesV1/search?_where=id%3D${direccionSeleccionada}&_schema=mdv1`
      let config = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'X-VTEX-API-AppKey': AppKey,
          'X-VTEX-API-AppToken': AppToken,
        },
      }
      const res = await fetch(url, config)
      direccion = await res.json()
      setForm({
        ...form,
        calle: direccion[0].Street,
        numero: direccion[0].AddressNumber,
        numeroInterior: direccion[0].AddressNumberInterior,
        BetweenStreets: direccion[0].BetweenStreets,
        colonia: direccion[0].Suburb,
        codigoPostal: direccion[0].PostalCode,
        ciudad: direccion[0].City,
        estado: direccion[0].State,
      })
    } catch (error) {
      console.log('Ocurrio un error al obtener las direcciones', error)
      return false
    }

    if (direccion.length == 0) {
      setTimeout(() => {
        getSelectedAdress()
      }, 7000)
    }
    return false
  }

  const handleOpenModal = () => {
    if (form.rfc !== '') {
      getAdresses()
      setIsModalLoadingOpen(true)
      setTimeout(() => {
        setIsModalLoadingOpen(false)
        setIsModalAdressOpen(true)
      }, 1000)
    } else {
      setShowNotifMissingRFC(true)
      setTimeout(() => {
        setShowNotifMissingRFC(false)
      }, 9000)
    }
  }

  const handleCloseModal = () => {
    setIsModalAdressOpen(false)
  }

  const handleCloseModalCreateAddress = () => {
    setIsModalAddAddressOpen(false)
    colonias = []
    setAddressForm({
      ...addressForm,
      rfc: form.rfc,
      calle: '',
      numero: '',
      numeroInterior: '',
      BetweenStreets: '',
      colonia: '',
      codigoPostal: '',
      ciudad: '',
      estado: '',
    })
  }

  const handleDireccionSeleccionada = (e: any) => {
    setDireccionSeleccionada(e)
  }

  const handleCreateAdress = () => {
    setIsModalAddAddressOpen(true)
  }

  const handleChangeFormAddress = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget
    setAddressForm({ ...addressForm, [name]: value })
    if (name == 'rfc') {
      console.log(`RFC valido: ${rfcValido(value)}`)

      if (rfcValido(value) === false) {
        setErrorRFC('Ingresa un RFC valido')
      } else {
        setErrorRFC('')
      }
    }
  }

  const seleccionarEstadoAdressForm = (estadoSeleccionado: any) => {
    setAddressForm({ ...addressForm, estado: estadoSeleccionado.seleccion })
  }

  const validateCreateAddress = () => {
    if (
      form.rfc === '' ||
      addressForm.calle === '' ||
      addressForm.numero === '' ||
      addressForm.codigoPostal === '' ||
      addressForm.colonia === '' ||
      addressForm.ciudad === '' ||
      addressForm.estado === '' ||
      addressForm.BetweenStreets === ''
    ) {
      setShowNotifMissingAddressInfo(true)
      setTimeout(() => {
        setShowNotifMissingAddressInfo(false)
      }, 5000)
    } else {
      handleSubmitCreateAdress()
    }
  }

  const handleSubmitCreateAdress = async () => {
    const fecha = new Date()
    let data: any = {}
    data = {
      Rfc: form.rfc,
      Street: addressForm.calle,
      AddressNumber: addressForm.numero,
      AddressNumberInterior: addressForm.numeroInterior,
      PostalCode: addressForm.codigoPostal,
      Suburb: addressForm.colonia,
      City: addressForm.ciudad,
      State: addressForm.estado,
      Date: fecha,
      BetweenStreets: addressForm.BetweenStreets,
    }

    try {
      let url = `/api/dataentities/DireccionesV1/documents/?_schema=mdv1`
      let config = {
        method: 'PATCH',
        headers: {
          Accept: 'application/vnd.vtex.ds.v10+json',
          'Content-Type': 'application/json',
          'X-VTEX-API-AppKey': AppKey,
          'X-VTEX-API-AppToken': AppToken,
        },
        body: JSON.stringify(data),
      }
      let res = await fetch(url, config)
      let response = await res.json()
      console.log(response)
    } catch (error) {
      console.log(error)
      // setState({isLoading : false})
      return false
    }

    adressFormClean()
    setShowNotifAddressCreated(true)
    setTimeout(() => {
      setIsModalAddAddressOpen(false)
      handleCloseModal()
      setShowNotifAddressCreated(false)
    }, 2000)

    return false
  }

  const closeNotification = (flag: any) => {
    setShowNotifAddressCreated(flag)
    setShowNotifMissingRFC(flag)
  }

  const adressFormClean = () => {
    setAddressForm({
      ...addressForm,
      rfc: form.rfc,
      calle: '',
      numero: '',
      numeroInterior: '',
      BetweenStreets: '',
      colonia: '',
      codigoPostal: '',
      ciudad: '',
      estado: '',
    })
  }

  const handleSubmitAdress = () => {
    setIsModalLoadingOpen(true)
    getSelectedAdress()
    setIsReadOnly(true)
    setTimeout(() => {
      setIsModalLoadingOpen(false)
      handleCloseModal()
    }, 500)
  }

  return (
    <>
      {showNotifMissingRFC ? (
        <div className="animate__animated animate__fadeInUp">
          <Alert type="error" onClose={() => closeNotification(false)}>
            Por favor, primero ingresa un RFC válido en el formulario para
            acceder a esta función
          </Alert>
        </div>
      ) : null}

      <Button onClick={handleOpenModal}>
        Elige la dirección de facturación
      </Button>

      <Modal isOpen={isModalAdressOpen} onClose={handleCloseModal}>
        <div className={`vtex-flex-layout-0-x-modalAdress-container`}>
          <p className={`vtex-flex-layout-0-x-titulo-modalAdress`}>
            Elige la dirección de facturación
          </p>
          <div className={`vtex-flex-layout-0-x-table-modalAdress-container`}>
            <ul className={styles.headerTable}>
              <li className={`vtex-flex-layout-0-x-header-table-item`}></li>
              <li className={`vtex-flex-layout-0-x-header-table-item`}>RFC</li>
              <li
                className={`vtex-flex-layout-0-x-header-table-item ${styles.headerItemCentered}`}
              >
                Calle
              </li>
              <li
                className={`vtex-flex-layout-0-x-header-table-item ${styles.headerItemCentered}`}
              >
                No. Ext
              </li>
              <li
                className={`vtex-flex-layout-0-x-header-table-item ${styles.headerItemCentered}`}
              >
                No. Int
              </li>
              <li
                className={`vtex-flex-layout-0-x-header-table-item ${styles.headerItemCentered}`}
              >
                Colonia
              </li>
              <li
                className={`vtex-flex-layout-0-x-header-table-item ${styles.headerItemCentered}`}
              >
                Ciudad
              </li>
              <li
                className={`vtex-flex-layout-0-x-header-table-item ${styles.headerItemCentered}`}
              >
                Estado
              </li>
            </ul>

            <ul className={styles.bodyTable}>
              {listaDirecciones.map((item: any) => (
                <>
                  <DireccionGridItem
                    key={item.id}
                    item={item}
                    handleDireccionSeleccionada={handleDireccionSeleccionada}
                    form={form}
                  />
                </>
              ))}
            </ul>
          </div>

          <div className={styles.btnSubmitContainer}>
            <button
              className={styles.btnAddAddress}
              onClick={handleCreateAdress}
            >
              Agregar nueva dirección
            </button>
            <button
              className={styles.btnSubmitAddress}
              onClick={handleSubmitAdress}
            >
              Aceptar
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isModalLoadingOpen} onClose={handleCloseModal}>
        <div className={`vtex-flex-layout-0-x-modalAdress-container`}>
          <p className={`vtex-flex-layout-0-x-titulo-modalAdress`}>
            Cargando...
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={isModalAddAddressOpen}
        onClose={handleCloseModalCreateAddress}
      >
        <div className={`vtex-flex-layout-0-x-modalAdress-container`}>
          <p className={`vtex-flex-layout-0-x-titulo-modalAdress`}>
            Ingresa la información solicitada
          </p>
          {showNotifAddressCreated ? (
            <>
              <Alert type="success" onClose={() => closeNotification(false)}>
                Dirección guardada correctamente
              </Alert>
              <br />
            </>
          ) : null}
          {showNotifMissingAddressInfo ? (
            <>
              <Alert type="error" onClose={() => closeNotification(false)}>
                Por favor, primero llena todos los campos
              </Alert>
              <br />
            </>
          ) : null}
          <div className={`vtex-flex-layout-0-x-table-modalAdress-container`}>
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
                  onChange={handleChangeFormAddress}
                  errorMessage={errorRFC}
                  readOnly={true}
                />
              </div>

              <div className={styles.inThree}>
                <Input
                  label="Calle"
                  placeholder="Calle"
                  size="Regular"
                  name="calle"
                  value={addressForm.calle}
                  onChange={handleChangeFormAddress}
                />
              </div>

              <div className={styles.idTwo}>
                <div className={styles.inTwo}>
                  <Input
                    label="Numero exterior"
                    placeholder="Número exterior"
                    size="Regular"
                    name="numero"
                    value={addressForm.numero}
                    onChange={handleChangeFormAddress}
                  />
                </div>
                <div className={styles.inTwo}>
                  <Input
                    label="Numero interior"
                    placeholder="Número interior"
                    size="Regular"
                    name="numeroInterior"
                    value={addressForm.numeroInterior}
                    onChange={handleChangeFormAddress}
                  />
                </div>
              </div>

              <div className={styles.inThree}>
                <Input
                  label="Entre calles o intersección"
                  placeholder="Entre calles"
                  size="Regular"
                  name="BetweenStreets"
                  value={addressForm.BetweenStreets}
                  onChange={handleChangeFormAddress}
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
                  value={codigoPostal}
                  onChange={handleChangeCodigoPostalAddress}
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
                    value={addressForm.colonia}
                    onChange={handleChangeFormAddress}
                  />
                ) : (
                  <Dropdown
                    label="Colonia"
                    placeholder="Colonia"
                    size="Regular"
                    name="colonia"
                    disabled={isReadOnly}
                    value={addressForm.colonia}
                    options={dropdownColonias.sort((x: any, y: any) =>
                      x.label.localeCompare(y.label)
                    )}
                    onChange={(_: any, v: any) =>
                      seleccionarColoniaAddressForm({ seleccion: v })
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
                    value={addressForm.ciudad}
                    onChange={handleChangeFormAddress}
                  />
                ) : (
                  <Input
                    label="Ciudad"
                    placeholder="Ciudad (Municipio)"
                    size="Regular"
                    name="ciudad"
                    readOnly={true}
                    value={addressForm.ciudad}
                    onChange={handleChangeFormAddress}
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
                    value={addressForm.estado}
                    options={dropdownEstados.sort((x: any, y: any) =>
                      x.label.localeCompare(y.label)
                    )}
                    onChange={(_: any, v: any) =>
                      seleccionarEstadoAdressForm({ seleccion: v })
                    }
                  />
                ) : (
                  <Input
                    label="Estado"
                    placeholder="Estado"
                    size="Regular"
                    name="Estado"
                    readOnly={true}
                    value={addressForm.estado}
                    onChange={handleChangeFormAddress}
                  />
                )}
              </div>
            </div>
          </div>
          <div className={styles.btnSubmitContainer}>
            <button
              className={styles.btnSubmitAddress}
              onClick={validateCreateAddress}
            >
              Enviar
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ModalDirecciones

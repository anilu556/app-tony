/* Este componente contiene la mayor parte de la info que rodea la funcionalidad de facturacion
del store dentro de su state y de aqui se comparte la info hasta otros componentes como 
el facturacion container y el modal direcciones*/

import React, { useState, useEffect } from 'react'
import FacturacionContainer from './FacturacionContainer'
import { AppKey, AppToken } from './keys'

const Facturacion = () => {
  const [optionsRFFisica, setOptionsRFFisica]: any = useState([])
  const [optionsRFMoral, setOptionsRFMoral]: any = useState([])
  const [optionsUsoCFDI, setOptionsUsoCFDI]: any = useState([]);
  const [optionsFormaPago, setOptionsFormaPago]: any = useState([])
  const [form, setForm] = useState({
    tipoPersona: 'fisica',
    numeroPedido: '',
    razonSocial: '',
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    correo: '',
    rfc: '',
    telefono: '',
    calle: '',
    estado: '',
    numero: '',
    numeroInterior: '',
    codigoPostal: '',
    colonia: '',
    ciudad: '',
    regimenFiscal: '',
    usoCFDI: '',
    formaPago: '',
    BetweenStreets: '',
  })
  const [errorRFC, setErrorRFC] = useState('')
  const [errorCP, setErrorCP] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [dropdownEstados, setDropdownEstados]: any = useState([])
  const [dropdownColonias, setDropdownColonias]: any = useState([])
  const [colonias, setColonias]: any = useState([])
  const [checkFisica, setCheckFisica] = useState(true)
  const [checkMoral, setCheckMoral] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(false)
  const [captchaNumb, setCaptchaNumb] = useState({ a: 0, b: 0, c: '' })
  const [showNotifCaptcha, setShowNotifCaptcha] = useState(false)

  useEffect(() => {
    getFormaPago()
    obtenerEstados()
    getRegimenFiscal()
    createRandomNum()
  }, [])

  const createRandomNum = () => {
    let a = Math.floor(Math.random() * 10) + 1
    let b = Math.floor(Math.random() * 10) + 1
    setCaptchaNumb({ ...captchaNumb, a: a, b: b })
  }

  const handleCaptchaAnswer = (e: React.FormEvent<HTMLInputElement>) => {
    setCaptchaNumb({ ...captchaNumb, c: e.currentTarget.value })
    setShowNotifCaptcha(false)
  }

  const validarCaptcha = () => {
    if (captchaNumb.a + captchaNumb.b !== Number(captchaNumb.c)) {
      createRandomNum()
      setShowNotifCaptcha(true)
      return false
    }
    setShowNotifCaptcha(false)
    return true
  }

  const handleChangePersonaFisica = () => {
    if (checkFisica == true) {
      setCheckFisica(false)
      setCheckMoral(true)
      setForm({ ...form, tipoPersona: 'moral' })
    } else {
      setCheckFisica(true)
      setCheckMoral(false)
      setForm({ ...form, tipoPersona: 'fisica' })
    }
  }

  const handleChangePersonaMoral = () => {
    if (checkMoral == true) {
      setCheckMoral(false),
        setCheckFisica(true),
        setForm({ ...form, tipoPersona: 'fisica' })
    } else {
      setCheckMoral(true),
        setCheckFisica(false),
        setForm({ ...form, tipoPersona: 'moral' })
    }
    setForm({ ...form, regimenFiscal: '' })
    setForm({ ...form, usoCFDI: '' })
    setOptionsUsoCFDI([])
  }

  const getColonias = async (codigoPostal: any) => {
    let colonias: any = null
    setForm({ ...form, estado: '', ciudad: '', colonia: '' })

    try {
      let url = `https://api.smartcloud.mx//v1/suc/catalogo/colonias?cp=${codigoPostal}&apikey=gwgbsXJZab30Rtw0Vly726ypnJLqPZrM`
      let config = {
        method: 'GET',
      }
      let res = await fetch(url, config)
      colonias = await res.json()
      setColonias(colonias)
    } catch (error) {
      console.log('Ocurrio un error al obtener estados', error)
      return false
    }

    if (colonias == null) {
      alert('Ocurrio un error al obtener colonias')
      return false
    }

    let options = []
    for (const fp of colonias) {
      options.push({ value: fp.nomcolonia, label: fp.nomcolonia })
    }
    setDropdownColonias(options)
    return true
  }

  const obtenerEstados = async () => {
    let estados: any = null
    try {
      let url =
        '/api/dataentities/EstadosV1/search?_fields=_all&_schema=mdv1&_sort=estado%20ASC'
      let config = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'X-VTEX-API-AppKey': AppKey,
          'X-VTEX-API-AppToken': AppToken,
          'REST-Range': 'resources=0-100',
        },
      }
      let res = await fetch(url, config)
      estados = await res.json()
    } catch (error) {
      console.log('Ocurrio un error al obtener estados', error)
      return false
    }

    if (estados == null) {
      alert('Ocurrio un error al obtener estados')
      return false
    }

    let options = []
    for (const fp of estados) {
      options.push({ value: fp.codEstado, label: fp.estado })
    }
    setDropdownEstados(options)
    return true
  }

  const handleChangeBilling = async () => {
    if (validarCaptcha() === false) {
      return false
    }

    if (validarFormularios() === false) {
      return false
    }
    setIsLoading(true)

    let orden = null
    try {
      let url = '/api/oms/pvt/orders/' + form.numeroPedido + '-01'
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
      let res = await fetch(url, config)
      orden = await res.json()
    } catch (error) {
      alert('Ocurrio un error al momento de procesar los datos')
      console.log(error)
      setIsLoading(false)
      return false
    }

    if (orden.error) {
      alert(
        'Orden no encontrada, verifique el numero de orden, ejemplo: 0000000000000'
      )
      setIsLoading(false)
      return false
    }

    let warehouseId = null
    if (orden.shippingData.logisticsInfo.length > 0) {
      if (orden.shippingData.logisticsInfo[0].deliveryIds.length > 0) {
        warehouseId =
          orden.shippingData.logisticsInfo[0].deliveryIds[0].warehouseId
      } else {
        alert(
          'No se encontro datos de la sucursal, contacte con el administrador del sistema'
        )
        return false
      }
    } else {
      alert(
        'No se encontro datos de la sucursal, contacte con el administrador del sistema'
      )
      return false
    }
    if (warehouseId == null) {
      alert(
        'No se encontro datos de la sucursal, contacte con el administrador del sistema'
      )
      return false
    }

    const fecha = new Date()

    let data: any = {}
    data = {
      TypePersona: form.tipoPersona,
      NumeroPedido: form.numeroPedido,
      RazonSocial: form.razonSocial,
      Name: form.nombre,
      PrimaryLastName: form.primerApellido,
      SecondLastName: form.segundoApellido,
      Email: form.correo,
      PhoneNumber: form.telefono,
      RegimenFiscal: form.regimenFiscal,
      CfdiUse: form.usoCFDI,
      Rfc: form.rfc,
      PaymentMethod: form.formaPago,
      Date: fecha,
      Street: form.calle,
      AddressNumber: form.numero,
      AddressNumberInterior: form.numeroInterior,
      BetweenStreets: form.BetweenStreets,
      PostalCode: form.codigoPostal,
      Suburb: form.colonia,
      City: form.ciudad,
      State: form.estado,
      Status: '1',
    }

    try {
      let url = `/api/dataentities/FacturacionV3/documents/?_schema=mdv1`
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

    FormClean()
    setIsLoading(false)
    setShowNotification(true)
    return false
  }

  const handleChangeForm = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget
    
    if(name === 'nombre' || name === 'primerApellido' || name === 'segundoApellido' || name === 'razonSocial' || name === 'rfc')
      setForm({ ...form, [name]: value.toUpperCase() })
    else
      setForm({ ...form, [name]: value })

    setIsReadOnly(false)
    if (name === 'rfc') {
      console.log(`RFC valido: ${rfcValido(value)}`)

      if (rfcValido(value) === false) {
        setErrorRFC('Ingresa un RFC valido')
      } else {
        setErrorRFC('')
      }
    }
  }

  let codigoPostal
  const handleChangeCodigoPostal = (e: any) => {
    codigoPostal = e.currentTarget.value
    setForm({ ...form, codigoPostal: codigoPostal })
    if (codigoPostal.length === 5) {
      setErrorCP('')
      getColonias(codigoPostal)
    } else {
      setErrorCP('Ingresa un código postal válido')
    }
  }

  const closeNotification = (flag: any) => {
    setShowNotification(flag)
    setShowNotifCaptcha(flag)
  }

  const handleChangeFormaPago = (value: any) => {
    let value1 = value['value']
    setForm({ ...form, ['formaPago']: value1 })
  }
  
  const handleChangeRegimenFiscal = (value: any) => {
    let valueRegimenFiscal = value['value'];
    setForm({ ...form, ['regimenFiscal']: valueRegimenFiscal });
    getCFDI(valueRegimenFiscal);
  }

  const handleChangeUsoCFDI = (value: any) => {
    let valueCFDI = value['value'];
    setForm({ ...form, ['usoCFDI']: valueCFDI });
  }

  const getCFDI = async (claveRegimenFiscal: any) => {
    let usoCFDI: any = null
    try {
      let urlUsoCFDI = `https://api.smartcloud.mx/v1/corpo/usocfdi?regimen=${claveRegimenFiscal}&apikey=IbPpK8RJwZ1OvG04wsAKD006MJQ193mP`;
      let resUsoCFDI = await fetch(urlUsoCFDI);
      usoCFDI = await resUsoCFDI.json();
    } catch (error) {
      console.log('Ocurrio un error al obtener estados', error)
      return false
    }

    let optionsCFDI = [];
    for (const cfdi of usoCFDI) {
      optionsCFDI.push({ value: cfdi.CLAVE, label: cfdi.DESCRIPCION })
    }
    setOptionsUsoCFDI(optionsCFDI);
    return true
  }

  const getRegimenFiscal = async () => {
    let razonRFFisica: any = null
    let razonRFMoral: any = null
    try {
      let urlRFFisica = 'https://api.smartcloud.mx/v1/corpo/regimen?persona=F&apikey=IbPpK8RJwZ1OvG04wsAKD006MJQ193mP';
      let resRFFisica = await fetch(urlRFFisica);
      razonRFFisica = await resRFFisica.json();
      let urlRFMoral = 'https://api.smartcloud.mx/v1/corpo/regimen?persona=M&apikey=IbPpK8RJwZ1OvG04wsAKD006MJQ193mP';
      let resRFMoral = await fetch(urlRFMoral);
      razonRFMoral = await resRFMoral.json();
    } catch (error) {
      console.log('Ocurrio un error al obtener estados', error)
      return false
    }

    let optionsFisica = [];
    let optionsMoral = [];
    for (const rf of razonRFFisica) {
      optionsFisica.push({ value: rf.CLAVE.toString(), label: rf.DESCRIPCION })
    }
    for (const rf of razonRFMoral) {
      optionsMoral.push({ value: rf.CLAVE.toString(), label: rf.DESCRIPCION })
    }
    setOptionsRFFisica(optionsFisica);
    setOptionsRFMoral(optionsMoral);

    return true
  }

  const getFormaPago = async () => {
    let formaPago = []

    try {
      let url = '/api/dataentities/FormasPagoV1/search?_fields=_all'
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
      let res = await fetch(url, config)
      formaPago = await res.json()
    } catch (error) {
      console.log('Ocurrio un error al obtener las formas de pago', error)
      return false
    }

    let options = []
    for (const fp of formaPago) {
      options.push({ value: fp.codigo, label: fp.descripcion })
    }
    setOptionsFormaPago(options)

    return false
  }

  const validarFormularios = () => {
    if (form.numeroPedido === '' || form.numeroPedido === null) {
      alert('Ingrese su numero de pedido')
      return false
    }

    if (
      (form.razonSocial === '' && checkMoral == true) ||
      (form.razonSocial === null && checkMoral == true)
    ) {
      alert('Ingrese la razon social')
      return false
    }
    if (validateRazonSocial(form.razonSocial)) {
      alert('Ingrese una razon social válida')
      return false
    }

    if (
      (form.nombre === '' && checkFisica == true) ||
      (form.nombre === null && checkFisica == true)
    ) {
      alert('Ingrese el nombre')
      return false
    }

    if (
      (form.primerApellido === '' && checkFisica == true) ||
      (form.primerApellido === null && checkFisica == true)
    ) {
      alert('Ingrese el apellido')
      return false
    }

    if (form.rfc === '' || form.rfc === null) {
      alert('Ingrese el RFC')
      return false
    }

    if (form.correo === '' || form.correo === null) {
      alert('Ingrese el correo electronico')
      return false
    }

    if (validateEmail(form.correo) === false) {
      alert('Ingrese el correo correctamente')
      return false
    }

    if (
      form.telefono === '' ||
      form.telefono === null ||
      form.telefono == '0'
    ) {
      alert('Ingrese el telefono')
      return false
    }

    if (form.calle === '' || form.calle === null) {
      alert('Ingrese la calle')
      return false
    }

    if (form.numero === '' || form.numero === null) {
      alert('Ingrese el numero')
      return false
    }

    if (form.codigoPostal === '' || form.codigoPostal === null) {
      alert('Ingrese el codigo postal')
      return false
    }

    let isNumber = /^[0-9]+$/
    if (!form.codigoPostal.match(isNumber)) {
      alert('El codigo postal debe de ser Numerico')
      return false
    }

    if (form.BetweenStreets === '' || form.BetweenStreets === null) {
      alert('Ingresa las entre calles de tu domicilio')
      return false
    }

    if (form.colonia === '' || form.colonia === null) {
      alert('Ingrese la colonia')
      return false
    }

    if (form.ciudad === '' || form.ciudad === null) {
      alert('Ingrese la ciudad')
      return false
    }

    if (form.estado === '' || form.estado === null) {
      alert('Seleccione el estado')
      return false
    }

    if (form.usoCFDI === '' || form.usoCFDI === null) {
      alert('Seleccione el uso de CFDI')
      return false
    }

    if (form.regimenFiscal === '' || form.regimenFiscal === null) {
      alert('Seleccione un Régimen Fiscal')
      return false
    }

    if (form.formaPago === '' || form.formaPago === null) {
      alert('Seleccione la forma de pago')
      return false
    }
    return true
  }

  const FormClean = () => {
    setForm({
      ...form,
      tipoPersona: '',
      numeroPedido: '',
      razonSocial: '',
      nombre: '',
      primerApellido: '',
      segundoApellido: '',
      correo: '',
      rfc: '',
      telefono: '',
      calle: '',
      estado: '',
      numero: '',
      numeroInterior: '',
      codigoPostal: '',
      colonia: '',
      ciudad: '',
      regimenFiscal: '',
      usoCFDI: '',
      formaPago: '',
      BetweenStreets: '',
    })
  }

  const validateRazonSocial = (razonSocial: any) => {
    const restricciones = ['S.A.', 'SA', 'S.', 'S', 'C.V.', 'CV', 'R.L.', 'RL'];
    const razonSocialSplit = razonSocial.split(" ");
    let encontrado = false;
    
    razonSocialSplit.map((optionRazonSocial:String) => {
      restricciones.map((restriccion:String) => {
        if(optionRazonSocial === restriccion) {
          encontrado = true;
        }
      });
    });

    console.log(encontrado);

    return encontrado;
  }

  const validateEmail = (email: any) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  const rfcValido = (rfc: string, aceptarGenerico = true) => {
    const re = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/
    var validado = rfc.match(re)

    if (!validado)
      // Coincide con el formato general del regex?
      return false

    // Separar el dígito verificador del resto del RFC
    const digitoVerificador = validado.pop(),
      rfcSinDigito = validado.slice(1).join(''),
      len = rfcSinDigito.length,
      // Obtener el digito esperado
      diccionario = '0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ',
      indice = len + 1
    var suma, digitoEsperado

    if (len == 12) suma = 0
    else suma = 481 // Ajuste para persona moral

    for (var i = 0; i < len; i++)
      suma += diccionario.indexOf(rfcSinDigito.charAt(i)) * (indice - i)
    digitoEsperado = 11 - (suma % 11)
    if (digitoEsperado == 11) digitoEsperado = 0
    else if (digitoEsperado == 10) digitoEsperado = 'A'

    // El dígito verificador coincide con el esperado?
    // o es un RFC Genérico (ventas a público general)?
    if (
      digitoVerificador != digitoEsperado &&
      (!aceptarGenerico || rfcSinDigito + digitoVerificador != 'XAXX010101000')
    )
      return false
    else if (
      !aceptarGenerico &&
      rfcSinDigito + digitoVerificador == 'XEXX010101000'
    )
      return false
    return rfcSinDigito + digitoVerificador
  }

  const seleccionarEstado = (estadoSeleccionado: any) => {
    setForm({ ...form, estado: estadoSeleccionado.seleccion })
  }

  const seleccionarColonia = (coloniaSeleccionada: any) => {
    setForm({
      ...form,
      colonia: coloniaSeleccionada.seleccion,
      ciudad: colonias[0].nomciudad,
      estado: colonias[0].nomestado,
    })
  }

  return (
    <FacturacionContainer
      handleChangeBilling={handleChangeBilling}
      showNotification={showNotification}
      handleChangeForm={handleChangeForm}
      handleChangeCodigoPostal={handleChangeCodigoPostal}
      handleChangeFormaPago={handleChangeFormaPago}
      handleChangeRegimenFiscal={handleChangeRegimenFiscal}
      handleChangeUsoCFDI={handleChangeUsoCFDI}
      closeNotification={closeNotification}
      seleccionarEstado={seleccionarEstado}
      handleChangePersonaFisica={handleChangePersonaFisica}
      handleChangePersonaMoral={handleChangePersonaMoral}
      checkMoral={checkMoral}
      checkFisica={checkFisica}
      errorRFC={errorRFC}
      form={form}
      optionsRFFisica={optionsRFFisica}
      optionsRFMoral={optionsRFMoral}
      optionsUsoCFDI={optionsUsoCFDI}
      optionsFormaPago={optionsFormaPago}
      dropdownEstados={dropdownEstados}
      dropdownColonias={dropdownColonias}
      isLoading={isLoading}
      setForm={setForm}
      rfcValido={rfcValido}
      setErrorRFC={setErrorRFC}
      isReadOnly={isReadOnly}
      setIsReadOnly={setIsReadOnly}
      errorCP={errorCP}
      handleCaptchaAnswer={handleCaptchaAnswer}
      createRandomNum={createRandomNum}
      captchaNumb={captchaNumb}
      showNotifCaptcha={showNotifCaptcha}
      seleccionarColonia={seleccionarColonia}
      colonias={colonias}
      codigoPostal={codigoPostal}
      getColonias={getColonias}
      setDropdownColonias={setDropdownColonias}
    />
  )
}

export default Facturacion

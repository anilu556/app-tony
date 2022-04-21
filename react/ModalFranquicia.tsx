//Este componente renderiza un modal que sirve para ingresar un CP o seleccionar una sucursal,
//dependiendo si el usuario quiere recoger el pedido o que se lo envien a domicilio, si se selecciona
//recoger en sucursal consulta la tabla Sucursales en Master Data, si se ingresa un CP para envio a
//domicilio se guarda en el state, en el localhost y se envia por api a vtex para disparar precios catalogos etc
//de la sucursal a la que se le este asignando el CP que ingreso el usuario

import React, { Component } from 'react'
// @ts-ignore
import { Modal, Button, Input, Dropdown } from 'vtex.styleguide'
// @ts-ignore
import style from './stylesModal.css'
import { AppKey, AppToken } from './keys'




interface IState {
  isModalOpen: any,
  formModal: {
    postalCode: any
  }
  btnPostalCode: boolean,
  postalCode: any,
  nowUsingSucursal: any
}

declare global {
  interface Window {
    localStorage: any;
  }
}

let codigoPostal;
let errorCodigoPostal: string;

class ModalFranquicia extends Component<any, any, IState>{

  constructor(props: any) {
    super(props)

    this.state = {
      mostrarDefault: true,
      isModalOpen: props.isModalOpen,
      formModal: {
        postalCode: ''
      },
      btnPostalCode: false,
      nowUsingPostalCode: null,
      nowUsingSucursal: null,
      activeDelivery: false,
      activePickUp: false,
      estado: '',
      postalCodeWillChangeTo: '',
      dropdownEstados: [],
      dropdownSucursales: [],
      data: [],
      nameSucursal: '',
      sucursalToBtn: ''
    }
    this.handleModalToggle = this.handleModalToggle.bind(this)
    this.handleConfirmation = this.handleConfirmation.bind(this)
    this.handleChangeFormModal = this.handleChangeFormModal.bind(this)
    this.handleSelectDelivery = this.handleSelectDelivery.bind(this)
    this.handleSelectPickup = this.handleSelectPickup.bind(this)
    this.sendPostalCode = this.sendPostalCode.bind(this)
    this.validateModal = this.validateModal.bind(this)
    this.obtenerEstados = this.obtenerEstados.bind(this)
    this.seleccionarEstado = this.seleccionarEstado.bind(this)
    this.seleccionarSucursal = this.seleccionarSucursal.bind(this)
    this.refresh = this.refresh.bind(this)
    this.cerrarBoton = this.cerrarBoton.bind(this)
    this.sendPostalCodeCloseButton = this.sendPostalCodeCloseButton.bind(this)
    


    

    setTimeout(() => {
      this.obtenerEstados();
    }, 1000);

  }

  cerrarBoton() {
    this.setState({
        //mostrarDefault: false,
        isModalOpen: false,
        "postalCode": this.state.formModal.postalCode = 91800
        
      }, () => (
        this.sendPostalCodeCloseButton()
      ))
  }
  

  async componentDidMount() {
    // alert('1')
    this.validateModal()
  }

  handleModalToggle() {
    this.setState({ isModalOpen: !this.state.isModalOpen })
  }

  handleConfirmation() {
    this.handleModalToggle()
  }

  validateModal() {
    this.setState({
      nowUsingPostalCode: window.localStorage.getItem('codigoPostal'),
      nowUsingSucursal: window.localStorage.getItem('nameSucursal')

    })
    if (window.localStorage.getItem('codigoPostal') === undefined || window.localStorage.getItem("codigoPostal") == null) {
      this.setState({ isModalOpen: true, mostrarDefault: true })
    }
    else {
      this.setState({ isModalOpen: false, mostrarDefault: false })
    }
  }

  handleSelectDelivery = () => {
    this.setState({ activeDelivery: !this.state.activeDelivery });
  }

  handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      this.sendPostalCode();
    }
  }


  handleSelectPickup = () => {
    this.setState({ activePickUp: !this.state.activePickUp });
  }
  refresh = () => {
    this.setState({
      activeDelivery: false,
      activePickUp: false,
      estado: '',
      postalCodeWillChangeTo: '',
      nameSucursal: ''
    })
  }

  async seleccionarEstado(estadoSeleccionado: any) {
    let { dropdownSucursales } = this.state
    dropdownSucursales = [];

    const estadoBuscar = this.state.data.find((d: any) => d.nombreEstado == estadoSeleccionado.seleccion);

    estadoBuscar.sucursales.forEach((s: any) => {
      if (!dropdownSucursales.find((buscar: any) => buscar.value == s.nombreSucursal)) {
        dropdownSucursales.push({ label: s.nombreSucursal, value: s.nombreSucursal })
      }
    })
    this.setState({
      estado: estadoSeleccionado.seleccion,
      dropdownSucursales
    });
  }

  async seleccionarSucursal(sucursalSeleccionada: any) {
    let suc: any = null
    try {
      const url = `/api/dataentities/tablaSucursalesV4/search?_schema=mdv1&_keyword=${this.state.estado}`
      let config = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'X-VTEX-API-AppKey': AppKey,
          'X-VTEX-API-AppToken': AppToken,
          'REST-Range': 'resources=0-100'
        },
      }
      let res = await fetch(url, config)
      suc = await res.json()
      function b(idToSearch: any) {
        return suc[0].sucursales.filter((item: { nombreSucursal: any }) => {
          return item.nombreSucursal === idToSearch
        })
      };
      let sucSelect: any
      sucSelect = b(sucursalSeleccionada.seleccion)
      this.setState({
        nameSucursal: sucSelect[0].nombreSucursal,
        postalCodeWillChangeTo: `Suc: ${sucSelect[0].nombreSucursal.trim()}, CP: ${sucSelect[0].codigoPostal.trim()}`,
        formModal: { postalCode: sucSelect[0].codigoPostal.trim() },
        sucursalToBtn: sucSelect[0].nombreSucursal
      })
    } catch (error) {
      console.log('Ocurrio un error al obtener sucursal', error)
      return false;
    }
    if (suc == null) {
      alert('Ocurrio un error al obtener sucursal')
      return false
    }
    return true
  }

  async handleChangeFormModal(e: React.FormEvent<HTMLInputElement>) {
    const { name, value } = e.currentTarget;
    codigoPostal = e.currentTarget.value
    this.setState({
      ...this.state,
      formModal: { ...this.state.formModal, [name]: value }
    });
    if (codigoPostal.length !== 5) {
      errorCodigoPostal = "Ingresa un código postal válido de 5 digitos."
    } else {
      errorCodigoPostal = ""
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async obtenerEstados() {
    let estados: any = null
    try {
      const url = "/api/dataentities/tablaSucursalesV4/search?_schema=mdv1"
      let config = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'X-VTEX-API-AppKey': AppKey,
          'X-VTEX-API-AppToken': AppToken,
          'REST-Range': 'resources=0-100'
        },
      }
      let res = await fetch(url, config)
      estados = await res.json()
    } catch (error) {
      console.log('Ocurrio un error al obtener estados', error)
      return false;
    }
    if (estados == null) {
      alert('Ocurrio un error al obtener estados')
      return false
    }
    for (let i = 0; i < estados.length; i++) {
      let data: any = {}
      data = {
        "value": estados[i].nombreEstado,
        "label": estados[i].nombreEstado
      };
      this.setState({
        dropdownEstados: this.state.dropdownEstados?.concat(data),
        data: estados
      })
    }
    return true
  }


  async sendPostalCodeCloseButton() {

    // if (this.state.formModal.postalCode === '' || this.state.formModal.postalCode === null || this.state.formModal.postalCode === 0) {
    //   alert('Ocurrio un error no se pudo obtener el Código Postal asignado, Por favor vuelve a intentarlo');
      
    //   return false;
    // }

    //  if (this.state.formModal.postalCode.length !== 5 && this.state.formModal.postalCode.length !== 0 ){
    //    alert('Ingresa tu Código Postal correctamente')
    //    return false;
    //  }

    this.setState({
      btnPostalCode: true
    })

    const data: any = {
      "items": [
        {
          "id": "5636",
          "quantity": 1,
          "seller": "1"
        }
      ],
      "postalCode": this.state.formModal.postalCode,
      "country": "MEX"
    }


    try {
      var urlSimulation = '/api/checkout/pub/orderforms/simulation';
      let config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-VTEX-API-AppKey': AppKey,
          'X-VTEX-API-AppToken': AppToken
        },
        body: JSON.stringify(data)
      }
      let response = await fetch(urlSimulation, config)
      var simulation = await response.json()

    } catch (error) {
      return false;
    }

    var franquicia = '';

    loop1:
    for (var i = 0; i < simulation.items.length; ++i) {
      loop2:
      for (var j = 0; j < simulation.items[i].sellerChain.length; ++j) {
        if (simulation.items[i].sellerChain[j] != "1") {
          franquicia = simulation.items[i].sellerChain[j]
          break loop1
        }
      }
    }
    console.log(simulation)

    localStorage.setItem('codigoPostal', this.state.formModal.postalCode);
    if (this.state.nameSucursal === '' || null) {
      localStorage.setItem('nameSucursal', `Envíar al C.P.: ${this.state.formModal.postalCode}`);
    } else {
      localStorage.setItem('nameSucursal', this.state.nameSucursal);
    }


    if (simulation.items.length === 0) {
      localStorage.setItem('codigoPostal', this.state.formModal.postalCode);
      if (this.state.nameSucursal === '' || null) {
        localStorage.setItem('nameSucursal', `Envíar al C.P.: ${this.state.formModal.postalCode}`);
      } else {
        localStorage.setItem('nameSucursal', this.state.nameSucursal);
      }
      window.location.reload()
      return false
    }


    // var nameFranquicia : any = ''
    var country: any = ''
    if (franquicia == '') {
      // nameFranquicia = window.btoa(this.state.formModal.postalCode)
      country = 'MX'

    }
    else {
      // nameFranquicia = window.btoa('SW#'+ franquicia)
      country = 'MEX'
    }


    const url = '/api/sessions';
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        public: {
          country: {
            value: country
          },
          postalCode: {
            value: this.state.formModal.postalCode
          }
        }
      })
    }

    fetch(url, options)
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('codigoPostal', this.state.formModal.postalCode);
        if (this.state.nameSucursal === "" || this.state.nameSucursal === null) {
          localStorage.setItem('nameSucursal', `Envíar al CP: ${this.state.formModal.postalCode}`);
        } else {
          localStorage.setItem('nameSucursal', this.state.nameSucursal);
        }

        console.log(json);
        window.location.reload()
      })
      .catch(err => console.error('error:' + err));
    return true;

  }


  async sendPostalCode() {

    if (this.state.formModal.postalCode === '' || this.state.formModal.postalCode === null || this.state.formModal.postalCode === 0) {
      alert('Ocurrio un error no se pudo obtener el Código Postal asignado, Por favor vuelve a intentarlo');
      
      return false;
    }

     if (this.state.formModal.postalCode.length !== 5 && this.state.formModal.postalCode.length !== 0 ){
       alert('Ingresa tu Código Postal correctamente')
       return false;
     }

    this.setState({
      btnPostalCode: true
    })

    const data: any = {
      "items": [
        {
          "id": "5636",
          "quantity": 1,
          "seller": "1"
        }
      ],
      "postalCode": this.state.formModal.postalCode,
      "country": "MEX"
    }


    try {
      var urlSimulation = '/api/checkout/pub/orderforms/simulation';
      let config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-VTEX-API-AppKey': AppKey,
          'X-VTEX-API-AppToken': AppToken
        },
        body: JSON.stringify(data)
      }
      let response = await fetch(urlSimulation, config)
      var simulation = await response.json()

    } catch (error) {
      return false;
    }

    var franquicia = '';

    loop1:
    for (var i = 0; i < simulation.items.length; ++i) {
      loop2:
      for (var j = 0; j < simulation.items[i].sellerChain.length; ++j) {
        if (simulation.items[i].sellerChain[j] != "1") {
          franquicia = simulation.items[i].sellerChain[j]
          break loop1
        }
      }
    }
    console.log(simulation)

    localStorage.setItem('codigoPostal', this.state.formModal.postalCode);
    if (this.state.nameSucursal === '' || null) {
      localStorage.setItem('nameSucursal', `Envíar al C.P.: ${this.state.formModal.postalCode}`);
    } else {
      localStorage.setItem('nameSucursal', this.state.nameSucursal);
    }


    if (simulation.items.length === 0) {
      localStorage.setItem('codigoPostal', this.state.formModal.postalCode);
      if (this.state.nameSucursal === '' || null) {
        localStorage.setItem('nameSucursal', `Envíar al C.P.: ${this.state.formModal.postalCode}`);
      } else {
        localStorage.setItem('nameSucursal', this.state.nameSucursal);
      }
      window.location.reload()
      return false
    }


    // var nameFranquicia : any = ''
    var country: any = ''
    if (franquicia == '') {
      // nameFranquicia = window.btoa(this.state.formModal.postalCode)
      country = 'MX'

    }
    else {
      // nameFranquicia = window.btoa('SW#'+ franquicia)
      country = 'MEX'
    }


    const url = '/api/sessions';
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        public: {
          country: {
            value: country
          },
          postalCode: {
            value: this.state.formModal.postalCode
          }
        }
      })
    }

    fetch(url, options)
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('codigoPostal', this.state.formModal.postalCode);
        if (this.state.nameSucursal === "" || this.state.nameSucursal === null) {
          localStorage.setItem('nameSucursal', `Envíar al CP: ${this.state.formModal.postalCode}`);
        } else {
          localStorage.setItem('nameSucursal', this.state.nameSucursal);
        }

        console.log(json);
        window.location.reload()
      })
      .catch(err => console.error('error:' + err));
    return true;

  }
   render() {
    var closeModal = false;

    return (
      <React.Fragment>
        {
          
          this.props.isModalOpen === undefined ?
            closeModal = false
            :
            closeModal = true
            
        }
        <Modal
          centered
          isOpen={this.props.isModalOpen !== undefined ? this.props.isModalOpen : this.state.isModalOpen}
          onClose={() => { this.props.closeModal(); this.refresh() }}
          showCloseIcon={closeModal}>
          <div className={style.Modal}>
            
          {
              this.state.mostrarDefault ?
                
          

          <div className="boton-cerrar-modal" style={{ position: 'absolute', right: '21px', top: '23px', display: this.state.mostrarDefault}}>
            <button 
            style={{

              backgroundColor: 'Transparent',
              border: 'none',
              cursor:'pointer',
              overflow: 'hidden'
            
            }}
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={this.cerrarBoton}
            >
            <span aria-hidden="true">&#x2716;</span>
            </button>
                </div> :
                <div></div>
                
                
          }



            {/* Form Delivery input postal code */}
            <div className="cp">
              <h4 className={style.descriptionModal}>
                Ingresa tu código postal para ofrecerte un mejor servicio de entrega.
              </h4>
              <div className="flex">
                <div className={style.containerInputModal}>
                  <div className="mb5" id="inputCont">
                    <Input type="number"
                      maxLength={5}
                      placeholder="CP de 5 dígitos"
                      name="postalCode"
                      value={this.state.formModal.postalCode}
                      onChange={this.handleChangeFormModal}
                      errorMessage={errorCodigoPostal}
                      onKeyDown={this.handleKeyDown}
                    />
                  </div>
                  <div className={`mb5 btnEnviar`}>
                    <Button variation="primary"
                      onClick={this.sendPostalCode}
                      isLoading={this.state.btnPostalCode}>
                      Aceptar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    )
  }
}

export default ModalFranquicia

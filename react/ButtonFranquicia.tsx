//Este componente renderiza un boton que sirve como trigger para lanzar el modal de direcciones,
//tambien consulta el estado del modal para revisar si existe algun CP o sucursal seleccionada

import  React, { Component } from 'react'
// @ts-ignore
import style from './stylesModal.css'
import ModalFranquicia from './ModalFranquicia'

declare global {
    interface Window {
        localStorage:any;
    }
}

interface IState {
    postalCode : any,
    isModalOpen : boolean,
    nowUsingSucursal : any
}

class ButtonFranquicia extends Component<IState, IState>{

	constructor(props: any){
    super(props)
    this.state = {postalCode : null, isModalOpen : false, nowUsingSucursal : 'Ubicar sucursales'}
    this.changePostalCode = this.changePostalCode.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }


    async changePostalCode(){
      this.setState({ isModalOpen : true })
      console.log(this.state)
    }

    async componentDidMount(){
      this.setState({
      	postalCode : window.localStorage.getItem('codigoPostal'),
        nowUsingSucursal : window.localStorage.getItem('nameSucursal')
      })
    }

    closeModal(){
        this.setState({ isModalOpen : false })
    }

    render(){
    	return (
            <React.Fragment>
            	{
            			this.state.postalCode !== null && this.state.postalCode !== undefined  ?
            			<button
                    onClick={this.changePostalCode}
                    className={style.buttonPostalCode}>
                    <img src={"/arquivos/pointer-mobile1.png"} alt="📍&nbsp;"/>
                    {this.state.nowUsingSucursal == '' ? 'Ubicar sucursales' : this.state.nowUsingSucursal}
                  </button>
            		:
            			null
            		}

                  <ModalFranquicia isModalOpen={this.state.isModalOpen}  closeModal = {this.closeModal}/>
            </React.Fragment>
        )
    }

}

export default ButtonFranquicia

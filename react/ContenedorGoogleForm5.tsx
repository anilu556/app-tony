import  React, { useEffect, useState } from 'react'
import { AppKey, AppToken } from './keys'

const ContenedorGoogleForm5 = ()=> {

  useEffect(() => {
    getCodigoFormulario()
  }, [])

  const [codigo, setCodigo] = useState('')

  let usarCodigo

  const getCodigoFormulario = async () => {
    let codigosEmbeb = []

    try {
      let url = '/api/dataentities/FormulariosEmbeb/search?_schema=mdv1'
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
      codigosEmbeb = await res.json()

    } catch (error) {
      console.log('Ocurrio un error al obtener las formas de pago', error)
      return false
    }

    usarCodigo = codigosEmbeb[4].CodigoFormulario
    setCodigo(usarCodigo)

    return false
  }

  return (

    <div className={`vtex-flex-layout-0-x-container-embedForm`} dangerouslySetInnerHTML={{__html: codigo}}></div>

  )
}


export default ContenedorGoogleForm5

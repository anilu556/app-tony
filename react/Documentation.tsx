import React, { useState, useEffect } from 'react'
import { useProduct } from 'vtex.product-context'
import { Link } from 'vtex.styleguide'

interface FichaTecnicaProps {
  dataSheetText: string
}

const FichaTecnica: StorefrontFunctionComponent<FichaTecnicaProps> = ({dataSheetText}) => {
  const productContextValue = useProduct();
  const [ficha, setFicha] = useState();

  const getOnlyFicha = () => {
    if(productContextValue?.product?.properties){
      const element = productContextValue?.product?.properties.find((p:any) => p.name == "ficha")
      if(element && element.values[0]){
        setFicha(element.values[0])
        return
      }
    }
  }


  useEffect(() => {
    getOnlyFicha()
    // console.log("QUEPASA: ", dataSheetText)
  }, [productContextValue]);

  return ficha ? <div className="fichaTecnicaContainerCustom">
                  <Link href={ficha} target="_blank" class="logoFicha" >
                    <img height="120" width="120" src="/arquivos/logoFicha.svg" />
                  </Link>
                  <span className="fichaTecnicaTextCustom">{dataSheetText}</span>
                </div>
              :
                <div></div>;
}

FichaTecnica.schema = {
  title: 'Data sheet',
  description: 'Data sheet',
  type: 'object',
  properties: {
    dataSheetText: {
      title: 'Text of the data sheet',
      description: 'Text to be displayed in the data sheet',
      type: 'string',
      default: "Descargar Ficha Técnica",
    },
  },
}


export default FichaTecnica

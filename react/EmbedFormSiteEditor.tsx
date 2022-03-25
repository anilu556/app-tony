import React from 'react';


interface TestProps {
  code: string
}

const Test : StorefrontFunctionComponent<TestProps> = ({code})=> {


  return code? <div className={`vtex-flex-layout-0-x-container-embedForm`} dangerouslySetInnerHTML={{__html: code}}></div> : <div>Inspeccionar en Site Editor para agregar código de formulario a embeber</div>

}

Test.schema = {
  title: 'Render code',
  description: 'Render embeded code',
  type: 'object',
  properties: {
    code: {
      title: 'code',
      description: 'Code to be rendered',
      type: 'string',
      default: null,
    },
  },
}

export default Test

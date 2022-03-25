import React from 'react'
// @ts-ignore
import { Input, Button, Alert } from 'vtex.styleguide'
// @ts-ignore
import styles from '../styles.css'

const Captcha = ({createRandomNum, captchaNumb, handleCaptchaAnswer, isLoading, closeNotification, showNotifCaptcha} : {createRandomNum:any, captchaNumb:any, handleCaptchaAnswer:any, isLoading:any, closeNotification:any, showNotifCaptcha:any}) => {
  return (
    <>

          <p className={styles.captchaTit}>No soy un robot</p>
          <div className={`${styles.captchaCont} vtex-flex-layout-0-x-boton-captcha-container`}>

              <Input  size="Small"
                      name="a"
                      readOnly={true}
                      value={captchaNumb.a}
              />
              <p className={styles.signo}>+</p>
              <Input  size="Small"
                      name="b"
                      readOnly={true}
                      value={captchaNumb.b}
              />
              <p className={styles.signo}>=</p>
              <Input  placeholder="?"
                      size="Small"
                      name="c"
                      value={captchaNumb.c}
                      onChange={handleCaptchaAnswer}
              />

          </div>
          <div className="vtex-flex-layout-0-x-boton-captcha-btncontainer">
            <Button variation="primary"
                    block
                    onClick={createRandomNum}
                    isLoading={isLoading} >
              Actualizar Captcha
            </Button>
          </div>

          { showNotifCaptcha ?
            <div className='animate__animated animate__fadeInUp'>
              <Alert type="error" onClose={() => closeNotification(false)}>
              Respuesta equivocada / Debes contestar correctamente
              </Alert><br />
            </div>
              : null
          }

    </>
  )
}

export default Captcha

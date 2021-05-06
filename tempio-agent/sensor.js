'use strict'

const RFID = require('mfrc522-rpi')
const SoftSPI = require('rpi-softspi')
const MLX90614 = require('mlx90614')
// const GPIO = require('onoff').Gpio
// const LED = new GPIO(4, 'out')

const { constants } = require('./utils')
const { PIN } = constants

const softSPI = new SoftSPI({
  clock: PIN.CLOCK,
  mosi: PIN.MOSI,
  miso: PIN.MISO,
  client: PIN.CLIENT
})

const rfid = new RFID(softSPI)
  .setResetPin(PIN.RESET)
  .setBuzzerPin(PIN.BUZZER)

const mlx90614 = new MLX90614()
// LED.writeSync(0)

module.exports = (interval, cb) => {
  const timer = setInterval(function() {
    rfid.reset()
  
    const { status } = rfid.findCard()
  
    if (!status) return
   
    const response = rfid.getUid()
  
    if (!response.status) {
      cb('UID scan error')
      return
    }
  
    // LED.writeSync(1)
  
    const uid = response.data.reduce((acc, cur, i) => 
      acc += (i <= 3 ? cur.toString(16) : '')
    , '')
  
    mlx90614.readObject((err, temp) => {
      if (err) {
        cb(err)
        return
      }

      cb(null, { id: uid.toUpperCase(), temp }, timer)
    })
  
    // LED.writeSync(0)
    rfid.stopCrypto()
  }, interval)
}

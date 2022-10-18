const isNormal = document.querySelector('#normality');

const button = document.querySelector('#connect');
button.onclick = () => {connectBluetooth()};

const connectBluetooth = () => {
  navigator.bluetooth.requestDevice({ 
    filters: [{ 
      services: [0x1234, 0x12345678, '99999999-0000-1000-8000-00805f9b34fb'] // insert bluetooth UUID
    }] 
  })
  .then(device = device.gatt.connect())
  .then(server => {
    // Getting Binary Sensor Service…
    return server.getPrimaryService('binary_sensor_service');
  })
  .then(service => {
    // Getting Sensor Status Characteristic…
    return service.getCharacteristic('sensor_status');
  })
  .then(characteristic => {
    // Reading Sensor Status…
    return characteristic.readValue();
  })
  .then(value => {
    console.log(`Sensor Value: ${value.getUint8(0)}`);
  })
  .catch(error => { console.error(error); });
}

const connectBattery = () => {
  navigator.bluetooth.requestDevice({ filters: [{ services: ['binary_sensor_service'] }] })
  .then(device => device.gatt.connect())
  .then(server => {
    // Getting Battery Service…
    return server.getPrimaryService('binary_sensor_service');
  })
  .then(service => {
    // Getting Battery Level Characteristic…
    return service.getCharacteristic('sensor_status');
  })
  .then(characteristic => {
    // Reading Battery Level…
    return characteristic.readValue();
  })
  .then(value => {
    console.log(`Data Value: ${value.getUint8(0)}`);
  })
  .catch(error => { console.error(error); });
}

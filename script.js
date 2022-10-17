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
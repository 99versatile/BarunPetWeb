const isNormal = document.querySelector('#normality');

const button = document.querySelector('#connect');
var serviceCh = null;
button.onclick = () => {
  connectBluetooth();
  getSensorStatus(serviceCh);
};

const connectBluetooth = () => {
  navigator.bluetooth.requestDevice({ 
    filters: [{ 
      services: ["19b10000-e8f2-537e-4f6c-d104768a1214"]  // insert bluetooth UUID
    }]
  })
  .then(device => device.gatt.connect())
  .then(server => {
    return server.getPrimaryService("19b10000-e8f2-537e-4f6c-d104768a1214");
  })
  .then(service => {
    serviceCh = service;
  })
}

const getSensorStatus = (service) => {
  service.getCharacteristic("19b10001-e8f2-537e-4f6c-d104768a1214")
  .then(characteristic => {
    // Reading Sensor Status
    return characteristic.readValue();
  })
  .then(value => {
    console.log(value.getuint8(byteoffset)); //for문 돌려서 자릿수에 해당하는 데이터 array에 채워주기
  })
  .catch(error => { console.error(error); });
}





const connectBattery = () => {
  navigator.bluetooth.requestDevice({ filters: [{ services: ['binary_sensor_service'] }] })
  .then(device => device.gatt.connect())
  .then(server => {
    // Getting Battery Service
    return server.getPrimaryService('binary_sensor_service');
  })
  .then(service => {
    // Getting Battery Level Characteristic
    return service.getCharacteristic('sensor_status');
  })
  .then(characteristic => {
    // Reading Battery Level
    return characteristic.readValue();
  })
  .then(value => {
    console.log(`Data Value: ${value.getUint8(0)}`);
  })
  .catch(error => { console.error(error); });
}

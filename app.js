const serviceUUID = "19b10000-e8f2-537e-4f6c-d104768a1214";
const characteristicID = "19b10001-e8f2-537e-4f6c-d104768a1214";
var characteristicBuffer = null;

const FH = 500.0;
const list = [];
const chartData = { accX: [], accY: [], accZ: [], gyroX: [], gyroY: [], gyroZ: [], roll: [], pitch: [], yaw: [] }
/*
const angleX = [];
const angleY = [];
const accX = [];
const accY = [];
const accZ = [];
const velX = [];
const velY = [];
const velZ = [];
*/

const maxlength = 72;
const typeNum = 9;

const buffer = new ArrayBuffer(maxlength);

const isNormal = document.querySelector('#normality');

const button = document.querySelector('#connect');
var serviceCh = null;
var dataValue = null;

button.onclick = () => {
  connectBluetooth();
  setInterval(dataManagement, 2000, characteristicBuffer, buffer, list, chartData);
  //bufferToList(buffer, list);
  //listToChart(list, chartData);
};


const connectBluetooth = () => {
  navigator.bluetooth.requestDevice({
    filters: [{ 
      services: [serviceUUID]  // insert bluetooth UUID
    }]
  })
  .then(device => device.gatt.connect())
  .then(server => {
    return server.getPrimaryService(serviceUUID);
  })
  .then(service => {
    return service.getCharacteristic(characteristicID);
  })
  .then(characteristic => {
    // Reading Sensor Status
    characteristicBuffer = characteristic;
  })
}


const readCharValue = (characteristicBuffer) => {
  if (characteristicBuffer != null) {
    return characteristicBuffer.readValue()
    .then(value => {
      valueToBuffer(value, buffer);
    })
    .catch(error => { console.error(error); });
  }
  else {
  }
}

let c = 0;

const valueToBuffer = (value, buffer) => {
  for (let c = 0; c < maxlength; c++) {
    buffer[c] = (value.getUint8(c) - 48);
  }
  console.log(buffer);
}

let a = 0;
let b = 0;

const bufferToList = (buffer, list) => {
  for (a = 0; a < (maxlength)/4; a++) {
    list[a] = parseFloat(buffer[4*a]*100.0 + buffer[4*a+1]*10.0 + buffer[4*a+2]*1.0 + buffer[4*a+3]*0.1) - FH;
  }
  console.log(list);
}

const listToChart = (list, chartData) => {
  let i = 0;
  for (const key in chartData) {
    for (b = 0; b < ((maxlength)/4)/(typeNum); b++) {
      chartData[key].push(list[b*(typeNum) + i]);
    }
    i = i+1;
  }
  console.log(chartData);
}

const Labels = (dt) => {
  let labelIndex = 0;
  let labels = [];

  labelIndex = Math.min(dt.length, 48);
  for (let i = 0; i < labelIndex; i++) {
    labels.push(`${i}`);
  }
  return labels
}

const data1 = (chartData) => {
  if (chartData.accX.length > 50) {
    chartData.accX.splice(0, chartData.accX.length - 50);
    chartData.accY.splice(0, chartData.accY.length - 50);
    chartData.accZ.splice(0, chartData.accZ.length - 50);
  }
  return {
    labels: Labels(chartData.accX),
    datasets: [
      {
        label: 'accX',
        data: chartData.accX, //파싱해서 불러온 데이터 list
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgb(255, 99, 132)',
        yAxisID: 'y1',
      },
      {
        label: 'accY',
        data: chartData.accY, //파싱해서 불러온 데이터 list
        borderColor: 'rgb(141, 214, 255)',
        backgroundColor: 'rgb(141, 214, 255)',
        yAxisID: 'y2',
      },
      {
        label: 'accZ',
        data: chartData.accZ, //파싱해서 불러온 데이터 list
        borderColor: 'rgb(214, 255, 141)',
        backgroundColor: 'rgb(214, 255, 141)',
        yAxisID: 'y3',
      }
    ]
  }
};


const data2 = (chartData) => {
  if (chartData.gyroX.length > 50) {
    chartData.gyroX.splice(0, chartData.gyroX.length - 50);
    chartData.gyroY.splice(0, chartData.gyroY.length - 50);
    chartData.gyroZ.splice(0, chartData.gyroZ.length - 50);
  }
  return {
    labels: Labels(chartData.gyroX),
    datasets: [
      {
        label: 'gyroX',
        data: chartData.gyroX, //파싱해서 불러온 데이터 list
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgb(255, 99, 132)',
        yAxisID: 'y1',
      },
      {
        label: 'gyroY',
        data: chartData.gyroY, //파싱해서 불러온 데이터 list
        borderColor: 'rgb(141, 214, 255)',
        backgroundColor: 'rgb(141, 214, 255)',
        yAxisID: 'y2',
      },
      {
        label: 'gyroZ',
        data: chartData.gyroZ, //파싱해서 불러온 데이터 list
        borderColor: 'rgb(214, 255, 141)',
        backgroundColor: 'rgb(214, 255, 141)',
        yAxisID: 'y3',
      }
    ]
  }
};


const data3 = (chartData) => {
  if (chartData.roll.length > 50) {
    chartData.roll.splice(0, chartData.roll.length - 50);
    chartData.pitch.splice(0, chartData.pitch.length - 50);
    chartData.yaw.splice(0, chartData.yaw.length - 50);
  }
  return {
    labels: Labels(chartData.roll),
    datasets: [
      {
        label: 'roll',
        data: chartData.roll, //파싱해서 불러온 데이터 list
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgb(255, 99, 132)',
        yAxisID: 'y1',
      },
      {
        label: 'pitch',
        data: chartData.pitch, //파싱해서 불러온 데이터 list
        borderColor: 'rgb(141, 214, 255)',
        backgroundColor: 'rgb(141, 214, 255)',
        yAxisID: 'y2',
      },
      {
        label: 'yaw',
        data: chartData.yaw, //파싱해서 불러온 데이터 list
        borderColor: 'rgb(214, 255, 141)',
        backgroundColor: 'rgb(214, 255, 141)',
        yAxisID: 'y3',
      }
    ]
  }
};


const ctx1 = document.getElementById('Acc').getContext('2d');
const ctx2 = document.getElementById('Gyro').getContext('2d');
const ctx3 = document.getElementById('RPY').getContext('2d');

let myChart1 = null;
let myChart2 = null;
let myChart3 = null;


const dataManagement = (characteristicBuffer, buffer, list, chartData) => {
  readCharValue(characteristicBuffer);
  bufferToList(buffer, list);
  listToChart(list, chartData);

  let config1 = {
    type: 'line',
    data: data1(chartData),
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      stacked: false,
      plugins: {
        title: {
          display: true,
          text: 'IMU Accelerator Sensor'
        }
      },
      scales: {
        y1: {
          type: 'linear',
          display: true,
          position: 'left',
        },
        y2: {
          type: 'linear',
          display: true,
          position: 'left',
  
          // grid line settings
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
        },
        y3: {
          type: 'linear',
          display: true,
          position: 'right',
  
          // grid line settings
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
        },
      }
    },
  };
  
  
  let config2 = {
    type: 'line',
    data: data2(chartData),
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      stacked: false,
      plugins: {
        title: {
          display: true,
          text: 'IMU GYRO Sensor'
        }
      },
      scales: {
        y1: {
          type: 'linear',
          display: true,
          position: 'left',
        },
        y2: {
          type: 'linear',
          display: true,
          position: 'left',
  
          // grid line settings
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
        },
        y3: {
          type: 'linear',
          display: true,
          position: 'right',
  
          // grid line settings
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
        },
      }
    },
  };
  
  
  let config3 = {
    type: 'line',
    data: data3(chartData),
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      stacked: false,
      plugins: {
        title: {
          display: true,
          text: 'ROLL-PITCH-YAW'
        }
      },
      scales: {
        y1: {
          type: 'linear',
          display: true,
          position: 'left',
        },
        y2: {
          type: 'linear',
          display: true,
          position: 'left',
  
          // grid line settings
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
        },
        y3: {
          type: 'linear',
          display: true,
          position: 'right',
  
          // grid line settings
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
        },
      }
    },
  };
  if (myChart1 != null) {
    myChart1.destroy();
  }
  if (myChart2 != null) {
    myChart2.destroy();
  }
  if (myChart3 != null) {
    myChart3.destroy();
  }
    
    
  
  myChart1 = new Chart(
    ctx1,
    config1
  );

  myChart2 = new Chart(
    ctx2,
    config2
  );

  myChart3 = new Chart(
    ctx3,
    config3
  );

}

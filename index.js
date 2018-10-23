const mqtt = require('mqtt');
const Gpio = require('onoff').Gpio;

const GPIO_PIN = 12;
const DIRECTION = 'in';
const EDGE = 'both';
const pir = new Gpio(GPIO_PIN, DIRECTION, EDGE);
const client = mqtt.connect('mqtt://192.168.0.135', {
  port: 1883,
  clientId: 'office-pir',
});

const exit = () => {
  pir.unexport();
  process.exit();
}

pir.watch((err, value) => {
  if (err) {
    console.log('Oops...', err);
    exit();
  }
  value ? console.log('Motion detected!') : console.log('All is clear now.');
  const stringifiedValue = JSON.stringify({ value, date: new Date().getTime() });
  client.publish('jidoka/office/motion', stringifiedValue, { retain: true });
});


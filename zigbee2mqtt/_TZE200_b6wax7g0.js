// Название: Girier Zigbee Mini Smart Switch
// Модель: JR-ZDS01
// modelID: TS0001
// manufacturerName: _TZ3000_majwnphg

const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/extend');
const e = exposes.presets;
const ea = exposes.access;

const definition = {
        fingerprint: [{modelID: 'TS0601', manufacturerName: '_TZE200_b6wax7g0'}],
        model: 'BRT-100-TRV',
        vendor: 'Moes',
        description: 'Thermostatic radiator valve',
        ota: ota.zigbeeOTA,
        onEvent: tuya.onEventSetLocalTime,
        fromZigbee: [fz.ignore_basic_report, fz.ignore_tuya_set_time, fz.moesS_thermostat],
        toZigbee: [tz.moesS_thermostat_current_heating_setpoint, tz.moesS_thermostat_child_lock,
            tz.moesS_thermostat_window_detection, tz.moesS_thermostat_temperature_calibration,
            tz.moesS_thermostat_boost_heating, tz.moesS_thermostat_boostHeatingCountdownTimeSet,
            tz.moesS_thermostat_eco_temperature, tz.moesS_thermostat_max_temperature,
            tz.moesS_thermostat_min_temperature, tz.moesS_thermostat_moesSecoMode,
            tz.moesS_thermostat_preset, tz.moesS_thermostat_schedule_programming,
            tz.moesS_thermostat_system_mode],
        exposes: [
            e.battery(), e.child_lock(), e.eco_mode(),
            e.eco_temperature().withValueMin(5), e.max_temperature().withValueMax(45), e.min_temperature().withValueMin(5),
            e.valve_state(), e.position(), e.window_detection(),
            exposes.binary('window', ea.STATE, 'OPEN', 'CLOSED').withDescription('Window status closed or open '),
            exposes.climate()
                .withLocalTemperature(ea.STATE).withSetpoint('current_heating_setpoint', 5, 35, 1, ea.STATE_SET)
                .withLocalTemperatureCalibration(-9, 9, 1, ea.STATE_SET)
                .withSystemMode(['heat'], ea.STATE_SET)
                .withRunningState(['idle', 'heat'], ea.STATE)
                .withPreset(['programming', 'manual', 'temporary_manual', 'holiday'],
                    'MANUAL MODE ☝ - In this mode, the device executes manual temperature setting. '+
                'When the set temperature is lower than the "minimum temperature", the valve is closed (forced closed). ' +
                'PROGRAMMING MODE ⏱ - In this mode, the device executes a preset week programming temperature time and temperature. ' +
                'HOLIDAY MODE ⛱ - In this mode, for example, the vacation mode is set for 10 days and the temperature is set' +
                'to 15 degrees Celsius. After 10 days, the device will automatically switch to programming mode. ' +
                'TEMPORARY MANUAL MODE - In this mode, ☝ icon will flash. At this time, the device executes the manually set ' +
                'temperature and returns to the weekly programming mode in the next time period. '),
            exposes.text('programming_mode', ea.STATE_SET).withDescription('PROGRAMMING MODE ⏱ - In this mode, ' +
                'the device executes a preset week programming temperature time and temperature. ' +
                'You can set up to 4 stages of temperature every for WEEKDAY ➀➁➂➃➄,  SATURDAY ➅ and SUNDAY ➆.'),
            exposes.binary('boost_heating', ea.STATE_SET, 'ON', 'OFF').withDescription('Boost Heating: press and hold "+" for 3 seconds, ' +
                'the device will enter the boost heating mode, and the ▷╵◁ will flash. The countdown will be displayed in the APP'),
            exposes.numeric('boost_heating_countdown', ea.STATE).withUnit('minutes').withDescription('Countdown in minutes')
                .withValueMin(0).withValueMax(15),
            exposes.numeric('boost_heating_countdown_time_set', ea.STATE_SET).withUnit('seconds')
                .withDescription('Boost Time Setting 100 sec - 900 sec, (default = 300 sec)').withValueMin(100)
                .withValueMax(900).withValueStep(100)],
        },
    };

module.exports = definition;
// XBot V3 extension for OhStem App - board: ORC Control Hub
// Chi dung var o pham vi ngoai cung de file nap lai nhieu lan van khong loi.

if (typeof Blockly.Python === 'undefined') {
  Blockly.Python = {};
}

var xbotV3Color = '#e8590c';
var xbotV3ImgUrl = 'https://raw.githubusercontent.com/truongphat230799/extension_xbot_v3/main/images/';

// ------------------------------------------------------------------
// DI CHUYEN
// ------------------------------------------------------------------

Blockly.Blocks['xbot_v3_move'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_move",
      "message0": Blockly.Msg.XBOT_V3_MOVE_MESSAGE0,
      "args0": [
        {
          "type": "field_image",
          "src": xbotV3ImgUrl + 'move.svg',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        },
        {
          "type": "field_dropdown",
          "name": "direction",
          "options": [
            [{ "src": xbotV3ImgUrl + 'arrow-up.svg', "width": 15, "height": 15, "alt": "*" }, "forward"],
            [{ "src": xbotV3ImgUrl + 'arrow-down.svg', "width": 15, "height": 15, "alt": "*" }, "backward"],
            [{ "src": xbotV3ImgUrl + 'arrow-left.svg', "width": 15, "height": 15, "alt": "*" }, "turn_left"],
            [{ "src": xbotV3ImgUrl + 'arrow-right.svg', "width": 15, "height": 15, "alt": "*" }, "turn_right"]
          ]
        },
        {
          "type": "input_value",
          "name": "speed",
          "check": "Number"
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": xbotV3Color,
      "tooltip": Blockly.Msg.XBOT_V3_MOVE_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_move'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  var direction = block.getFieldValue('direction');
  var speed = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC);
  return 'xbot.' + direction + '(' + speed + ')\n';
};

Blockly.Blocks['xbot_v3_move_for'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_move_for",
      "message0": Blockly.Msg.XBOT_V3_MOVE_FOR_MESSAGE0,
      "args0": [
        {
          "type": "field_image",
          "src": xbotV3ImgUrl + 'move.svg',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        },
        {
          "type": "field_dropdown",
          "name": "direction",
          "options": [
            [{ "src": xbotV3ImgUrl + 'arrow-up.svg', "width": 15, "height": 15, "alt": "*" }, "forward"],
            [{ "src": xbotV3ImgUrl + 'arrow-down.svg', "width": 15, "height": 15, "alt": "*" }, "backward"],
            [{ "src": xbotV3ImgUrl + 'arrow-left.svg', "width": 15, "height": 15, "alt": "*" }, "turn_left"],
            [{ "src": xbotV3ImgUrl + 'arrow-right.svg', "width": 15, "height": 15, "alt": "*" }, "turn_right"]
          ]
        },
        {
          "type": "input_value",
          "name": "amount",
          "check": "Number"
        },
        {
          "type": "field_dropdown",
          "name": "unit",
          "options": [
            [Blockly.Msg.XBOT_V3_SECONDS, "SECOND"],
            [Blockly.Msg.XBOT_V3_DEGREE, "DEGREE"]
          ]
        },
        {
          "type": "field_dropdown",
          "name": "then",
          "options": [
            [Blockly.Msg.XBOT_V3_STOP, "STOP"],
            [Blockly.Msg.XBOT_V3_BRAKE, "BRAKE"]
          ]
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": xbotV3Color,
      "tooltip": Blockly.Msg.XBOT_V3_MOVE_FOR_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_move_for'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  var direction = block.getFieldValue('direction');
  var unit = block.getFieldValue('unit');
  var then = block.getFieldValue('then');
  var amount = Blockly.Python.valueToCode(block, 'amount', Blockly.Python.ORDER_ATOMIC);
  return 'await xbot.' + direction + '_for(' + amount + ', unit=' + unit + ', then=' + then + ')\n';
};

Blockly.Blocks['xbot_v3_move_motor'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_move_motor",
      "message0": Blockly.Msg.XBOT_V3_MOVE_MOTOR_MESSAGE0,
      "args0": [
        {
          "type": "field_image",
          "src": xbotV3ImgUrl + 'motor.svg',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        },
        {
          "type": "input_value",
          "name": "left_speed",
          "check": "Number"
        },
        {
          "type": "input_value",
          "name": "right_speed",
          "check": "Number"
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": xbotV3Color,
      "tooltip": Blockly.Msg.XBOT_V3_MOVE_MOTOR_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_move_motor'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  var left = Blockly.Python.valueToCode(block, 'left_speed', Blockly.Python.ORDER_ATOMIC);
  var right = Blockly.Python.valueToCode(block, 'right_speed', Blockly.Python.ORDER_ATOMIC);
  return 'xbot.run_speed(' + left + ', ' + right + ')\n';
};

Blockly.Blocks['xbot_v3_stop'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_stop",
      "message0": Blockly.Msg.XBOT_V3_STOP_MESSAGE0,
      "args0": [
        {
          "type": "field_image",
          "src": xbotV3ImgUrl + 'stop.svg',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        },
        {
          "type": "field_dropdown",
          "name": "then",
          "options": [
            [Blockly.Msg.XBOT_V3_STOP, "STOP"],
            [Blockly.Msg.XBOT_V3_BRAKE, "BRAKE"]
          ]
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": xbotV3Color,
      "tooltip": Blockly.Msg.XBOT_V3_STOP_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_stop'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  if (block.getFieldValue('then') == 'BRAKE') {
    return 'xbot.brake()\n';
  }
  return 'xbot.stop()\n';
};

Blockly.Blocks['xbot_v3_set_speed'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_set_speed",
      "message0": Blockly.Msg.XBOT_V3_SET_SPEED_MESSAGE0,
      "args0": [
        {
          "type": "input_value",
          "name": "speed",
          "check": "Number"
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": xbotV3Color,
      "tooltip": Blockly.Msg.XBOT_V3_SET_SPEED_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_set_speed'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  var speed = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC);
  return 'xbot.speed(' + speed + ')\n';
};

Blockly.Blocks['xbot_v3_speed_ratio'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_speed_ratio",
      "message0": Blockly.Msg.XBOT_V3_SPEED_RATIO_MESSAGE0,
      "args0": [
        {
          "type": "input_value",
          "name": "left",
          "check": "Number"
        },
        {
          "type": "input_value",
          "name": "right",
          "check": "Number"
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": xbotV3Color,
      "tooltip": Blockly.Msg.XBOT_V3_SPEED_RATIO_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_speed_ratio'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  var left = Blockly.Python.valueToCode(block, 'left', Blockly.Python.ORDER_ATOMIC);
  var right = Blockly.Python.valueToCode(block, 'right', Blockly.Python.ORDER_ATOMIC);
  return 'xbot.speed_ratio(' + left + ', ' + right + ')\n';
};

// ------------------------------------------------------------------
// SERVO
// ------------------------------------------------------------------

Blockly.Blocks['xbot_v3_servo_angle'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_servo_angle",
      "message0": Blockly.Msg.XBOT_V3_SERVO_ANGLE_MESSAGE0,
      "args0": [
        {
          "type": "field_image",
          "src": xbotV3ImgUrl + 'servo.png',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        },
        {
          "type": "field_dropdown",
          "name": "servo",
          "options": [
            ["S1", "1"],
            ["S2", "2"]
          ]
        },
        {
          "type": "input_value",
          "name": "angle",
          "check": "Number"
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": xbotV3Color,
      "tooltip": Blockly.Msg.XBOT_V3_SERVO_ANGLE_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_servo_angle'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  var servo = block.getFieldValue('servo');
  var angle = Blockly.Python.valueToCode(block, 'angle', Blockly.Python.ORDER_ATOMIC);
  return 'await xbot.servo_angle(' + servo + ', ' + angle + ')\n';
};

Blockly.Blocks['xbot_v3_servo_spin'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_servo_spin",
      "message0": Blockly.Msg.XBOT_V3_SERVO_SPIN_MESSAGE0,
      "args0": [
        {
          "type": "field_image",
          "src": xbotV3ImgUrl + 'servo.png',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        },
        {
          "type": "field_dropdown",
          "name": "servo",
          "options": [
            ["S1", "1"],
            ["S2", "2"]
          ]
        },
        {
          "type": "input_value",
          "name": "speed",
          "check": "Number"
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": xbotV3Color,
      "tooltip": Blockly.Msg.XBOT_V3_SERVO_SPIN_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_servo_spin'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  var servo = block.getFieldValue('servo');
  var speed = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC);
  return 'xbot.servo_spin(' + servo + ', ' + speed + ')\n';
};

// ------------------------------------------------------------------
// CAM BIEN
// ------------------------------------------------------------------

Blockly.Blocks['xbot_v3_line_read_all'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_line_read_all",
      "message0": Blockly.Msg.XBOT_V3_LINE_READ_ALL_MESSAGE0,
      "args0": [
        {
          "type": "field_image",
          "src": xbotV3ImgUrl + 'line.svg',
          "width": 15,
          "height": 15,
          "alt": "*",
          "flipRtl": false
        },
        {
          "type": "field_dropdown",
          "name": "S1",
          "options": [
            [{ "src": xbotV3ImgUrl + 'line_finder_none_detect.png', "width": 15, "height": 15, "alt": "none" }, "0"],
            [{ "src": xbotV3ImgUrl + 'line_finder_detect.png', "width": 15, "height": 15, "alt": "detect" }, "1"]
          ]
        },
        {
          "type": "field_dropdown",
          "name": "S2",
          "options": [
            [{ "src": xbotV3ImgUrl + 'line_finder_none_detect.png', "width": 15, "height": 15, "alt": "none" }, "0"],
            [{ "src": xbotV3ImgUrl + 'line_finder_detect.png', "width": 15, "height": 15, "alt": "detect" }, "1"]
          ]
        },
        {
          "type": "field_dropdown",
          "name": "S3",
          "options": [
            [{ "src": xbotV3ImgUrl + 'line_finder_none_detect.png', "width": 15, "height": 15, "alt": "none" }, "0"],
            [{ "src": xbotV3ImgUrl + 'line_finder_detect.png', "width": 15, "height": 15, "alt": "detect" }, "1"]
          ]
        },
        {
          "type": "field_dropdown",
          "name": "S4",
          "options": [
            [{ "src": xbotV3ImgUrl + 'line_finder_none_detect.png', "width": 15, "height": 15, "alt": "none" }, "0"],
            [{ "src": xbotV3ImgUrl + 'line_finder_detect.png', "width": 15, "height": 15, "alt": "detect" }, "1"]
          ]
        }
      ],
      "inputsInline": true,
      "colour": xbotV3Color,
      "output": "Boolean",
      "tooltip": Blockly.Msg.XBOT_V3_LINE_READ_ALL_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_line_read_all'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  var code = 'xbot.read_line_sensors() == (' + block.getFieldValue('S1') + ', ' +
    block.getFieldValue('S2') + ', ' + block.getFieldValue('S3') + ', ' +
    block.getFieldValue('S4') + ')';
  return [code, Blockly.Python.ORDER_NONE];
};


Blockly.Blocks['xbot_v3_line5_read_all'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_line5_read_all",
      "message0": Blockly.Msg.XBOT_V3_LINE5_READ_ALL_MESSAGE0,
      "args0": [
        {
          "type": "field_image",
          "src": xbotV3ImgUrl + 'line.svg',
          "width": 15,
          "height": 15,
          "alt": "*",
          "flipRtl": false
        },
        {
          "type": "field_dropdown",
          "name": "S1",
          "options": [
            [{ "src": xbotV3ImgUrl + 'line_finder_none_detect.png', "width": 15, "height": 15, "alt": "none" }, "0"],
            [{ "src": xbotV3ImgUrl + 'line_finder_detect.png', "width": 15, "height": 15, "alt": "detect" }, "1"]
          ]
        },
        {
          "type": "field_dropdown",
          "name": "S2",
          "options": [
            [{ "src": xbotV3ImgUrl + 'line_finder_none_detect.png', "width": 15, "height": 15, "alt": "none" }, "0"],
            [{ "src": xbotV3ImgUrl + 'line_finder_detect.png', "width": 15, "height": 15, "alt": "detect" }, "1"]
          ]
        },
        {
          "type": "field_dropdown",
          "name": "S3",
          "options": [
            [{ "src": xbotV3ImgUrl + 'line_finder_none_detect.png', "width": 15, "height": 15, "alt": "none" }, "0"],
            [{ "src": xbotV3ImgUrl + 'line_finder_detect.png', "width": 15, "height": 15, "alt": "detect" }, "1"]
          ]
        },
        {
          "type": "field_dropdown",
          "name": "S4",
          "options": [
            [{ "src": xbotV3ImgUrl + 'line_finder_none_detect.png', "width": 15, "height": 15, "alt": "none" }, "0"],
            [{ "src": xbotV3ImgUrl + 'line_finder_detect.png', "width": 15, "height": 15, "alt": "detect" }, "1"]
          ]
        },
        {
          "type": "field_dropdown",
          "name": "S5",
          "options": [
            [{ "src": xbotV3ImgUrl + 'line_finder_none_detect.png', "width": 15, "height": 15, "alt": "none" }, "0"],
            [{ "src": xbotV3ImgUrl + 'line_finder_detect.png', "width": 15, "height": 15, "alt": "detect" }, "1"]
          ]
        }
      ],
      "inputsInline": true,
      "colour": xbotV3Color,
      "output": "Boolean",
      "tooltip": Blockly.Msg.XBOT_V3_LINE5_READ_ALL_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_line5_read_all'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  var code = 'xbot.read_line_sensors() == (' + block.getFieldValue('S1') + ', ' +
    block.getFieldValue('S2') + ', ' + block.getFieldValue('S3') + ', ' +
    block.getFieldValue('S4') + ', ' + block.getFieldValue('S5') + ')';
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['xbot_v3_line_read_single'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_line_read_single",
      "message0": Blockly.Msg.XBOT_V3_LINE_READ_SINGLE_MESSAGE0,
      "args0": [
        {
          "type": "field_image",
          "src": xbotV3ImgUrl + 'line.svg',
          "width": 15,
          "height": 15,
          "alt": "*",
          "flipRtl": false
        },
        {
          "type": "field_dropdown",
          "name": "sensor",
          "options": [
            ["S1", "1"],
            ["S2", "2"],
            ["S3", "3"],
            ["S4", "4"],
            ["S5", "5"]
          ]
        }
      ],
      "inputsInline": true,
      "colour": xbotV3Color,
      "output": "Number",
      "tooltip": Blockly.Msg.XBOT_V3_LINE_READ_SINGLE_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_line_read_single'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  return ['xbot.read_line_sensors(' + block.getFieldValue('sensor') + ')', Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['xbot_v3_line_position'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_line_position",
      "message0": Blockly.Msg.XBOT_V3_LINE_POSITION_MESSAGE0,
      "args0": [
        {
          "type": "field_image",
          "src": xbotV3ImgUrl + 'line.svg',
          "width": 15,
          "height": 15,
          "alt": "*",
          "flipRtl": false
        }
      ],
      "inputsInline": true,
      "colour": xbotV3Color,
      "output": "Number",
      "tooltip": Blockly.Msg.XBOT_V3_LINE_POSITION_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_line_position'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  return ['xbot.line_position()', Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['xbot_v3_ultrasonic_read'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_ultrasonic_read",
      "message0": Blockly.Msg.XBOT_V3_ULTRASONIC_READ_MESSAGE0,
      "args0": [
        {
          "type": "field_image",
          "src": xbotV3ImgUrl + 'ultrasonic.png',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      "colour": xbotV3Color,
      "output": "Number",
      "tooltip": Blockly.Msg.XBOT_V3_ULTRASONIC_READ_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_ultrasonic_read'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  return ['xbot.distance_cm()', Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['xbot_v3_ultrasonic_detect'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_ultrasonic_detect",
      "message0": Blockly.Msg.XBOT_V3_ULTRASONIC_DETECT_MESSAGE0,
      "args0": [
        {
          "type": "field_image",
          "src": xbotV3ImgUrl + 'ultrasonic.png',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        },
        {
          "type": "field_dropdown",
          "name": "compare",
          "options": [
            ["<", "<"],
            [">", ">"],
            ["=", "=="]
          ]
        },
        {
          "type": "input_value",
          "name": "distance",
          "check": "Number"
        },
        {
          "type": "input_dummy"
        }
      ],
      "inputsInline": true,
      "colour": xbotV3Color,
      "output": "Boolean",
      "tooltip": Blockly.Msg.XBOT_V3_ULTRASONIC_DETECT_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_ultrasonic_detect'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  var compare = block.getFieldValue('compare');
  var distance = Blockly.Python.valueToCode(block, 'distance', Blockly.Python.ORDER_ATOMIC);
  return ['xbot.distance_cm() ' + compare + ' ' + distance, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['xbot_v3_calibrate_gyro'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_calibrate_gyro",
      "message0": Blockly.Msg.XBOT_V3_CALIBRATE_GYRO_MESSAGE0,
      "args0": [
        {
          "type": "field_image",
          "src": xbotV3ImgUrl + 'gyro.svg',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": xbotV3Color,
      "tooltip": Blockly.Msg.XBOT_V3_CALIBRATE_GYRO_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_calibrate_gyro'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  return 'await xbot.calibrate_gyro()\n';
};

Blockly.Blocks['xbot_v3_angle'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_angle",
      "message0": Blockly.Msg.XBOT_V3_ANGLE_MESSAGE0,
      "args0": [
        {
          "type": "field_image",
          "src": xbotV3ImgUrl + 'gyro.svg',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      "colour": xbotV3Color,
      "output": "Number",
      "tooltip": Blockly.Msg.XBOT_V3_ANGLE_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_angle'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  return ['xbot.angle()', Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['xbot_v3_battery'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_battery",
      "message0": Blockly.Msg.XBOT_V3_BATTERY_MESSAGE0,
      "args0": [
        {
          "type": "field_image",
          "src": xbotV3ImgUrl + 'battery.svg',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      "colour": xbotV3Color,
      "output": "Number",
      "tooltip": Blockly.Msg.XBOT_V3_BATTERY_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_battery'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  return ['xbot.battery()', Blockly.Python.ORDER_NONE];
};

// ------------------------------------------------------------------
// DO LINE
// ------------------------------------------------------------------

Blockly.Blocks['xbot_v3_follow_line'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_follow_line",
      "message0": Blockly.Msg.XBOT_V3_FOLLOW_LINE_MESSAGE0,
      "args0": [
        {
          "type": "field_image",
          "src": xbotV3ImgUrl + 'line.svg',
          "width": 15,
          "height": 15,
          "alt": "*",
          "flipRtl": false
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": xbotV3Color,
      "tooltip": Blockly.Msg.XBOT_V3_FOLLOW_LINE_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_follow_line'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  return 'await xbot.follow_line()\n';
};

Blockly.Blocks['xbot_v3_follow_line_until'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_follow_line_until",
      "message0": Blockly.Msg.XBOT_V3_FOLLOW_LINE_UNTIL_MESSAGE0,
      "args0": [
        {
          "type": "field_image",
          "src": xbotV3ImgUrl + 'line.svg',
          "width": 15,
          "height": 15,
          "alt": "*",
          "flipRtl": false
        },
        {
          "type": "field_dropdown",
          "name": "target",
          "options": [
            [Blockly.Msg.XBOT_V3_LINE_CROSS, "cross"],
            [Blockly.Msg.XBOT_V3_LINE_END, "end"]
          ]
        },
        {
          "type": "field_dropdown",
          "name": "then",
          "options": [
            [Blockly.Msg.XBOT_V3_STOP, "STOP"],
            [Blockly.Msg.XBOT_V3_BRAKE, "BRAKE"]
          ]
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": xbotV3Color,
      "tooltip": Blockly.Msg.XBOT_V3_FOLLOW_LINE_UNTIL_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_follow_line_until'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  var target = block.getFieldValue('target');
  var then = block.getFieldValue('then');
  return 'await xbot.follow_line_until_' + target + '(then=' + then + ')\n';
};

Blockly.Blocks['xbot_v3_follow_line_by_time'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_follow_line_by_time",
      "message0": Blockly.Msg.XBOT_V3_FOLLOW_LINE_TIME_MESSAGE0,
      "args0": [
        {
          "type": "field_image",
          "src": xbotV3ImgUrl + 'line.svg',
          "width": 15,
          "height": 15,
          "alt": "*",
          "flipRtl": false
        },
        {
          "type": "input_value",
          "name": "time",
          "check": "Number"
        },
        {
          "type": "field_dropdown",
          "name": "then",
          "options": [
            [Blockly.Msg.XBOT_V3_STOP, "STOP"],
            [Blockly.Msg.XBOT_V3_BRAKE, "BRAKE"]
          ]
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": xbotV3Color,
      "tooltip": Blockly.Msg.XBOT_V3_FOLLOW_LINE_TIME_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_follow_line_by_time'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  var time = Blockly.Python.valueToCode(block, 'time', Blockly.Python.ORDER_ATOMIC);
  return 'await xbot.follow_line_by_time(' + time + ', then=' + block.getFieldValue('then') + ')\n';
};

// ------------------------------------------------------------------
// DEN LED RGB
// ------------------------------------------------------------------

Blockly.Blocks['xbot_v3_rgb_array'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_rgb_array",
      "message0": Blockly.Msg.XBOT_V3_RGB_ARRAY_MESSAGE0,
      "args0": [
        { "type": "input_value", "name": "color1" },
        { "type": "input_value", "name": "color2" },
        { "type": "input_value", "name": "color3" },
        { "type": "input_value", "name": "color4" },
        { "type": "input_value", "name": "color5" },
        { "type": "input_value", "name": "color6" },
        {
          "type": "field_image",
          "src": xbotV3ImgUrl + 'rgb.png',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": xbotV3Color,
      "tooltip": Blockly.Msg.XBOT_V3_RGB_ARRAY_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_rgb_array'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  var code = '';
  for (var i = 1; i <= 6; i++) {
    var color = Blockly.Python.valueToCode(block, 'color' + i, Blockly.Python.ORDER_ATOMIC);
    code = code + 'xbot.show_rgb_led(' + i + ', hex_to_rgb(' + color + '))\n';
  }
  return code;
};

Blockly.Blocks['xbot_v3_rgb_single'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_rgb_single",
      "message0": Blockly.Msg.XBOT_V3_RGB_SINGLE_MESSAGE0,
      "args0": [
        { "type": "input_value", "name": "index", "check": "Number" },
        { "type": "input_value", "name": "color" },
        {
          "type": "field_image",
          "src": xbotV3ImgUrl + 'rgb.png',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": xbotV3Color,
      "tooltip": Blockly.Msg.XBOT_V3_RGB_SINGLE_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_rgb_single'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  var index = Blockly.Python.valueToCode(block, 'index', Blockly.Python.ORDER_ATOMIC);
  var color = Blockly.Python.valueToCode(block, 'color', Blockly.Python.ORDER_ATOMIC);
  return 'xbot.show_rgb_led(' + index + ', hex_to_rgb(' + color + '))\n';
};

Blockly.Blocks['xbot_v3_rgb_all'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_rgb_all",
      "message0": Blockly.Msg.XBOT_V3_RGB_ALL_MESSAGE0,
      "args0": [
        { "type": "input_value", "name": "color" },
        {
          "type": "field_image",
          "src": xbotV3ImgUrl + 'rgb.png',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": xbotV3Color,
      "tooltip": Blockly.Msg.XBOT_V3_RGB_ALL_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_rgb_all'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  var color = Blockly.Python.valueToCode(block, 'color', Blockly.Python.ORDER_ATOMIC);
  return 'xbot.show_rgb_led(0, hex_to_rgb(' + color + '))\n';
};

// ------------------------------------------------------------------
// DIEU KHIEN TU XA
// ------------------------------------------------------------------

Blockly.Blocks['xbot_v3_start_teleop'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_start_teleop",
      "message0": Blockly.Msg.XBOT_V3_START_TELEOP_MESSAGE0,
      "args0": [
        {
          "type": "field_image",
          "src": xbotV3ImgUrl + 'gamepad.svg',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": xbotV3Color,
      "tooltip": Blockly.Msg.XBOT_V3_START_TELEOP_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_start_teleop'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  return 'xbot.start_teleop()\n';
};

Blockly.Blocks['xbot_v3_gamepad_read_button'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_gamepad_read_button",
      "message0": Blockly.Msg.XBOT_V3_READ_BUTTON_MESSAGE0,
      "args0": [
        {
          "type": "field_image",
          "src": xbotV3ImgUrl + 'gamepad.svg',
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        },
        {
          "type": "field_dropdown",
          "name": "button",
          "options": [
            ["L1", "BTN_L1"],
            ["L2", "BTN_L2"],
            ["R1", "BTN_R1"],
            ["R2", "BTN_R2"],
            [{ "src": xbotV3ImgUrl + 'ico-triangle.png', "width": 15, "height": 15, "alt": "*" }, "BTN_TRIANGLE"],
            [{ "src": xbotV3ImgUrl + 'ico-cross.png', "width": 15, "height": 15, "alt": "*" }, "BTN_CROSS"],
            [{ "src": xbotV3ImgUrl + 'ico-circle.png', "width": 15, "height": 15, "alt": "*" }, "BTN_CIRCLE"],
            [{ "src": xbotV3ImgUrl + 'ico-square.png', "width": 15, "height": 15, "alt": "*" }, "BTN_SQUARE"],
            [{ "src": xbotV3ImgUrl + 'arrow-up.svg', "width": 15, "height": 15, "alt": "*" }, "BTN_UP"],
            [{ "src": xbotV3ImgUrl + 'arrow-down.svg', "width": 15, "height": 15, "alt": "*" }, "BTN_DOWN"],
            [{ "src": xbotV3ImgUrl + 'arrow-left.svg', "width": 15, "height": 15, "alt": "*" }, "BTN_LEFT"],
            [{ "src": xbotV3ImgUrl + 'arrow-right.svg', "width": 15, "height": 15, "alt": "*" }, "BTN_RIGHT"]
          ]
        }
      ],
      "inputsInline": true,
      "colour": xbotV3Color,
      "output": "Boolean",
      "tooltip": Blockly.Msg.XBOT_V3_READ_BUTTON_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_gamepad_read_button'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  return ['xbot.gamepad_read(' + block.getFieldValue('button') + ') == 1', Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['xbot_v3_auto_mode'] = {
  init: function () {
    this.jsonInit({
      "type": "xbot_v3_auto_mode",
      "message0": Blockly.Msg.XBOT_V3_AUTO_MODE_MESSAGE0,
      "args0": [
        {
          "type": "field_dropdown",
          "name": "enabled",
          "options": [
            [Blockly.Msg.XBOT_V3_ON, "True"],
            [Blockly.Msg.XBOT_V3_OFF, "False"]
          ]
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": xbotV3Color,
      "tooltip": Blockly.Msg.XBOT_V3_AUTO_MODE_TOOLTIP,
      "helpUrl": ""
    });
  }
};

Blockly.Python['xbot_v3_auto_mode'] = function (block) {
  Blockly.Python.definitions_['import_xbot_v3'] = 'from xbot_v3 import *';
  return 'xbot.auto_mode(' + block.getFieldValue('enabled') + ')\n';
};

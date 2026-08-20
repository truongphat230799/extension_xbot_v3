'''
    Thu vien XBot V3 - robot 2 banh dung dong co encoder tren mach ORC Control Hub.

    Phan cung mac dinh:
        - 2 dong co thuong cam cong M1 (banh trai) va M2 (banh phai)
        - 2 servo cam cong S1, S2
        - Cam bien do line 4 mat giao tiep I2C (PCF8574, dia chi 0x23)
        - Cam bien sieu am HC-SR04 cam cong D3 (trig) va D4 (echo)
        - Cam bien goc MPU6050 tich hop san tren Control Hub
        - Den RGB co san tren mach Control Hub (neopix)

    Vi dung dong co thuong nen robot khong do duoc quang duong bang encoder:
    di chuyen theo giay (SECOND) va xoay theo do (DEGREE, dung cam bien goc),
    khong co don vi CM.

    Cach dung nhanh:

        from xbot_v3 import *

        async def setup():
            xbot.speed(70)
            await xbot.calibrate_gyro()

        async def main():
            await setup()
            await xbot.forward_for(2, unit=SECOND, then=BRAKE)
            await xbot.turn_right_for(90, unit=DEGREE, then=BRAKE)
            xbot.stop()

        run_loop(main())
'''

import asyncio
from machine import Pin

from utility import *
from setting import *
from yolo_uno import *
from ble import *
from constants import *

from mdv2 import MotorDriverV2
from motor import DCMotor
from drivebase import DriveBase
from servo import Servo
from line_sensor import LineSensorI2C
from mpu6050 import MPU6050
from angle_sensor import AngleSensor
from gamepad import Gamepad
from xbot_ultrasonic import Ultrasonic, NO_ECHO

# ------------------------------------------------------------------
# Thong so mac dinh cua XBot V3. Sua o day neu robot cua ban khac.
# ------------------------------------------------------------------

# Dong co thuong, khong co encoder
XBOT_MOTOR_LEFT_PORT = M1
XBOT_MOTOR_RIGHT_PORT = M2

# Kich thuoc robot, don vi mm
XBOT_WHEEL_DIAMETER = 65
XBOT_ROBOT_WIDTH = 155

# Servo
XBOT_SERVO1_PORT = S1
XBOT_SERVO2_PORT = S2

# Cam bien sieu am cam cong D3 (trig) va D4 (echo).
# Dung try/except de van chay duoc neu firmware dat ten chan khac.
try:
    XBOT_ULTRASONIC_TRIG = D3_PIN
    XBOT_ULTRASONIC_ECHO = D4_PIN
except NameError:
    XBOT_ULTRASONIC_TRIG = 3
    XBOT_ULTRASONIC_ECHO = 4

# Cam bien do line I2C
XBOT_LINE_ADDRESS = 0x23

# Den RGB. De None de dung den RGB co san tren mach Control Hub.
# Chi doi thanh so chan neu ban gan them dai led RGB ben ngoai.
XBOT_RGB_PIN = None
XBOT_RGB_COUNT = 6

# Toc do mac dinh
XBOT_DEFAULT_SPEED = 70
XBOT_MIN_SPEED = 40

# Huong di chuyen, dung cho khoi lenh di chuyen
DIRECTIONS = {
    'forward': DIR_FW,
    'backward': DIR_BW,
    'turn_left': DIR_L,
    'turn_right': DIR_R,
}


class _RgbLeds:
    '''
        Boc chung den RGB tren mach Control Hub va dai led RGB gan ngoai
        de dung chung mot bo lenh.
    '''

    def __init__(self, pin=None, count=6):
        self._count = count
        self._strip = None

        if pin is not None:
            try:
                import neopixel
                self._strip = neopixel.NeoPixel(Pin(pin), count)
            except Exception:
                print('XBot V3: khong khoi tao duoc dai led RGB, dung led tren mach')
                self._strip = None

    @property
    def count(self):
        return self._count

    '''
        Bat den RGB.

        Parameters:
            index (int) - 0 la tat ca den, 1..n la tung den
            color (tuple) - mau dang (r, g, b), dung hex_to_rgb('#ff0000') de doi tu ma mau
    '''
    def show(self, index, color):
        if self._strip is None:
            neopix.show(index, color)
            return

        if index == 0:
            for i in range(self._count):
                self._strip[i] = color
        elif 0 < index <= self._count:
            self._strip[index - 1] = color
        else:
            return

        self._strip.write()

    def off(self):
        self.show(0, (0, 0, 0))


class XBotV3:

    def __init__(self):
        # ---------------- dong co ----------------
        try:
            self.driver = MotorDriverV2()
        except Exception as err:
            self.driver = None
            print('XBot V3: khong tim thay mach dieu khien dong co -', err)

        if self.driver:
            self.motor_left = DCMotor(self.driver, XBOT_MOTOR_LEFT_PORT, reversed=False)
            self.motor_right = DCMotor(self.driver, XBOT_MOTOR_RIGHT_PORT, reversed=False)

            self.drive = DriveBase(MODE_2WD, m1=self.motor_left, m2=self.motor_right)
            self.drive.size(wheel=XBOT_WHEEL_DIAMETER, width=XBOT_ROBOT_WIDTH)
            self.drive.speed(XBOT_DEFAULT_SPEED, min_speed=XBOT_MIN_SPEED)

            # ---------------- servo ----------------
            self.servo1 = Servo(self.driver, XBOT_SERVO1_PORT, 180)
            self.servo2 = Servo(self.driver, XBOT_SERVO2_PORT, 180)
        else:
            self.motor_left = None
            self.motor_right = None
            self.drive = None
            self.servo1 = None
            self.servo2 = None

        # ---------------- cam bien do line ----------------
        self.line_sensor = LineSensorI2C(XBOT_LINE_ADDRESS)
        if self.drive:
            self.drive.line_sensor(self.line_sensor)

        # ---------------- cam bien sieu am ----------------
        self.ultrasonic = Ultrasonic(XBOT_ULTRASONIC_TRIG, XBOT_ULTRASONIC_ECHO)

        # ---------------- den RGB ----------------
        self.rgb = _RgbLeds(XBOT_RGB_PIN, XBOT_RGB_COUNT)

        # ---------------- cam bien goc, tao khi can ----------------
        self.imu = None
        self.angle_sensor = None

        # ---------------- tay cam dieu khien ----------------
        self.gamepad = Gamepad()

    # ==================================================================
    # Cau hinh
    # ==================================================================

    '''
        Doi kich thuoc robot neu khac mac dinh. Chi can dung khi ban thay
        dong co thuong bang dong co encoder de di theo cm.

        Parameters:
            wheel (Number, mm) - duong kinh banh xe
            width (Number, mm) - khoang cach giua hai banh
    '''
    def config(self, wheel=None, width=None):
        if self.drive and (wheel is not None or width is not None):
            self.drive.size(
                wheel=XBOT_WHEEL_DIAMETER if wheel is None else wheel,
                width=XBOT_ROBOT_WIDTH if width is None else width,
            )

    '''
        Cai dat toc do di chuyen mac dinh, 0 den 100.
    '''
    def speed(self, speed=None, min_speed=None):
        if self.drive is None:
            return XBOT_DEFAULT_SPEED
        return self.drive.speed(speed, min_speed)

    '''
        Cai dat ti le toc do banh trai va banh phai de robot chay thang hon.
    '''
    def speed_ratio(self, left, right):
        if self.drive:
            self.drive.speed_ratio(left, right)

    '''
        Cai dat he so PID dung khi chay thang va xoay.
    '''
    def pid(self, Kp, Ki, Kd):
        if self.drive:
            self.drive.pid(Kp, Ki, Kd)

    '''
        XBot V3 dung dong co thuong nen luon phai xoay bang cam bien goc.
        Ham nay giu lai de tuong thich, tat cam bien goc se bi bo qua.
    '''
    def use_gyro(self, enabled=True):
        if not enabled:
            print('XBot V3: dong co khong co encoder nen luon dung cam bien goc de xoay')
            return
        if self.drive:
            self.drive.use_gyro(True)

    '''
        Doi chieu quay cua mot dong co khi banh xe chay nguoc.

        Parameters:
            wheel (str) - 'left' hoac 'right'
    '''
    def reverse_motor(self, wheel):
        if wheel == 'left' and self.motor_left:
            self.motor_left.reverse()
        elif wheel == 'right' and self.motor_right:
            self.motor_right.reverse()

    # ==================================================================
    # Di chuyen
    # ==================================================================

    '''
        Di chuyen lien tuc theo huong chi dinh, khong tu dung lai.

        Parameters:
            direction (str) - 'forward', 'backward', 'turn_left', 'turn_right'
            speed (Number) - 0 den 100, bo trong thi dung toc do mac dinh
    '''
    def move(self, direction, speed=None):
        if self.drive is None:
            return
        self.drive.run(DIRECTIONS.get(direction, DIR_FW), speed)

    '''
        Di chuyen mot doan roi dung lai.

        Parameters:
            direction (str) - 'forward', 'backward', 'turn_left', 'turn_right'
            amount (Number) - do lon quang duong, tinh theo unit
            unit - SECOND (giay) hoac DEGREE (do, chi dung khi xoay)
            then - STOP hoac BRAKE
    '''
    async def move_for(self, direction, amount, unit=SECOND, then=STOP):
        if self.drive is None:
            return
        if not self._check_unit(unit):
            return
        if direction == 'forward':
            await self.drive.forward_for(amount, unit=unit, then=then)
        elif direction == 'backward':
            await self.drive.backward_for(amount, unit=unit, then=then)
        elif direction == 'turn_left':
            await self.drive.turn_left_for(amount, unit=unit, then=then)
        elif direction == 'turn_right':
            await self.drive.turn_right_for(amount, unit=unit, then=then)

    def forward(self, speed=None):
        self.move('forward', speed)

    async def forward_for(self, amount, unit=SECOND, then=STOP):
        await self.move_for('forward', amount, unit, then)

    def backward(self, speed=None):
        self.move('backward', speed)

    async def backward_for(self, amount, unit=SECOND, then=STOP):
        await self.move_for('backward', amount, unit, then)

    def turn_left(self, speed=None):
        self.move('turn_left', speed)

    async def turn_left_for(self, amount, unit=DEGREE, then=STOP):
        await self.move_for('turn_left', amount, unit, then)

    def turn_right(self, speed=None):
        self.move('turn_right', speed)

    async def turn_right_for(self, amount, unit=DEGREE, then=STOP):
        await self.move_for('turn_right', amount, unit, then)

    '''
        Chay hai dong co voi toc do rieng, tu -100 den 100.
    '''
    def run_speed(self, left_speed, right_speed=None):
        if self.drive:
            self.drive.run_speed(left_speed, right_speed)

    '''
        Chay voi do lech lai chi dinh.

        Parameters:
            steering (Number) - -100 xoay het sang trai, 100 xoay het sang phai
    '''
    async def turn(self, steering, amount=None, unit=SECOND, then=STOP):
        if self.drive is None or not self._check_unit(unit):
            return
        await self.drive.turn(steering, amount, unit, then)

    '''
        Chan don vi CM va INCH vi khong co encoder de do quang duong.
        Neu de lot qua thi robot se chay mai khong dung.
    '''
    def _check_unit(self, unit):
        if unit in (CM, INCH):
            print('XBot V3: dong co khong co encoder, hay dung don vi SECOND hoac DEGREE')
            return False
        return True

    def stop(self):
        if self.drive:
            self.drive.stop()

    def brake(self):
        if self.drive:
            self.drive.brake()

    # ==================================================================
    # Servo
    # ==================================================================

    def _servo(self, index):
        return self.servo1 if int(index) == 1 else self.servo2

    '''
        Quay servo den goc chi dinh.

        Parameters:
            index (int) - 1 cho cong S1, 2 cho cong S2
            angle (Number) - 0 den 180 do
            speed (Number) - 0 den 100, 100 la quay ngay lap tuc
    '''
    async def servo_angle(self, index, angle, speed=100):
        servo = self._servo(index)
        if servo:
            await servo.run_angle(angle, speed)

    '''
        Quay servo them mot goc so voi vi tri hien tai.
    '''
    async def servo_steps(self, index, steps, speed=100):
        servo = self._servo(index)
        if servo:
            await servo.run_steps(steps, speed)

    '''
        Quay servo 360 do voi toc do tu -100 den 100.
    '''
    def servo_spin(self, index, speed):
        servo = self._servo(index)
        if servo:
            servo.spin(speed)

    '''
        Gioi han goc quay cua servo de tranh lam hong co cau.
    '''
    def servo_limit(self, index, min, max):
        servo = self._servo(index)
        if servo:
            servo.limit(min, max)

    # ==================================================================
    # Cam bien do line
    # ==================================================================

    '''
        Doc trang thai 4 mat do line.

        Parameters:
            index (int) - bo trong de doc ca 4 mat dang (s1, s2, s3, s4),
                          hoac 1 den 4 de doc rieng tung mat
        Gia tri 1 la thay vach den, 0 la thay nen trang.
    '''
    def read_line_sensors(self, index=None):
        if index is None:
            return self.line_sensor.read()
        return self.line_sensor.read(int(index) - 1)

    '''
        Vi tri cua robot so voi vach line, tra ve mot trong cac hang so
        LINE_LEFT3, LINE_LEFT2, LINE_LEFT, LINE_CENTER,
        LINE_RIGHT, LINE_RIGHT2, LINE_RIGHT3, LINE_CROSS, LINE_END.
    '''
    def line_state(self):
        return self.line_sensor.check()

    async def follow_line(self, backward=True):
        if self.drive:
            await self.drive.follow_line(backward)

    async def follow_line_until_cross(self, then=STOP):
        if self.drive:
            await self.drive.follow_line_until_cross(then)

    async def follow_line_until_end(self, then=STOP):
        if self.drive:
            await self.drive.follow_line_until_end(then)

    async def follow_line_by_time(self, timerun, then=STOP):
        if self.drive:
            await self.drive.follow_line_by_time(timerun, then)

    async def follow_line_until(self, condition, then=STOP):
        if self.drive:
            await self.drive.follow_line_until(condition, then)

    async def turn_until_line_detected(self, steering, then=STOP):
        if self.drive:
            await self.drive.turn_until_line_detected(steering, then)

    # ==================================================================
    # Cam bien sieu am
    # ==================================================================

    '''
        Khoang cach den vat can, don vi cm. Tra ve 999 neu khong do duoc.
    '''
    def distance_cm(self):
        return self.ultrasonic.distance_cm()

    '''
        Kiem tra co vat can gan hon khoang cach chi dinh khong.
    '''
    def obstacle_detected(self, distance=15):
        return self.ultrasonic.distance_cm() < distance

    # ==================================================================
    # Cam bien goc
    # ==================================================================

    '''
        Hieu chinh cam bien goc va bat dau doc lien tuc.
        Phai goi mot lan trong setup truoc khi dung goc de xoay.

        Parameters:
            samples (int) - so mau lay khi hieu chinh, cang nhieu cang chinh xac
    '''
    async def calibrate_gyro(self, samples=200):
        if self.imu is None:
            try:
                self.imu = MPU6050()
            except Exception as err:
                print('XBot V3: khong tim thay cam bien goc MPU6050 -', err)
                return False

            self.angle_sensor = AngleSensor(self.imu)
            if self.drive:
                self.drive.angle_sensor(self.angle_sensor)
            self.angle_sensor.calibrate(samples)
            create_task(self.angle_sensor.run())
        else:
            self.angle_sensor.calibrate(samples)

        await asleep_ms(100)
        self.use_gyro(True)
        return True

    '''
        Goc xoay hien tai cua robot, don vi do.
    '''
    def angle(self):
        if self.drive is None:
            return 0
        return self.drive.angle()

    async def reset_angle(self):
        if self.drive:
            await self.drive.reset_angle()

    # ==================================================================
    # Den RGB
    # ==================================================================

    '''
        Bat den RGB tren mach Control Hub.

        Parameters:
            index (int) - 0 la tat ca den, 1..6 la tung den
            color (tuple) - mau (r, g, b), dung hex_to_rgb('#ff0000')
    '''
    def show_rgb_led(self, index, color):
        self.rgb.show(index, color)

    def clear_rgb_led(self):
        self.rgb.off()

    # ==================================================================
    # Dieu khien tu xa
    # ==================================================================

    '''
        Bat che do dieu khien bang tay cam gamepad hoac app OhStem qua BLE.

        Parameters:
            accel_steps (int) - so buoc tang toc, cang lon robot khoi dong cang muot
    '''
    def start_teleop(self, accel_steps=3):
        if self.drive is None:
            return
        create_task(ble.wait_for_msg())
        create_task(self.gamepad.run())
        create_task(self.drive.run_teleop(self.gamepad, accel_steps=accel_steps))

    '''
        Gan ham xu ly khi mot nut tren gamepad duoc nhan.

        Parameters:
            cmd (str) - ten nut, vi du BTN_L1, BTN_CROSS
            callback - ham async se duoc goi
    '''
    def on_teleop_command(self, cmd, callback):
        if self.drive:
            self.drive.on_teleop_command(cmd, callback)

    '''
        Doc trang thai mot nut hoac truc joystick tren gamepad.
    '''
    def gamepad_read(self, key):
        return self.gamepad.data.get(key, 0)

    '''
        Bat che do tu dong de robot chay chuong trinh, tam bo qua lenh dieu khien.
    '''
    def auto_mode(self, enabled=True):
        if self.drive:
            self.drive.mode_auto = enabled

    # ==================================================================
    # Khac
    # ==================================================================

    '''
        Dien ap pin, don vi volt.
    '''
    def battery(self):
        if self.driver is None:
            return 0
        return self.driver.battery()

    def deinit(self):
        self.stop()
        self.clear_rgb_led()


xbot = XBotV3()


def stop_all():
    xbot.stop()

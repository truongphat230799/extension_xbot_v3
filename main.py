'''
    Chuong trinh mac dinh cua XBot V3 tren mach ORC Control Hub.

    File nay duoc nap vao robot ngay khi cai muc mo rong XBot V3, nen robot
    choi duoc lien ma khong can lap trinh gi them. Khi ban muon viet chuong
    trinh rieng thi cu nap tu OhStem App, chuong trinh moi se thay the file nay.

    Nhan nut BOOT tren Control Hub de doi che do. Den RGB tren mach doi mau
    theo che do dang chay:

        do          - dieu khien tu xa bang tay cam gamepad hoac app OhStem
        xanh duong  - tu dong tranh vat can
        tim         - bam theo vat can phia truoc
        trang       - do line

    Phan cung: dong co trai cong M1, dong co phai cong M2, servo S1 va S2,
    cam bien sieu am cong D3 (trig) va D4 (echo), cam bien do line I2C.
'''

import gc
from micropython import const
from abutton import aButton

from xbot_v3 import *

MODE_TELEOP = const(0)
MODE_AVOID_OBSTACLE = const(1)
MODE_FOLLOW_OBJECT = const(2)
MODE_FOLLOW_LINE = const(3)

MODE_COLORS = ('#ff0000', '#0000ff', '#ff00ff', '#ffffff')
MODE_NAMES = ('Teleop', 'Avoid obstacle', 'Follow object', 'Follow line')

# Toc do rieng cho tung che do, 0 den 100. Chinh o day neu robot chay nhanh qua.
MODE_SPEEDS = (70, 55, 70, 70)

# Toc do luc bat dau chay, robot tang dan tu day len toc do cua che do
MIN_SPEED = 40

# khoang cach coi la co vat can, cm
OBSTACLE_DISTANCE = 15

mode = MODE_TELEOP
mode_changed = True

btn_boot = aButton(BOOT_PIN)


def apply_mode():
    # dat toc do rieng cua che do
    xbot.speed(MODE_SPEEDS[mode], min_speed=MIN_SPEED)
    # den RGB tren mach Control Hub bao che do dang chay
    xbot.show_rgb_led(0, hex_to_rgb(MODE_COLORS[mode]))
    print('XBot V3 mode', mode + 1, '/', len(MODE_NAMES),
          '-', MODE_NAMES[mode], '- toc do', MODE_SPEEDS[mode])


async def on_boot_pressed():
    global mode, mode_changed
    # vong tuan hoan: 1 -> 2 -> 3 -> 4 -> 1
    mode = (mode + 1) % len(MODE_NAMES)
    mode_changed = True
    # che do teleop nhan lenh tu tay cam, cac che do con lai tu chay
    xbot.auto_mode(mode != MODE_TELEOP)
    xbot.stop()
    await asleep_ms(200)


async def on_cmd_BTN_L1():
    await xbot.servo_angle(1, 0, speed=100)


async def on_cmd_BTN_L2():
    await xbot.servo_angle(1, 90, speed=100)


async def on_cmd_BTN_R1():
    await xbot.servo_angle(2, 0, speed=100)


async def on_cmd_BTN_R2():
    await xbot.servo_angle(2, 90, speed=100)


async def run_avoid_obstacle():
    if xbot.distance_cm() < OBSTACLE_DISTANCE:
        await xbot.move_for('backward', 0.5, unit=SECOND, then=BRAKE)
        await xbot.move_for('turn_right', 60, unit=DEGREE, then=BRAKE)
    else:
        xbot.forward()
        await asleep_ms(50)


async def run_follow_object():
    distance = xbot.distance_cm()

    if distance < 10:
        xbot.backward()
    elif distance < 25:
        xbot.stop()
    elif distance < 60:
        xbot.forward()
    else:
        xbot.stop()

    await asleep_ms(50)


async def run_follow_line():
    # follow_line() chi tinh toan roi dat toc do banh xe, khong tu cho.
    # Phai goi lien tuc trong vong lap thi robot moi bam vach duoc.
    await xbot.follow_line()


async def setup():
    # cam vang trong luc khoi dong va hieu chinh cam bien goc
    xbot.show_rgb_led(0, hex_to_rgb('#ffa500'))

    xbot.pid(Kp=8, Ki=0.15, Kd=0)
    await xbot.calibrate_gyro(200)

    xbot.servo_limit(1, min=0, max=180)
    xbot.servo_limit(2, min=0, max=180)

    xbot.on_teleop_command(BTN_L1, on_cmd_BTN_L1)
    xbot.on_teleop_command(BTN_L2, on_cmd_BTN_L2)
    xbot.on_teleop_command(BTN_R1, on_cmd_BTN_R1)
    xbot.on_teleop_command(BTN_R2, on_cmd_BTN_R2)

    btn_boot.pressed(on_boot_pressed)

    xbot.start_teleop(accel_steps=3)
    xbot.auto_mode(False)

    print('XBot V3 started. Battery:', xbot.battery(), 'V')


async def main():
    global mode_changed

    await setup()

    while True:
        if mode_changed:
            apply_mode()
            mode_changed = False

        if mode == MODE_TELEOP:
            # run_teleop() chay o task rieng nen o day khong phai lam gi
            pass
        elif mode == MODE_AVOID_OBSTACLE:
            await run_avoid_obstacle()
        elif mode == MODE_FOLLOW_OBJECT:
            await run_follow_object()
        elif mode == MODE_FOLLOW_LINE:
            await run_follow_line()

        # Luon nhuong CPU o cuoi moi vong lap.
        # Bat buoc phai co: follow_line() ben trong khong co await nao, neu
        # vong lap khong nhuong thi task nut BOOT se khong duoc chay va robot
        # ket lai o che do do line, khong quay ve che do 1 duoc.
        await asleep_ms(10)


def deinit():
    xbot.deinit()
    btn_boot.deinit()
    gc.collect()


import yolo_uno
yolo_uno.deinit = deinit

run_loop(main())

# XBot V3 — mục mở rộng cho mạch ORC Control Hub

Thư viện khối lệnh và thư viện Python cho robot **XBot V3**: robot 2 bánh chạy trên mạch
**ORC Control Hub** (ESP32-S3).

Bộ tính năng làm theo mẫu của [yolobit_extension_rover](https://github.com/AITT-VN/yolobit_extension_rover)
(di chuyển, servo, dò line, siêu âm, đèn RGB, điều khiển từ xa), nhưng viết lại trên nền
[Robotics Open Platform](https://github.com/AITT-VN/yolouno_extension_robotics) của Control Hub
nên có thêm PID, cảm biến góc và các lệnh dò line nâng cao.

Cài mục mở rộng xong là robot **chơi được ngay**, chưa cần lập trình gì — xem phần
[Chương trình mặc định](#chương-trình-mặc-định-mainpy) bên dưới.

## Phần cứng mặc định

| Thành phần | Cổng |
|---|---|
| Động cơ bánh trái | `M1` |
| Động cơ bánh phải | `M2` |
| Servo 1, Servo 2 | `S1`, `S2` |
| Cảm biến dò line 4 mắt (PCF8574) | I2C, địa chỉ `0x23` |
| Cảm biến dò line 5 mắt (STM32G030) | I2C, địa chỉ `0x24` |
| Cảm biến siêu âm HC-SR04 | `D3` (trig), `D4` (echo) |
| Cảm biến góc MPU6050 | tích hợp sẵn trên Control Hub |
| Đèn RGB | đèn có sẵn trên Control Hub (`neopix`) |

Tất cả nằm ở đầu file [xbot_v3.py](xbot_v3.py) trong các hằng số `XBOT_*`, cắm khác cổng thì
sửa một chỗ là xong.

Cảm biến dò line thì không cần khai báo: lúc khởi động thư viện quét I2C, thấy `0x24` thì
dùng bản 5 mắt, không thấy thì dùng bản 4 mắt ở `0x23`. Các lệnh dò line dùng chung cho cả
hai loại. Muốn ép một loại thì đặt `XBOT_LINE_ADDRESS = 0x23` (hoặc `0x24`).

### Lưu ý: dùng động cơ thường nên không có encoder

`M1` và `M2` là cổng động cơ thường, không đo được số vòng quay. Hệ quả:

- **Đi thẳng** tính theo **giây** (`SECOND`). Không có đơn vị `CM`.
- **Xoay** tính theo **độ** (`DEGREE`) và luôn dùng **cảm biến góc MPU6050** —
  nhớ gọi `await xbot.calibrate_gyro()` một lần lúc khởi động, nếu không robot sẽ không xoay đúng góc.
- Đi thẳng vẫn được PID giữ hướng, nhưng lấy sai số từ cảm biến góc thay vì encoder.
- Không có khối đọc quãng đường đã đi.

Nếu sau này anh đổi sang động cơ encoder cắm `E1`/`E2`, chỉ cần sửa `XBOT_MOTOR_LEFT_PORT`,
`XBOT_MOTOR_RIGHT_PORT` và gọi `motor.set_encoder(...)` là dùng lại được đơn vị `CM`.

## Chương trình mặc định (`main.py`)

[main.py](main.py) nằm trong danh sách `libs` của [config.json](config.json) nên được nạp vào robot
ngay khi cài mục mở rộng. Robot chạy được luôn, không cần kéo khối lệnh nào.
Khi nào muốn viết chương trình riêng thì nạp từ OhStem App, chương trình mới sẽ thay thế file này.

Nhấn nút **BOOT** trên Control Hub để đổi chế độ, đèn RGB trên mạch đổi màu theo:

| Màu | Chế độ |
|---|---|
| Cam | Đang khởi động và hiệu chỉnh cảm biến góc |
| Đỏ | Điều khiển từ xa bằng tay cầm / app OhStem |
| Xanh dương | Tự động tránh vật cản |
| Tím | Bám theo vật phía trước |
| Trắng | Dò line |

Trên tay cầm: `L1`/`L2` mở đóng servo 1, `R1`/`R2` mở đóng servo 2.

## Dùng bằng code Python

```python
from xbot_v3 import *

async def setup():
    xbot.speed(70, min_speed=40)
    xbot.pid(Kp=8, Ki=0.15, Kd=0)
    await xbot.calibrate_gyro(200)          # để robot đứng yên khi hiệu chỉnh

async def main():
    await setup()

    xbot.show_rgb_led(0, hex_to_rgb('#00ff00'))

    await xbot.forward_for(2, unit=SECOND, then=BRAKE)
    await xbot.turn_right_for(90, unit=DEGREE, then=BRAKE)

    while xbot.distance_cm() > 15:
        xbot.forward()
        await asleep_ms(50)

    xbot.stop()

run_loop(main())
```

Dò line:

```python
async def main():
    await xbot.calibrate_gyro(200)
    xbot.speed(60, min_speed=35)

    await xbot.follow_line_until_cross(then=BRAKE)
    await xbot.turn_left_for(90, unit=DEGREE, then=BRAKE)
    await xbot.follow_line_until_end(then=STOP)

run_loop(main())
```

Điều khiển từ xa bằng tay cầm gamepad và app OhStem:

```python
async def on_cmd_BTN_L1():
    await xbot.servo_angle(1, 0)

async def main():
    await xbot.calibrate_gyro(200)
    xbot.on_teleop_command(BTN_L1, on_cmd_BTN_L1)
    xbot.start_teleop(accel_steps=3)
    while True:
        await asleep_ms(100)

run_loop(main())
```

## API chính của `xbot`

**Cài đặt** — `speed(speed, min_speed)`, `speed_ratio(left, right)`, `pid(Kp, Ki, Kd)`,
`reverse_motor('left'|'right')`, `config(wheel, width)` *(chỉ cần khi lắp động cơ encoder)*

**Di chuyển** — `forward()`, `backward()`, `turn_left()`, `turn_right()`, `move(direction, speed)`,
`await forward_for(amount, unit, then)` (tương tự cho 3 hướng còn lại), `await move_for(direction, ...)`,
`run_speed(left, right)`, `await turn(steering, amount, unit, then)`, `stop()`, `brake()`

`unit` nhận `SECOND` hoặc `DEGREE`; `then` nhận `STOP` hoặc `BRAKE`.

**Servo** — `await servo_angle(index, angle, speed)`, `await servo_steps(index, steps)`,
`servo_spin(index, speed)`, `servo_limit(index, min, max)`

**Dò line** — `read_line_sensors(index=None)`, `line_sensor_count()`, `line_state()`,
`line_position()` (độ lệch vạch −100…100), `line_lost()`, `line_cross()`,
`await follow_line()`, `await follow_line_until_cross(then)`,
`await follow_line_until_end(then)`, `await follow_line_by_time(giây, then)`,
`await turn_until_line_detected(steering, then)`

Riêng bản 5 mắt có thêm `line_calibrate()` (chạy hiệu chỉnh trên mạch cảm biến) và
`line_white_led(on)` (bật tắt đèn LED trắng trên cảm biến).

**Siêu âm** — `distance_cm()` (trả về `999` khi không đo được), `obstacle_detected(distance)`

**Cảm biến góc** — `await calibrate_gyro(samples)`, `angle()`, `await reset_angle()`

**Đèn RGB** — `show_rgb_led(index, color)` với `index = 0` là tất cả đèn, `clear_rgb_led()`

**Điều khiển từ xa** — `start_teleop(accel_steps)`, `on_teleop_command(nút, callback)`,
`gamepad_read(khóa)`, `auto_mode(enabled)`

**Khác** — `battery()`, `deinit()`

## Khối lệnh

24 khối trong một mục **XBOT V3** duy nhất, chia nhóm bằng nhãn giống extension Rover:
**Di chuyển**, **Servo**, **Cảm biến**, **Dò line**, **Đèn LED RGB**, **Điều khiển từ xa**.
Có sẵn tiếng Việt và tiếng Anh.

Hai điểm cần giữ khi sửa `definition.js`:

- **Chỉ dùng `var` ở phạm vi ngoài cùng**, không dùng `const`/`let`. App nạp file này vào
  scope dùng chung; nếu nạp lại lần thứ hai thì `const` gây `SyntaxError` làm hỏng cả file,
  hậu quả là không khối nào được đăng ký và app báo
  `Invalid block definition for type: ...`. Repo `yolouno_extension_robotics` cũng dính bẫy
  này nên mới phải đặt tên `ImgUrl2`.
- **Không dùng `{{PLACEHOLDER}}` trong `toolbox.xml`.** App này không thay thế chúng,
  tên nhóm sẽ hiện ra là `UNDEFINED`. Ghi text thẳng như Rover.

## Cấu trúc thư mục

| File | Vai trò |
|---|---|
| `xbot_v3.py` | Lớp `XBotV3` và đối tượng `xbot`, gom toàn bộ phần cứng của robot |
| `xbot_ultrasonic.py` | Driver HC-SR04, hỗ trợ cả loại 3 chân và 4 chân |
| `main.py` | Chương trình mặc định: 4 chế độ, đổi bằng nút BOOT |
| `definition.js` | Định nghĩa khối lệnh và bộ sinh code Python |
| `toolbox.xml` | Sắp xếp khối lệnh trong OhStem App |
| `languages/vi.js`, `languages/en.js` | Chuỗi hiển thị |
| `images/` | Icon dùng trong khối lệnh |

Các file còn lại (`drivebase.py`, `motor.py`, `mdv1.py`, `mdv2.py`, `servo.py`, `line_sensor.py`,
`veml6040.py`, `angle_sensor.py`, `mpu6050.py`, `pid.py`, `pcf8574.py`, `vector3d.py`, `gamepad.py`,
`ps4_receiver.py`, `constants.py`) được đồng bộ từ
[yolouno_extension_robotics](https://github.com/AITT-VN/yolouno_extension_robotics)
để mục mở rộng chạy độc lập, không cần cài thêm thư viện khác.

**Một thay đổi so với bản gốc:** trong `drivebase.py`, hàm `follow_line()` gọi
`DIR_FORWARD` / `DIR_BACKWARD` — hai hằng số này thực ra đến từ `mdv1.py` với giá trị `0` và `1`,
mà trong bảng hướng của `DriveBase` thì `1` là `DIR_RF` (chếch phải) chứ không phải lùi.
Bản này đổi thành `DIR_FW` / `DIR_BW` cho đúng.

## Cài đặt

**Phải cài bằng link GitHub, không dùng nút import file ZIP.**

1. Đẩy repo này lên GitHub và để ở chế độ **public**.
2. Trong OhStem App: Mở rộng → thêm bằng link repo, dán
   `https://github.com/truongphat230799/extension_xbot_v3`.

### Vì sao không dùng ZIP

Bản app hiện tại (`app.ohstem.vn`, build `20260816000538`) có lỗi ở đường import ZIP.
Trong `getZipBlocks`, `getZipLibs` và `getZipLanguages` nó gọi:

```js
list.forEach(async function (name) { out.push(await zip.file(prefix + name).async('string')) });
resolve(out);   // resolve chay ngay, forEach voi callback async khong he duoc cho
```

`resolve()` chạy ngay sau `forEach`, trong khi mọi callback async còn đang chờ `await` đầu tiên.
Kết quả là extension được lưu với `blocks: []`, `libs: []`, `languages: {}` — chỉ mỗi `toolbox`
là đúng vì nó được `await` tử tế ở trên. Triệu chứng đúng như vậy: mục lệnh hiện ra bình thường
nhưng kéo khối nào ra cũng báo `Invalid block definition for type: ...`, và tên nhóm hiện
`UNDEFINED` do file ngôn ngữ cũng rỗng. Lỗi này xảy ra với **mọi** extension import bằng ZIP,
không riêng thư viện này.

Đường cài bằng link GitHub dùng `Promise.all` nên chạy đúng.

### Đường dẫn ảnh trong `definition.js`

App dựng URL tài nguyên theo chủ repo:

```js
["thienuittc", "vanminh0910", "AITT-VN"].includes(owner)
  ? "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/" + owner + "/" + repo + "/"
  : "https://raw.githubusercontent.com/" + owner + "/" + repo + "/" + defaultBranch + "/"
```

Repo này thuộc `truongphat230799` nên biến `xbotV3ImgUrl` phải trỏ về `raw.githubusercontent.com`.
Nếu sau này chuyển repo sang tổ chức `AITT-VN` thì đổi lại thành đường dẫn S3.

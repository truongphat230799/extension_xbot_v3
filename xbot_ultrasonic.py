'''
    Cam bien sieu am HC-SR04 cho XBot V3 (ORC Control Hub).

    Ho tro ca 2 kieu dau day:
      - 4 chan: TRIG va ECHO nam tren 2 chan rieng biet
      - 3 chan: TRIG va ECHO dung chung 1 chan (truyen cung 1 pin cho ca 2)
'''

import asyncio
import time
from machine import Pin, time_pulse_us

# Toc do am thanh ~340 m/s => 29.1 us cho moi cm (di va ve => chia 2)
_US_PER_CM = 58.2

# Khoang cach tra ve khi khong do duoc (ngoai tam do hoac chua cam cam bien)
NO_ECHO = 999


class Ultrasonic:
    '''
        Parameters:
            trig (int) - chan phat xung
            echo (int) - chan nhan xung. De None neu dung cam bien 3 chan
            echo_timeout_us (int) - thoi gian toi da cho 1 lan do (mac dinh ~5m)
    '''

    def __init__(self, trig, echo=None, echo_timeout_us=30000):
        self._trig_pin = trig
        self._echo_pin = trig if echo is None else echo
        self._one_wire = (echo is None) or (echo == trig)
        self._echo_timeout_us = echo_timeout_us

        self._trig = Pin(self._trig_pin, Pin.OUT)
        self._trig.value(0)

        if not self._one_wire:
            self._echo = Pin(self._echo_pin, Pin.IN)
        else:
            self._echo = None

        self._last_distance = NO_ECHO

    def _send_pulse_and_wait(self):
        '''
            Phat xung 10us roi do do rong xung tra ve (us).
            Tra ve -1 hoac -2 neu qua thoi gian cho.
        '''
        trig = Pin(self._trig_pin, Pin.OUT)
        trig.value(0)
        time.sleep_us(5)
        trig.value(1)
        time.sleep_us(10)
        trig.value(0)

        if self._one_wire:
            echo = Pin(self._trig_pin, Pin.IN)
        else:
            echo = self._echo

        try:
            return time_pulse_us(echo, 1, self._echo_timeout_us)
        except OSError:
            return -1

    '''
        Doc khoang cach theo cm. Tra ve 999 neu khong do duoc.
    '''
    def distance_cm(self):
        pulse = self._send_pulse_and_wait()

        if pulse < 0:
            return NO_ECHO

        distance = pulse / _US_PER_CM

        if distance <= 0 or distance > 400:
            return NO_ECHO

        self._last_distance = round(distance, 1)
        return self._last_distance

    '''
        Doc khoang cach theo mm.
    '''
    def distance_mm(self):
        distance = self.distance_cm()
        if distance == NO_ECHO:
            return NO_ECHO * 10
        return round(distance * 10, 1)

    '''
        Doc khoang cach nhieu lan roi lay trung vi, giup loc nhieu.

        Parameters:
            samples (int) - so lan do, nen la so le
    '''
    async def distance_cm_avg(self, samples=3):
        values = []
        for _ in range(samples):
            values.append(self.distance_cm())
            await asyncio.sleep_ms(20)
        values.sort()
        return values[len(values) // 2]

    '''
        Kiem tra co vat can trong pham vi chi dinh khong.
    '''
    def detect(self, distance):
        return self.distance_cm() < distance

    '''
        Cho den khi phat hien vat can gan hon khoang cach chi dinh.

        Parameters:
            distance (Number, cm)
            timeout (Number, giay) - toi da cho bao lau, None la cho mai
        Tra ve True neu phat hien, False neu het thoi gian cho.
    '''
    async def wait_for_object(self, distance, timeout=None):
        elapsed = 0
        while True:
            if self.distance_cm() < distance:
                return True
            await asyncio.sleep_ms(50)
            elapsed += 50
            if timeout is not None and elapsed >= timeout * 1000:
                return False


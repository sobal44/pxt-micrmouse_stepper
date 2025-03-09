def Odczyt_czujnikow():
    global Czujnik_Prawy, Czujnik_Lewy, Czujnik_Przod
    pins.digital_write_pin(DigitalPin.P0, 1)
    pins.digital_write_pin(DigitalPin.P1, 0)
    Rangefinder.init()
    Czujnik_Prawy = Rangefinder.distance()
    pins.digital_write_pin(DigitalPin.P1, 1)
    pins.digital_write_pin(DigitalPin.P0, 0)
    Rangefinder.init()
    Czujnik_Lewy = Rangefinder.distance()
    Czujnik_Przod = makerbit.get_ultrasonic_distance(DistanceUnit.CM)

def on_sound_loud():
    global lista
    lista = [0, 1]
input.on_sound(DetectedSound.LOUD, on_sound_loud)

def Kalibracja_o_tylnia_sciane():
    sobal.Silnik_Krokowy_Ruch_na_odleglosc(sobal.Dir.CW, 55, 175, 3500, 55.7)
    Odczyt_czujnikow()

def on_button_pressed_a():
    global Labirynt_X
    if Set_Up_Target == 0:
        Labirynt_X += 1
        if Labirynt_X >= 5:
            Labirynt_X = 0
        for idex_X in range(5):
            for index2 in range(5):
                led.unplot(idex_X, index2)
input.on_button_pressed(Button.A, on_button_pressed_a)

def Wgrani_labiryntu_bez_scian(Ilosc_komorek_w_labiryncie: number):
    global Sciany_Labiryntu
    Sciany_Labiryntu = []
    j = 0
    while j <= Ilosc_komorek_w_labiryncie:
        Sciany_Labiryntu.append(0)
        j += 1
def Ruch_Lewo():
    global Orientacja_Robota
    sobal.Silnik_Krokowy_Obrot(sobal.Dir.CCW, 90, 175, 3050, 55.7)
    Orientacja_Robota = Orientacja_Robota - 1
    if True:
        if Orientacja_Robota < -1:
            Orientacja_Robota = 2

def on_logo_pressed():
    Wylanie_Wody(Wilekosc_Labiryntu_X, Wielkosc_Labiryntu_Y2)
    Przeszukanie_Labiryntu()
input.on_logo_event(TouchButtonEvent.PRESSED, on_logo_pressed)

def Wylanie_Wody(Wielkosc_Lbairyntu_X: number, Wielkosc_Labiryntu_Y: number):
    global Labirynt
    Labirynt = []
    Index_Y = 0
    while Index_Y <= Wielkosc_Labiryntu_Y:
        idex_X2 = 0
        while idex_X2 <= Wielkosc_Lbairyntu_X:
            Labirynt.append(abs(idex_X2 - Labirynt_X) + abs(Index_Y - Labirynt_Y))
            idex_X2 += 1
        Index_Y += 1
    music.play(music.tone_playable(131, music.beat(BeatFraction.BREVE)),
        music.PlaybackMode.UNTIL_DONE)
    serial.write_line("Wylano Wode")
    wysłanie_Tablicy_przez_port_szeregowy(Labirynt)
    return Labirynt
def wysłanie_Tablicy_przez_port_szeregowy(array: List[any]):
    global i
    while i <= Wilekosc_Labiryntu_X:
        serial.write_numbers([array[5 * abs(4 - i) + 0],
                array[5 * abs(4 - i) + 1],
                array[5 * abs(4 - i) + 2],
                array[5 * abs(4 - i) + 3],
                array[5 * abs(4 - i) + 4]])
        i += 1

def on_button_pressed_ab():
    global Set_Up_Target
    if Set_Up_Target == 0:
        Set_Up_Target = 1
        basic.show_string("X")
        basic.show_number(Labirynt_X)
        basic.show_string("Y")
        basic.show_number(Labirynt_Y)
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def Update_Scian_Labiryntu():
    pass
def Ruch_Obrot_Prawo():
    global Orientacja_Robota
    sobal.Silnik_Krokowy_Obrot(sobal.Dir.CW, 90, 175, 3050, 55.7)
    Orientacja_Robota = Orientacja_Robota + 1
    if Orientacja_Robota > 2:
        Orientacja_Robota = -1

def on_button_pressed_b():
    global Labirynt_Y
    if Set_Up_Target == 0:
        Labirynt_Y += 1
        if Labirynt_Y >= 5:
            Labirynt_Y = 0
        for Index_Y2 in range(5):
            for index22 in range(5):
                led.unplot(Index_Y2, index22)
input.on_button_pressed(Button.B, on_button_pressed_b)

def Ruch_Przod():
    sobal.Silnik_Krokowy_Ruch_na_odleglosc(sobal.Dir.CW, 180, 175, 3500, 55.7)
    music.play(music.tone_playable(587, music.beat(BeatFraction.WHOLE)),
        music.PlaybackMode.UNTIL_DONE)
    basic.show_number(polozenie_w_labiryncie)
    Odczyt_czujnikow()

def on_gesture_shake():
    motor.motor_stop_all()
input.on_gesture(Gesture.SHAKE, on_gesture_shake)

def Przeszukanie_Labiryntu():
    global polozenie_w_labiryncie
    sobal.Silnik_Krokowy_Ruch_na_odleglosc(sobal.Dir.CW, 45, 175, 3500, 55.7)
    Ruch_Przod()
    polozenie_w_labiryncie = polozenie_w_labiryncie + 5
    while Labirynt[polozenie_w_labiryncie] != 0:
        if Orientacja_Robota == 0:
            if Labirynt[polozenie_w_labiryncie + (Wilekosc_Labiryntu_X + 1)] < Labirynt[polozenie_w_labiryncie] and makerbit.get_ultrasonic_distance(DistanceUnit.CM) > 5:
                polozenie_w_labiryncie = polozenie_w_labiryncie + 5
                Ruch_Przod()
            elif Labirynt[polozenie_w_labiryncie + 1] < Labirynt[polozenie_w_labiryncie] and Czujnik_Prawy > 60:
                polozenie_w_labiryncie = polozenie_w_labiryncie + 1
                Ruch_Obrot_Prawo()
                Ruch_Przod()
            elif Labirynt[polozenie_w_labiryncie - 1] < Labirynt[polozenie_w_labiryncie] and Czujnik_Lewy > 60:
                polozenie_w_labiryncie = polozenie_w_labiryncie - 1
                Ruch_Lewo()
                Ruch_Przod()
            else:
                polozenie_w_labiryncie = polozenie_w_labiryncie - 5
                Ruch_Lewo()
                Ruch_Lewo()
                Ruch_Przod()
        elif Orientacja_Robota == 1:
            if Labirynt[polozenie_w_labiryncie + (Wilekosc_Labiryntu_X + 1)] < Labirynt[polozenie_w_labiryncie] and Czujnik_Lewy > 60:
                polozenie_w_labiryncie = polozenie_w_labiryncie + 5
                Ruch_Lewo()
                Ruch_Przod()
            elif Labirynt[polozenie_w_labiryncie + 1] < Labirynt[polozenie_w_labiryncie] and makerbit.get_ultrasonic_distance(DistanceUnit.CM) > 5:
                polozenie_w_labiryncie = polozenie_w_labiryncie + 1
                Ruch_Przod()
            elif Labirynt[polozenie_w_labiryncie - (Wilekosc_Labiryntu_X + 1)] < Labirynt[polozenie_w_labiryncie] and Czujnik_Prawy > 60:
                polozenie_w_labiryncie = polozenie_w_labiryncie - 5
                Ruch_Obrot_Prawo()
                Ruch_Przod()
            else:
                polozenie_w_labiryncie = polozenie_w_labiryncie - 1
                Ruch_Obrot_Prawo()
                Ruch_Obrot_Prawo()
                Ruch_Przod()
        elif Orientacja_Robota == -1:
            if Labirynt[polozenie_w_labiryncie + (Wilekosc_Labiryntu_X + 1)] < Labirynt[polozenie_w_labiryncie] and Czujnik_Prawy > 60:
                polozenie_w_labiryncie = polozenie_w_labiryncie + 5
                Ruch_Obrot_Prawo()
                Ruch_Przod()
            elif Labirynt[polozenie_w_labiryncie - 1] < Labirynt[polozenie_w_labiryncie] and makerbit.get_ultrasonic_distance(DistanceUnit.CM) > 5:
                polozenie_w_labiryncie = polozenie_w_labiryncie - 1
                Ruch_Przod()
            elif Labirynt[polozenie_w_labiryncie - (Wilekosc_Labiryntu_X + 1)] < Labirynt[polozenie_w_labiryncie] and Czujnik_Lewy > 60:
                polozenie_w_labiryncie = polozenie_w_labiryncie - 5
                Ruch_Lewo()
                Ruch_Przod()
            else:
                polozenie_w_labiryncie = polozenie_w_labiryncie + 1
                Ruch_Lewo()
                Ruch_Lewo()
                Ruch_Przod()
        elif Orientacja_Robota == 2:
            if Labirynt[polozenie_w_labiryncie - 1] < Labirynt[polozenie_w_labiryncie] and Czujnik_Prawy > 60:
                polozenie_w_labiryncie = polozenie_w_labiryncie - 1
                Ruch_Obrot_Prawo()
                Ruch_Przod()
            elif Labirynt[polozenie_w_labiryncie - (Wilekosc_Labiryntu_X + 1)] < Labirynt[polozenie_w_labiryncie] and makerbit.get_ultrasonic_distance(DistanceUnit.CM) > 5:
                polozenie_w_labiryncie = polozenie_w_labiryncie - 5
                Ruch_Przod()
            elif Labirynt[polozenie_w_labiryncie + 1] < Labirynt[polozenie_w_labiryncie] and Czujnik_Lewy > 60:
                polozenie_w_labiryncie = polozenie_w_labiryncie + 1
                Ruch_Lewo()
                Ruch_Przod()
            else:
                polozenie_w_labiryncie = polozenie_w_labiryncie + 5
                Ruch_Obrot_Prawo()
                Ruch_Obrot_Prawo()
                Ruch_Przod()
    music._play_default_background(music.built_in_playable_melody(Melodies.FUNK),
        music.PlaybackMode.IN_BACKGROUND)
    basic.show_string("P")
    basic.show_number(polozenie_w_labiryncie)
polozenie_w_labiryncie = 0
i = 0
Labirynt: List[number] = []
lista: List[number] = []
Czujnik_Przod = 0
Czujnik_Lewy = 0
Czujnik_Prawy = 0
Sciany_Labiryntu: List[number] = []
Orientacja_Robota = 0
Wielkosc_Labiryntu_Y2 = 0
Wilekosc_Labiryntu_X = 0
Labirynt_Y = 0
Labirynt_X = 0
Set_Up_Target = 0
motor.motor_stop_all()
serial.write_line("MicroMouse")
makerbit.connect_ultrasonic_distance_sensor(DigitalPin.P15, DigitalPin.P16)
Set_Up_Target = 0
Labirynt_X = 0
Labirynt_Y = 0
Wilekosc_Labiryntu_X = 4
Wielkosc_Labiryntu_Y2 = 4
# Orientacja Robota wzgledem labiryntu
# o = Przod
# 1 = Prawo
# -1 = Lewo
# 2 = Tył
Orientacja_Robota = 0
Ilosc_komorek_w_labiryncie2 = Wielkosc_Labiryntu_Y2 * Wilekosc_Labiryntu_X + (Wielkosc_Labiryntu_Y2 + Wilekosc_Labiryntu_X)
Wgrani_labiryntu_bez_scian(Ilosc_komorek_w_labiryncie2)
basic.show_string("TARGET")
serial.write_line("Sciany Labiryntu")
wysłanie_Tablicy_przez_port_szeregowy(Sciany_Labiryntu)

def on_forever():
    if Set_Up_Target == 0:
        led.plot(Labirynt_X, 4 - Labirynt_Y)
basic.forever(on_forever)

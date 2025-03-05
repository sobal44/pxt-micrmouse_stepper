def Odczyt_czujnikow():
    global Czujnik_Prawy, Czujnik_Lewy, Czujnik_Przod
    pins.digital_write_pin(DigitalPin.P0, 1)
    pins.digital_write_pin(DigitalPin.P1, 0)
    Rangefinder.init()
    Czujnik_Prawy = Rangefinder.distance()
    pins.digital_write_pin(DigitalPin.P0, 0)
    pins.digital_write_pin(DigitalPin.P1, 1)
    Rangefinder.init()
    Czujnik_Lewy = Rangefinder.distance()
    Czujnik_Przod = makerbit.get_ultrasonic_distance(DistanceUnit.CM)

def on_button_pressed_a():
    Przeszukanie_Labiryntu()
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_b():
    sobal.Silnik_Krokowy_Obrot(sobal.Dir.CW, 90, 175, 3050, 55.7)
input.on_button_pressed(Button.B, on_button_pressed_b)

def Przeszukanie_Labiryntu():
    global Labirynt
    Labirynt = [[0, 0, 0, 0, 0, 0, 0], [0], [0], [0]]
    sobal.Silnik_Krokowy_Ruch_na_odleglosc(sobal.Dir.CW, 450, 175, 3500, 55.7)
    sobal.Silnik_Krokowy_Ruch_na_odleglosc(sobal.Dir.CW, 180, 175, 3500, 55.7)
    Odczyt_czujnikow()
Labirynt: List[List[number]] = []
Czujnik_Przod = 0
Czujnik_Lewy = 0
Czujnik_Prawy = 0
makerbit.connect_ultrasonic_distance_sensor(DigitalPin.P15, DigitalPin.P16)

def on_forever():
    Odczyt_czujnikow()
    basic.show_icon(IconNames.HEART)
    basic.show_number(Czujnik_Lewy)
    basic.show_number(Czujnik_Prawy)
    basic.show_number(Czujnik_Przod)
basic.forever(on_forever)

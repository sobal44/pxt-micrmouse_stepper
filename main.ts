function Odczyt_czujnikow () {
    pins.digitalWritePin(DigitalPin.P0, 1)
    pins.digitalWritePin(DigitalPin.P1, 0)
    Rangefinder.init()
    Czujnik_Prawy = Rangefinder.distance()
    pins.digitalWritePin(DigitalPin.P0, 0)
    pins.digitalWritePin(DigitalPin.P1, 1)
    Rangefinder.init()
    Czujnik_Lewy = Rangefinder.distance()
    Czujnik_Przod = makerbit.getUltrasonicDistance(DistanceUnit.CM)
}
function Przeszukanie_Labiryntu () {
    sobal.Silnik_Krokowy_Ruch_na_odleglosc(
    sobal.Dir.CW,
    450,
    175,
    3500,
    55.7
    )
    Odczyt_czujnikow()
}
input.onButtonPressed(Button.A, function () {
    Przeszukanie_Labiryntu()
})
input.onButtonPressed(Button.B, function () {
    sobal.Silnik_Krokowy_Obrot(
    sobal.Dir.CW,
    90,
    175,
    3050,
    55.7
    )
})
let Czujnik_Przod = 0
let Czujnik_Lewy = 0
let Czujnik_Prawy = 0
makerbit.connectUltrasonicDistanceSensor(DigitalPin.P15, DigitalPin.P16)
basic.forever(function () {
    Odczyt_czujnikow()
    basic.showIcon(IconNames.Heart)
    basic.showNumber(Czujnik_Lewy)
    basic.showNumber(Czujnik_Prawy)
    basic.showNumber(Czujnik_Przod)
})

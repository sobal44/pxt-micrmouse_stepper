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
    Labirynt = []
    sobal.Silnik_Krokowy_Ruch_na_odleglosc(
    sobal.Dir.CW,
    45,
    175,
    3500,
    55.7
    )
    music.play(music.tonePlayable(587, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
    sobal.Silnik_Krokowy_Ruch_na_odleglosc(
    sobal.Dir.CW,
    180,
    175,
    3500,
    55.7
    )
    sobal.Silnik_Krokowy_Obrot(
    sobal.Dir.CW,
    90,
    175,
    3050,
    55.7
    )
    Odczyt_czujnikow()
}
input.onButtonPressed(Button.A, function () {
    if (Set_Up_Target == 0) {
        Labirynt_X += 1
        if (Labirynt_X >= 5) {
            Labirynt_X = 0
        }
        for (let indeks = 0; indeks <= 4; indeks++) {
            for (let index2 = 0; index2 <= 4; index2++) {
                led.unplot(indeks, index2)
            }
        }
    }
})
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    Przeszukanie_Labiryntu()
})
input.onButtonPressed(Button.AB, function () {
    if (Set_Up_Target == 0) {
        Set_Up_Target = 1
        basic.showString("X")
        basic.showNumber(Labirynt_X)
        basic.showString("Y")
        basic.showNumber(Labirynt_Y)
    }
})
input.onButtonPressed(Button.B, function () {
    if (Set_Up_Target == 0) {
        Labirynt_Y += 1
        if (Labirynt_Y >= 5) {
            Labirynt_Y = 0
        }
        for (let indeks = 0; indeks <= 4; indeks++) {
            for (let index2 = 0; index2 <= 4; index2++) {
                led.unplot(indeks, index2)
            }
        }
    }
})
let Labirynt: number[] = []
let Czujnik_Przod = 0
let Czujnik_Lewy = 0
let Czujnik_Prawy = 0
let Labirynt_Y = 0
let Labirynt_X = 0
let Set_Up_Target = 0
motor.motorStopAll()
music._playDefaultBackground(music.builtInPlayableMelody(Melodies.PowerUp), music.PlaybackMode.InBackground)
makerbit.connectUltrasonicDistanceSensor(DigitalPin.P15, DigitalPin.P16)
Set_Up_Target = 0
Labirynt_X = 0
Labirynt_Y = 0
basic.showString("TARGET")
basic.forever(function () {
    if (Set_Up_Target == 0) {
        led.plot(4 - Labirynt_X, 4 - Labirynt_Y)
    }
})

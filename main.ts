function Odczyt_czujnikow () {
    pins.digitalWritePin(DigitalPin.P0, 1)
    pins.digitalWritePin(DigitalPin.P1, 0)
    Rangefinder.init()
    Czujnik_Prawy = Rangefinder.distance()
    pins.digitalWritePin(DigitalPin.P1, 1)
    pins.digitalWritePin(DigitalPin.P0, 0)
    Rangefinder.init()
    Czujnik_Lewy = Rangefinder.distance()
    Czujnik_Przod = makerbit.getUltrasonicDistance(DistanceUnit.CM)
}
function Kalibracja_o_tylnia_sciane () {
    sobal.Silnik_Krokowy_Ruch_na_odleglosc(
    sobal.Dir.CW,
    55,
    175,
    3500,
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
        for (let idex_X = 0; idex_X <= 4; idex_X++) {
            for (let index2 = 0; index2 <= 4; index2++) {
                led.unplot(idex_X, index2)
            }
        }
    }
})
function Ruch_Lewo () {
    sobal.Silnik_Krokowy_Obrot(
    sobal.Dir.CCW,
    90,
    175,
    3050,
    55.7
    )
    Orientacja_Robota = Orientacja_Robota - 1
    if (true) {
        if (Orientacja_Robota < -1) {
            Orientacja_Robota = 2
        }
    }
}
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    Wylanie_Wody()
    Przeszukanie_Labiryntu()
})
function Wylanie_Wody () {
    let idex_X2: number;
Labirynt = []
    while (Index_Y <= Wielkosc_Labiryntu_Y) {
        idex_X2 = 0
        while (idex_X2 <= Wilekosc_Labiryntu_X) {
            Labirynt.push(Math.abs(idex_X2 - Labirynt_X) + Math.abs(Index_Y - Labirynt_Y))
            idex_X2 += 1
        }
        Index_Y += 1
    }
    music.play(music.tonePlayable(131, music.beat(BeatFraction.Breve)), music.PlaybackMode.UntilDone)
    serial.writeLine("Wylano Wode")
    while (i <= Wilekosc_Labiryntu_X) {
        serial.writeNumbers([
        Labirynt[5 * Math.abs(4 - i) + 0],
        Labirynt[5 * Math.abs(4 - i) + 1],
        Labirynt[5 * Math.abs(4 - i) + 2],
        Labirynt[5 * Math.abs(4 - i) + 3],
        Labirynt[5 * Math.abs(4 - i) + 4]
        ])
        i += 1
    }
}
input.onButtonPressed(Button.AB, function () {
    if (Set_Up_Target == 0) {
        Set_Up_Target = 1
        basic.showString("X")
        basic.showNumber(Labirynt_X)
        basic.showString("Y")
        basic.showNumber(Labirynt_Y)
    }
})
function Ruch_Obrot_Prawo () {
    sobal.Silnik_Krokowy_Obrot(
    sobal.Dir.CW,
    90,
    175,
    3050,
    55.7
    )
    Orientacja_Robota = Orientacja_Robota + 1
    if (Orientacja_Robota > 2) {
        Orientacja_Robota = -1
    }
}
input.onButtonPressed(Button.B, function () {
    if (Set_Up_Target == 0) {
        Labirynt_Y += 1
        if (Labirynt_Y >= 5) {
            Labirynt_Y = 0
        }
        for (let Index_Y2 = 0; Index_Y2 <= 4; Index_Y2++) {
            for (let index22 = 0; index22 <= 4; index22++) {
                led.unplot(Index_Y2, index22)
            }
        }
    }
})
function Ruch_Przod () {
    sobal.Silnik_Krokowy_Ruch_na_odleglosc(
    sobal.Dir.CW,
    180,
    175,
    3500,
    55.7
    )
    music.play(music.tonePlayable(587, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
    basic.showNumber(polozenie_w_labiryncie)
    Odczyt_czujnikow()
}
function Przeszukanie_Labiryntu () {
    sobal.Silnik_Krokowy_Ruch_na_odleglosc(
    sobal.Dir.CW,
    45,
    175,
    3500,
    55.7
    )
    Ruch_Przod()
    polozenie_w_labiryncie = polozenie_w_labiryncie + 5
    while (Labirynt[polozenie_w_labiryncie] != 0) {
        if (Orientacja_Robota == 0) {
            if (Labirynt[polozenie_w_labiryncie + (Wilekosc_Labiryntu_X + 1)] < Labirynt[polozenie_w_labiryncie] && makerbit.getUltrasonicDistance(DistanceUnit.CM) > 5) {
                polozenie_w_labiryncie = polozenie_w_labiryncie + 5
                Ruch_Przod()
            } else if (Labirynt[polozenie_w_labiryncie + 1] < Labirynt[polozenie_w_labiryncie] && Czujnik_Prawy > 60) {
                polozenie_w_labiryncie = polozenie_w_labiryncie + 1
                Ruch_Obrot_Prawo()
                Ruch_Przod()
            } else if (Labirynt[polozenie_w_labiryncie - 1] < Labirynt[polozenie_w_labiryncie] && Czujnik_Lewy > 60) {
                polozenie_w_labiryncie = polozenie_w_labiryncie - 1
                Ruch_Lewo()
                Ruch_Przod()
            } else {
                polozenie_w_labiryncie = polozenie_w_labiryncie - 5
                Ruch_Lewo()
                Ruch_Lewo()
                Ruch_Przod()
            }
        } else if (Orientacja_Robota == 1) {
            if (Labirynt[polozenie_w_labiryncie + (Wilekosc_Labiryntu_X + 1)] < Labirynt[polozenie_w_labiryncie] && Czujnik_Lewy > 60) {
                polozenie_w_labiryncie = polozenie_w_labiryncie + 5
                Ruch_Lewo()
                Ruch_Przod()
            } else if (Labirynt[polozenie_w_labiryncie + 1] < Labirynt[polozenie_w_labiryncie] && makerbit.getUltrasonicDistance(DistanceUnit.CM) > 5) {
                polozenie_w_labiryncie = polozenie_w_labiryncie + 1
                Ruch_Przod()
            } else if (Labirynt[polozenie_w_labiryncie - (Wilekosc_Labiryntu_X + 1)] < Labirynt[polozenie_w_labiryncie] && Czujnik_Prawy > 60) {
                polozenie_w_labiryncie = polozenie_w_labiryncie - 5
                Ruch_Obrot_Prawo()
                Ruch_Przod()
            } else {
                polozenie_w_labiryncie = polozenie_w_labiryncie - 1
                Ruch_Obrot_Prawo()
                Ruch_Obrot_Prawo()
                Ruch_Przod()
            }
        } else if (Orientacja_Robota == -1) {
            if (Labirynt[polozenie_w_labiryncie + (Wilekosc_Labiryntu_X + 1)] < Labirynt[polozenie_w_labiryncie] && Czujnik_Prawy > 60) {
                polozenie_w_labiryncie = polozenie_w_labiryncie + 5
                Ruch_Obrot_Prawo()
                Ruch_Przod()
            } else if (Labirynt[polozenie_w_labiryncie - 1] < Labirynt[polozenie_w_labiryncie] && makerbit.getUltrasonicDistance(DistanceUnit.CM) > 5) {
                polozenie_w_labiryncie = polozenie_w_labiryncie - 1
                Ruch_Przod()
            } else if (Labirynt[polozenie_w_labiryncie - (Wilekosc_Labiryntu_X + 1)] < Labirynt[polozenie_w_labiryncie] && Czujnik_Lewy > 60) {
                polozenie_w_labiryncie = polozenie_w_labiryncie - 5
                Ruch_Lewo()
                Ruch_Przod()
            } else {
                polozenie_w_labiryncie = polozenie_w_labiryncie + 1
                Ruch_Lewo()
                Ruch_Lewo()
                Ruch_Przod()
            }
        } else if (Orientacja_Robota == 2) {
            if (Labirynt[polozenie_w_labiryncie - 1] < Labirynt[polozenie_w_labiryncie] && Czujnik_Prawy > 60) {
                polozenie_w_labiryncie = polozenie_w_labiryncie - 1
                Ruch_Obrot_Prawo()
                Ruch_Przod()
            } else if (Labirynt[polozenie_w_labiryncie - (Wilekosc_Labiryntu_X + 1)] < Labirynt[polozenie_w_labiryncie] && makerbit.getUltrasonicDistance(DistanceUnit.CM) > 5) {
                polozenie_w_labiryncie = polozenie_w_labiryncie - 5
                Ruch_Przod()
            } else if (Labirynt[polozenie_w_labiryncie + 1] < Labirynt[polozenie_w_labiryncie] && Czujnik_Lewy > 60) {
                polozenie_w_labiryncie = polozenie_w_labiryncie + 1
                Ruch_Lewo()
                Ruch_Przod()
            } else {
                polozenie_w_labiryncie = polozenie_w_labiryncie + 5
                Ruch_Obrot_Prawo()
                Ruch_Obrot_Prawo()
                Ruch_Przod()
            }
        }
    }
    music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Funk), music.PlaybackMode.InBackground)
    basic.showString("P")
    basic.showNumber(polozenie_w_labiryncie)
}
let polozenie_w_labiryncie = 0
let i = 0
let Index_Y = 0
let Labirynt: number[] = []
let Czujnik_Przod = 0
let Czujnik_Lewy = 0
let Czujnik_Prawy = 0
let Orientacja_Robota = 0
let Wielkosc_Labiryntu_Y = 0
let Wilekosc_Labiryntu_X = 0
let Labirynt_Y = 0
let Labirynt_X = 0
let Set_Up_Target = 0
motor.motorStopAll()
serial.writeLine("MicroMouse")
makerbit.connectUltrasonicDistanceSensor(DigitalPin.P15, DigitalPin.P16)
Set_Up_Target = 0
Labirynt_X = 0
Labirynt_Y = 0
Wilekosc_Labiryntu_X = 4
Wielkosc_Labiryntu_Y = 4
// Orientacja Robota wzgledem labiryntu
// o = Przod
// 1 = Prawo
// -1 = Lewo
// 2 = Tył
Orientacja_Robota = 0
basic.showString("TARGET")
basic.forever(function () {
    if (Set_Up_Target == 0) {
        led.plot(Labirynt_X, 4 - Labirynt_Y)
    }
})

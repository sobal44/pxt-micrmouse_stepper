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
input.onSound(DetectedSound.Loud, function () {
    Wylanie_Wody(Wilekosc_Labiryntu_X, Wielkosc_Labiryntu_Y2)
    serial.writeLine("Update wylania wody")
    Update_wylania_wody()
})
function Kalibracja_o_tylnia_sciane () {
    sobal.Silnik_Krokowy_Ruch_na_odleglosc(
    sobal.Dir.CW,
    55,
    150,
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
function Wgrani_labiryntu_bez_scian (Ilosc_komorek_w_labiryncie: number) {
    Sciany_Labiryntu.push(8)
    while (l <= Ilosc_komorek_w_labiryncie - 1) {
        Sciany_Labiryntu.push(0)
        l += 1
    }
    for (let indeks = 0; indeks <= Wilekosc_Labiryntu_X; indeks++) {
        Sciany_Labiryntu[indeks] = 8
    }
    for (let indeks2 = 0; indeks2 <= Wilekosc_Labiryntu_X; indeks2++) {
        Sciany_Labiryntu[Wilekosc_Labiryntu_X + Wielkosc_Labiryntu_Y2 * Wilekosc_Labiryntu_X + indeks2] = 2
    }
    for (let indeks3 = 0; indeks3 <= Wielkosc_Labiryntu_Y2; indeks3++) {
        Sciany_Labiryntu[(Wielkosc_Labiryntu_Y2 + 1) * indeks3] = 2
    }
    for (let indeks4 = 0; indeks4 <= Wielkosc_Labiryntu_Y2; indeks4++) {
        Sciany_Labiryntu[(Wielkosc_Labiryntu_Y2 + 1) * indeks4 + Wielkosc_Labiryntu_Y2] = 4
    }
    Sciany_Labiryntu[0] = 9
    Sciany_Labiryntu[Wilekosc_Labiryntu_X] = 12
    Sciany_Labiryntu[Wielkosc_Labiryntu_Y2 * (Wilekosc_Labiryntu_X + 1)] = 3
    Sciany_Labiryntu[Wilekosc_Labiryntu_X + Wielkosc_Labiryntu_Y2 + Wilekosc_Labiryntu_X * Wielkosc_Labiryntu_Y2] = 6
}
function Ruch_Lewo () {
    sobal.Silnik_Krokowy_Obrot(
    sobal.Dir.CCW,
    90,
    150,
    3375,
    55.7
    )
    Orientacja_Robota = Orientacja_Robota - 1
    if (Orientacja_Robota < -1) {
        Orientacja_Robota = 2
    }
}
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    Wylanie_Wody(Wilekosc_Labiryntu_X, Wielkosc_Labiryntu_Y2)
    Przeszukanie_Labiryntu()
})
function Wylanie_Wody (Wielkosc_Lbairyntu_X: number, Wielkosc_Labiryntu_Y: number) {
    while (Index_Y <= Wielkosc_Labiryntu_Y) {
        idex_X2 = 0
        while (idex_X2 <= Wielkosc_Lbairyntu_X) {
            Labirynt.push(Math.abs(idex_X2 - Labirynt_X) + Math.abs(Index_Y - Labirynt_Y))
            idex_X2 += 1
        }
        Index_Y += 1
    }
    music.play(music.tonePlayable(131, music.beat(BeatFraction.Half)), music.PlaybackMode.UntilDone)
    serial.writeLine("Wylano Wode")
    // Sciany W labiryncie
    // 
    // |1
    // 
    // _
    // 2
    // 
    // 4|
    // 
    // 8
    // -
    wyslanie_Tablicy_przez_port_szeregowy(Labirynt)
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
function Update_Scian_Labiryntu (Lewa: number, Przod: number, Prawa: number, Orientacja: number) {
    if (Orientacja == 0) {
        if (Przod < Limit_Przod && (Lewa < Limit_Lewo && Prawa < Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 7
        }
        if (Przod > Limit_Przod && (Lewa < Limit_Lewo && Prawa < Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 5
        }
        if (Przod < Limit_Przod && (Lewa > Limit_Lewo && Prawa < Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 6
        }
        if (Przod > Limit_Przod && (Lewa > Limit_Lewo && Prawa < Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 4
        }
        if (Przod < Limit_Przod && (Lewa < Limit_Lewo && Prawa > Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 3
        }
        if (Przod > Limit_Przod && (Lewa < Limit_Lewo && Prawa > Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 1
        }
        if (Przod < Limit_Przod && (Lewa > Limit_Lewo && Prawa > Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 2
        }
        if (Przod > Limit_Przod && (Lewa > Limit_Lewo && Prawa > Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 0
        }
    }
    if (Orientacja == -1) {
        if (Przod < Limit_Przod && (Lewa < Limit_Lewo && Prawa < Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 11
        }
        if (Przod > Limit_Przod && (Lewa < Limit_Lewo && Prawa < Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 10
        }
        if (Przod < Limit_Przod && (Lewa > Limit_Lewo && Prawa < Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 3
        }
        if (Przod > Limit_Przod && (Lewa > Limit_Lewo && Prawa < Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 2
        }
        if (Przod < Limit_Przod && (Lewa < Limit_Lewo && Prawa > Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 9
        }
        if (Przod > Limit_Przod && (Lewa < Limit_Lewo && Prawa > Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 8
        }
        if (Przod < Limit_Przod && (Lewa > Limit_Lewo && Prawa > Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 1
        }
        if (Przod > Limit_Przod && (Lewa > Limit_Lewo && Prawa > Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 0
        }
    }
    if (Orientacja == 1) {
        if (Przod < Limit_Przod && (Lewa < Limit_Lewo && Prawa < Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 14
        }
        if (Przod > Limit_Przod && (Lewa < Limit_Lewo && Prawa < Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 10
        }
        if (Przod < Limit_Przod && (Lewa > Limit_Lewo && Prawa < Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 12
        }
        if (Przod > Limit_Przod && (Lewa > Limit_Lewo && Prawa < Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 8
        }
        if (Przod < Limit_Przod && (Lewa < Limit_Lewo && Prawa > Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 6
        }
        if (Przod > Limit_Przod && (Lewa < Limit_Lewo && Prawa > Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 2
        }
        if (Przod < Limit_Przod && (Lewa > Limit_Lewo && Prawa > Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 4
        }
        if (Przod > Limit_Przod && (Lewa > Limit_Lewo && Prawa > Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 0
        }
    }
    if (Orientacja == 2) {
        if (Przod < Limit_Przod && (Lewa < Limit_Lewo && Prawa < Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 13
        }
        if (Przod > Limit_Przod && (Lewa < Limit_Lewo && Prawa < Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 5
        }
        if (Przod < Limit_Przod && (Lewa > Limit_Lewo && Prawa < Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 9
        }
        if (Przod > Limit_Przod && (Lewa > Limit_Lewo && Prawa < Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 1
        }
        if (Przod < Limit_Przod && (Lewa < Limit_Lewo && Prawa > Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 12
        }
        if (Przod > Limit_Przod && (Lewa < Limit_Lewo && Prawa > Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 4
        }
        if (Przod < Limit_Przod && (Lewa > Limit_Lewo && Prawa > Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 8
        }
        if (Przod > Limit_Przod && (Lewa > Limit_Lewo && Prawa > Limit_Prawo)) {
            Sciany_Labiryntu[polozenie_w_labiryncie] = 0
        }
    }
}
function Ruch_Obrot_Prawo () {
    sobal.Silnik_Krokowy_Obrot(
    sobal.Dir.CW,
    90,
    150,
    3375,
    55.7
    )
    Orientacja_Robota = Orientacja_Robota + 1
    if (Orientacja_Robota > 2) {
        Orientacja_Robota = -1
    }
}
// Zmienna Test jest tylko do sprawdzenia poprawnosci wylania wody
function Update_wylania_wody () {
    test = [
    13,
    13,
    9,
    10,
    12,
    3,
    4,
    5,
    9,
    6,
    9,
    6,
    5,
    3,
    12,
    3,
    10,
    6,
    9,
    6,
    11,
    10,
    10,
    2,
    14
    ]
    Kolejka = []
    // Dodje Komurke Cel do Kolejki
    Kolejka.push(Labirynt_Y * (1 + Wilekosc_Labiryntu_X) + Labirynt_X)
    Kolejka_step = 1
    while (Kolejka.length != 0) {
        // Sprawdzenie czy jest scianka na kierunku
        if ((Sciany_Labiryntu[Kolejka[0]] & 1) == 0) {
            if (Labirynt[Kolejka[0] - 1] < 100) {
                Kolejka.push(Kolejka[0] - 1)
                Labirynt[Kolejka[0] - 1] = Labirynt[Kolejka[0]] + 1
                serial.writeValue("E", test[Kolejka[0]] & 1)
            }
        }
        if ((Sciany_Labiryntu[Kolejka[0]] & 2) == 0) {
            if (Labirynt[Kolejka[0] + 5] < 100) {
                Kolejka.push(Kolejka[0] + 5)
                Labirynt[Kolejka[0] + 5] = Labirynt[Kolejka[0]] + 1
                serial.writeValue("N", test[Kolejka[0]] & 2)
            }
        }
        if ((Sciany_Labiryntu[Kolejka[0]] & 4) == 0) {
            if (Labirynt[Kolejka[0] + 1] < 100) {
                Labirynt[Kolejka[0] + 1] = Labirynt[Kolejka[0]] + 1
                serial.writeValue("W", test[Kolejka[0]] & 4)
                Kolejka.push(Kolejka[0] + 1)
            }
        }
        if ((Sciany_Labiryntu[Kolejka[0]] & 8) == 0) {
            if (Labirynt[Kolejka[0] - 5] < 100) {
                Labirynt[Kolejka[0] - 5] = Labirynt[Kolejka[0]] + 1
                serial.writeValue("W", test[Kolejka[0]] & 8)
                Kolejka.push(Kolejka[0] - 5)
            }
        }
        Labirynt[Kolejka[0]] = Labirynt[Kolejka[0]] + 1000
        Kolejka_step += 1
        Kolejka.shift()
        serial.writeValue("x", Kolejka_step)
    }
    serial.writeLine("")
    wyslanie_Tablicy_przez_port_szeregowy(Labirynt)
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
    150,
    3500,
    55.7
    )
    music.play(music.tonePlayable(587, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
    basic.showNumber(polozenie_w_labiryncie)
    Odczyt_czujnikow()
}
function wyslanie_Tablicy_przez_port_szeregowy (array: number[]) {
    for (let j = 0; j <= Wilekosc_Labiryntu_X; j++) {
        for (let indeks5 = 0; indeks5 <= Wielkosc_Labiryntu_Y2; indeks5++) {
            serial.writeNumber(array[(Wilekosc_Labiryntu_X + 1) * Math.abs(Wilekosc_Labiryntu_X - j) + indeks5])
            serial.writeString(" ")
        }
        serial.writeLine("")
    }
    serial.writeLine("")
}
input.onGesture(Gesture.Shake, function () {
    motor.motorStopAll()
})
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
        Update_Scian_Labiryntu(Czujnik_Lewy, Czujnik_Przod, Czujnik_Prawy, Orientacja_Robota)
        // Sciany W labiryncie
        // 
        // |1
        // 
        // _
        // 2
        // 
        // 4|
        // 
        // 8
        // -
        wyslanie_Tablicy_przez_port_szeregowy(Sciany_Labiryntu)
        if (Orientacja_Robota == 0) {
            if (Labirynt[polozenie_w_labiryncie + (Wilekosc_Labiryntu_X + 1)] < Labirynt[polozenie_w_labiryncie] && makerbit.getUltrasonicDistance(DistanceUnit.CM) > Limit_Przod) {
                polozenie_w_labiryncie = polozenie_w_labiryncie + 5
                Ruch_Przod()
            } else if (Labirynt[polozenie_w_labiryncie + 1] < Labirynt[polozenie_w_labiryncie] && Czujnik_Prawy > Limit_Prawo) {
                polozenie_w_labiryncie = polozenie_w_labiryncie + 1
                Ruch_Obrot_Prawo()
                Ruch_Przod()
            } else if (Labirynt[polozenie_w_labiryncie - 1] < Labirynt[polozenie_w_labiryncie] && Czujnik_Lewy > Limit_Lewo) {
                polozenie_w_labiryncie = polozenie_w_labiryncie - 1
                Ruch_Lewo()
                Ruch_Przod()
            } else {
                Update_wylania_wody()
            }
        } else if (Orientacja_Robota == 1) {
            if (Labirynt[polozenie_w_labiryncie + (Wilekosc_Labiryntu_X + 1)] < Labirynt[polozenie_w_labiryncie] && Czujnik_Lewy > Limit_Lewo) {
                polozenie_w_labiryncie = polozenie_w_labiryncie + 5
                Ruch_Lewo()
                Ruch_Przod()
            } else if (Labirynt[polozenie_w_labiryncie + 1] < Labirynt[polozenie_w_labiryncie] && makerbit.getUltrasonicDistance(DistanceUnit.CM) > Limit_Przod) {
                polozenie_w_labiryncie = polozenie_w_labiryncie + 1
                Ruch_Przod()
            } else if (Labirynt[polozenie_w_labiryncie - (Wilekosc_Labiryntu_X + 1)] < Labirynt[polozenie_w_labiryncie] && Czujnik_Prawy > Limit_Prawo) {
                polozenie_w_labiryncie = polozenie_w_labiryncie - 5
                Ruch_Obrot_Prawo()
                Ruch_Przod()
            } else {
                Update_wylania_wody()
            }
        } else if (Orientacja_Robota == -1) {
            if (Labirynt[polozenie_w_labiryncie + (Wilekosc_Labiryntu_X + 1)] < Labirynt[polozenie_w_labiryncie] && Czujnik_Prawy > Limit_Prawo) {
                polozenie_w_labiryncie = polozenie_w_labiryncie + 5
                Ruch_Obrot_Prawo()
                Ruch_Przod()
            } else if (Labirynt[polozenie_w_labiryncie - 1] < Labirynt[polozenie_w_labiryncie] && makerbit.getUltrasonicDistance(DistanceUnit.CM) > Limit_Przod) {
                polozenie_w_labiryncie = polozenie_w_labiryncie - 1
                Ruch_Przod()
            } else if (Labirynt[polozenie_w_labiryncie - (Wilekosc_Labiryntu_X + 1)] < Labirynt[polozenie_w_labiryncie] && Czujnik_Lewy > Limit_Lewo) {
                polozenie_w_labiryncie = polozenie_w_labiryncie - 5
                Ruch_Lewo()
                Ruch_Przod()
            } else {
                Update_wylania_wody()
            }
        } else if (Orientacja_Robota == 2) {
            if (Labirynt[polozenie_w_labiryncie - 1] < Labirynt[polozenie_w_labiryncie] && Czujnik_Prawy > Limit_Prawo) {
                polozenie_w_labiryncie = polozenie_w_labiryncie - 1
                Ruch_Obrot_Prawo()
                Ruch_Przod()
            } else if (Labirynt[polozenie_w_labiryncie - (Wilekosc_Labiryntu_X + 1)] < Labirynt[polozenie_w_labiryncie] && makerbit.getUltrasonicDistance(DistanceUnit.CM) > Limit_Przod) {
                polozenie_w_labiryncie = polozenie_w_labiryncie - 5
                Ruch_Przod()
            } else if (Labirynt[polozenie_w_labiryncie + 1] < Labirynt[polozenie_w_labiryncie] && Czujnik_Lewy > Limit_Lewo) {
                polozenie_w_labiryncie = polozenie_w_labiryncie + 1
                Ruch_Lewo()
                Ruch_Przod()
            } else {
                Update_wylania_wody()
            }
        }
    }
    music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Funk), music.PlaybackMode.InBackground)
    basic.showString("P")
    basic.showNumber(polozenie_w_labiryncie)
}
let Kolejka_step = 0
let polozenie_w_labiryncie = 0
let idex_X2 = 0
let Index_Y = 0
let l = 0
let Czujnik_Przod = 0
let Czujnik_Lewy = 0
let Czujnik_Prawy = 0
let Labirynt: number[] = []
let Orientacja_Robota = 0
let Wielkosc_Labiryntu_Y2 = 0
let Wilekosc_Labiryntu_X = 0
let Labirynt_Y = 0
let Labirynt_X = 0
let Set_Up_Target = 0
let Limit_Lewo = 0
let Limit_Prawo = 0
let Limit_Przod = 0
let Kolejka: number[] = []
let test: number[] = []
let k = 0
let lista: number[] = []
let Sciany_Labiryntu: number[] = []
motor.motorStopAll()
serial.writeLine("MicroMouse")
makerbit.connectUltrasonicDistanceSensor(DigitalPin.P15, DigitalPin.P16)
Limit_Przod = 7
Limit_Prawo = 70
Limit_Lewo = 70
Set_Up_Target = 0
Labirynt_X = 0
Labirynt_Y = 0
Wilekosc_Labiryntu_X = 4
Wielkosc_Labiryntu_Y2 = 4
// Orientacja Robota wzgledem labiryntu
// o = Przod
// 1 = Prawo
// -1 = Lewo
// 2 = Tył
Orientacja_Robota = 0
let Ilosc_komorek_w_labiryncie2 = Wielkosc_Labiryntu_Y2 * Wilekosc_Labiryntu_X + (Wielkosc_Labiryntu_Y2 + Wilekosc_Labiryntu_X)
Labirynt = []
Sciany_Labiryntu = []
Wgrani_labiryntu_bez_scian(Ilosc_komorek_w_labiryncie2)
basic.showString("T")
serial.writeLine("Sciany Labiryntu")
// Sciany W labiryncie
// 
// |1
// 
// _
// 2
// 
// 4|
// 
// 8
// -
wyslanie_Tablicy_przez_port_szeregowy(Sciany_Labiryntu)
basic.forever(function () {
    if (Set_Up_Target == 0) {
        led.plot(Labirynt_X, 4 - Labirynt_Y)
    }
})

serial.onDataReceived(serial.delimiters(Delimiters.Hash), function () {
    cmd = serial.readUntil(serial.delimiters(Delimiters.Hash))
    if (cmd == "STATUS") {
        NPNLCD.ShowString("TEMP:", 0, 1)
        NPNLCD.ShowNumber(99, 5, 1)
        NPNLCD.ShowString("MSTR:", 9, 1)
        NPNLCD.ShowNumber(99, 14, 1)
    } else if (cmd == "BUTTON") {
        NPNLCD.ShowString("RELEASING PROD", 0, 0)
    } else if (cmd == "RESTART") {
        NPNLCD.ShowString("TEMP:", 0, 1)
        NPNLCD.ShowNumber(NPNBitKit.DHT11Temp(), 5, 1)
        NPNLCD.ShowString("MSTR:", 9, 1)
        NPNLCD.ShowNumber(NPNBitKit.DHT11Hum(), 14, 1)
    } else if (cmd == "OUT_OF_PROD") {
        NPNLCD.ShowString("\"NOT ENOUGH PROD", 0, 0)
        basic.showIcon(IconNames.Sad)
        basic.pause(500)
        NPNLCD.ShowString("\"SORRY!", 0, 1)
    } else if (cmd == "TIME_OUT_LCD") {
        NPNLCD.ShowString("TIME OUT!!!", 0, 0)
        NPNLCD.ShowString("NEXT ORDER", 0, 1)
    } else if (cmd == "DONE_ORDER") {
        NPNLCD.ShowString("THANK YOU !!!", 0, 1)
        basic.showIcon(IconNames.Happy)
        NPNLCD.ShowString("NEXT ORDER", 0, 1)
        NPNLCD.clear()
    } else if (cmd == "RE_LAY") {
        pins.digitalWritePin(DigitalPin.P1, 1)
        basic.pause(1000)
        pins.digitalWritePin(DigitalPin.P1, 0)
    } else if (cmd == "TAKEN_YET") {
        COUNT_10s()
    } else {
        NPNLCD.ShowString("PRODUCT AT:", 0, 0)
        NPNLCD.ShowString(cmd, 12, 0)
    }
})
function DHT_REPORT () {
    NPNBitKit.DHT11Read(DigitalPin.P2)
    NPNLCD.ShowString("TEMP:", 0, 1)
    NPNLCD.ShowNumber(NPNBitKit.DHT11Temp(), 5, 1)
    NPNLCD.ShowString("MSTR:", 9, 1)
    NPNLCD.ShowNumber(NPNBitKit.DHT11Hum(), 14, 1)
}
function COUNT_10s () {
    count10s = 0
    if (count10s < 50) {
        // SOUND SENSOR
        // 
        if (pins.digitalReadPin(DigitalPin.P0) >= 100) {
            return
        }
        count10s += 1
        basic.pause(200)
    } else {
        serial.writeString("!TIME_OUT" + "1" + "#")
        return
    }
}
let cmd = ""
let count10s = 0
count10s = 0
NPNLCD.LcdInit()
basic.pause(500)
NPNLCD.BacklightOn()
NPNBitKit.DHT11Read(DigitalPin.P2)
basic.forever(function () {
    NPNBitKit.DHT11Read(DigitalPin.P2)
    basic.showIcon(IconNames.SmallHeart)
    basic.showString("" + pins.digitalReadPin(DigitalPin.P0))
    // PULL DOWN
    if (pins.digitalReadPin(DigitalPin.P0) == 0) {
        basic.pause(500)
        if (pins.digitalReadPin(DigitalPin.P0) == 0) {
            serial.writeString("!BUTTON:" + "1" + "#")
            pins.digitalWritePin(DigitalPin.P0, 1)
        }
    }
    if (input.buttonIsPressed(Button.A)) {
        basic.showIcon(IconNames.Heart)
        serial.writeString("!BUTTON:" + "1" + "#")
    }
    if (input.buttonIsPressed(Button.B)) {
        serial.writeString("!TEMP:" + ("" + NPNBitKit.DHT11Temp()) + "#")
    }
})

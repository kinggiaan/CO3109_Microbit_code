serial.onDataReceived(serial.delimiters(Delimiters.Hash), function () {
    cmd = serial.readUntil(serial.delimiters(Delimiters.Hash))
    if (cmd == "STATUS") {
        NPNLCD.ShowString("TEMP:", 0, 1)
        NPNLCD.ShowNumber(99, 5, 1)
        NPNLCD.ShowString("MSTR:", 9, 1)
        NPNLCD.ShowNumber(99, 14, 1)
    } else if (cmd == "BUTTON") {
        NPNLCD.ShowString("BUTTON", 0, 0)
        NPNLCD.ShowString("Value = 1", 7, 0)
        basic.showNumber(1)
    } else if (cmd == "POWER") {
        NPNLCD.clear()
    }
})
function DHT_REPORT () {
    NPNBitKit.DHT11Read(DigitalPin.P0)
    NPNLCD.ShowString("TEMP:", 0, 1)
    NPNLCD.ShowNumber(NPNBitKit.DHT11Temp(), 5, 1)
    NPNLCD.ShowString("MSTR:", 9, 1)
    NPNLCD.ShowNumber(NPNBitKit.DHT11Hum(), 14, 1)
}
let cmd = ""
NPNLCD.LcdInit()
basic.pause(500)
NPNLCD.BacklightOn()
basic.forever(function () {
    basic.showIcon(IconNames.SmallHeart)
    basic.showString("" + (pins.digitalReadPin(DigitalPin.P0)))
    NPNBitKit.DHT11Read(DigitalPin.P2)
    if (pins.digitalReadPin(DigitalPin.P0) == 0) {
        basic.pause(500)
        if (pins.digitalReadPin(DigitalPin.P0) == 0) {
            serial.writeString("!POWER:" + "1" + "#")
            pins.digitalWritePin(DigitalPin.P0, 1)
        }
    }
    if (input.buttonIsPressed(Button.A)) {
        basic.showIcon(IconNames.Heart)
        serial.writeString("!BUTTON:" + "1" + "#")
    }
    if (input.buttonIsPressed(Button.B)) {
        serial.writeString("!TEMP:" + NPNBitKit.DHT11Temp() + "#")
    }
})

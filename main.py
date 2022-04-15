
def on_data_received():
    global cmd
    cmd = serial.read_until(serial.delimiters(Delimiters.HASH))
    if cmd == "STATUS":
        NPNLCD.show_string("TEMP:", 0, 1)
        NPNLCD.show_number(99, 5, 1)
        NPNLCD.show_string("MSTR:", 9, 1)
        NPNLCD.show_number(99, 14, 1)
    elif cmd == "BUTTON":
        NPNLCD.show_string("BUTTON", 0, 0)
        NPNLCD.show_string("Value = 1", 7, 0)
        basic.show_number(1)
    elif cmd == "POWER":
        NPNLCD.clear()
serial.on_data_received(serial.delimiters(Delimiters.HASH), on_data_received)

def DHT_REPORT():
    NPNBitKit.dht11_read(DigitalPin.P0)
    NPNLCD.show_string("TEMP:", 0, 1)
    NPNLCD.show_number(NPNBitKit.dht11_temp(), 5, 1)
    NPNLCD.show_string("MSTR:", 9, 1)
    NPNLCD.show_number(NPNBitKit.dht11_hum(), 14, 1)
cmd = ""
NPNLCD.lcd_init()
basic.pause(500)
NPNLCD.backlight_on()

def on_forever():
    basic.show_icon(IconNames.SMALL_HEART)
    NPNBitKit.dht11_read(DigitalPin.P0)
    if pins.digital_read_pin(DigitalPin.P2) == 1:
        basic.pause(500)
        if pins.digital_read_pin(DigitalPin.P2) == 1:
            serial.write_string("!POWER:" + "1" + "#")
            pins.digital_write_pin(DigitalPin.P2, 1)
basic.forever(on_forever)

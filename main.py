def on_data_received():
    global cmd
    cmd = serial.read_until(serial.delimiters(Delimiters.HASH))
    if cmd == "STATUS":
        NPNLCD.show_string("TEMP:", 0, 1)
        NPNLCD.show_number(99, 5, 1)
        NPNLCD.show_string("MSTR:", 9, 1)
        NPNLCD.show_number(99, 14, 1)
    elif cmd == "BUTTON":
        NPNLCD.show_string("RELEASING PROD", 0, 0)
    elif cmd == "RELAY":
        pins.digital_write_pin(DigitalPin.P1, 1)
        basic.pause(1000)
        pins.digital_write_pin(DigitalPin.P1, 0)
    elif cmd == "RESTART":
        NPNLCD.show_string("TEMP:", 0, 1)
        NPNLCD.show_number(NPNBitKit.dht11_temp(), 5, 1)
        NPNLCD.show_string("MSTR:", 9, 1)
        NPNLCD.show_number(NPNBitKit.dht11_hum(), 14, 1)
    elif cmd == "OUT_OF_PROD":
        NPNLCD.show_string("\"NOT ENOUGH PROD", 0, 0)
        basic.show_icon(IconNames.SAD)
        basic.pause(500)
        NPNLCD.show_string("\"SORRY!", 0, 1)
    else:
        NPNLCD.show_string("PRODUCT AT:", 0, 0)
        NPNLCD.show_string(cmd, 12, 0)
serial.on_data_received(serial.delimiters(Delimiters.HASH), on_data_received)

def DHT_REPORT():
    NPNBitKit.dht11_read(DigitalPin.P2)
    NPNLCD.show_string("TEMP:", 0, 1)
    NPNLCD.show_number(NPNBitKit.dht11_temp(), 5, 1)
    NPNLCD.show_string("MSTR:", 9, 1)
    NPNLCD.show_number(NPNBitKit.dht11_hum(), 14, 1)
cmd = ""
NPNLCD.lcd_init()
basic.pause(500)
NPNLCD.backlight_on()
NPNBitKit.dht11_read(DigitalPin.P2)
count10s = 0
def on_forever():
    NPNBitKit.dht11_read(DigitalPin.P2)
    basic.show_icon(IconNames.SMALL_HEART)
    basic.show_string("" + str((pins.digital_read_pin(DigitalPin.P0))))
    # PULL DOWN
    # 
    if pins.digital_read_pin(DigitalPin.P0) == 0:
        basic.pause(500)
        if pins.digital_read_pin(DigitalPin.P0) == 0:
            serial.write_string("!BUTTON:" + "1" + "#")
            pins.digital_write_pin(DigitalPin.P0, 1)
    if input.button_is_pressed(Button.A):
        basic.show_icon(IconNames.HEART)
        serial.write_string("!BUTTON:" + "1" + "#")
    if input.button_is_pressed(Button.B):
        serial.write_string("!TEMP:" + str(NPNBitKit.dht11_temp()) + "#")
basic.forever(on_forever)

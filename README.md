PiDj - The Raspberry Pi based media DJ
--------------------------------------

Goal:
-----
Make a very simple to use Media DJ (Media Player) using Raspberry Pi.

Vision: How will PiDj work?
---------------------------
1. User downloads the PiDj sdcard image for raspberry pi.
2. User then burns this image onto a sdcard and boots up the rpi which is connected to a TV via HDMI.
3. PiDj launches and displays a screen with two QR codes.
   a. The first QR code contains link to the Android market place to download an android application.
   b. The second QR code contains the connection url for the smart phone to scan.
4. User installs the PiDj smartphone app from the market.
5. When the app starts up, it asks the user to scan the second QR code which will be the connection url to send the commands to.
6. The smartphone app then pings the PiDj and connects with it.
   a. Once connected, the user can use the smartphone app as a touchpad to navigate the PiDj.
7. The PiDj app on the TV changes to a screen that displays all the media servers (DMS) available on the network.
8. The user selects a media server and starts browsing the media on the TV.

Extended Vision: What other features could be added to this in the future?
--------------------------------------------------------------------------
1. PiDj will support not just networked media content but also other online content. The smartphone app can send 
media urls to the PiDj to start playing the clips on TV.
2. The smartphone app will be updated to provided keyboard functionality for the PiDj.

Why develop PiDj when there are so many other media players?
------------------------------------------------------------
1. First of all - just for the fun of it...
2. Create a media player that is snappy and responsive with good aesthetics.
3. Something that is completely open source and customizable.

Main areas of work:
-------------------
1. Develop a plugin for chromium browser that helps discover DMS servers on the network and pass the information to the JS webapp.
2. Develop HTML5/JS/JQuery based PiDj webapp.
3. Develop NodeJS based server for serving pages, support for websockets using socketio.
4. Develop Android application to control the PiDj box.

Where to find the code?
-----------------------
All code related to the PiDj project can be found right here on this github page.

Website for PiDj?
-----------------
Checkout http://osembedded.com for more information on PiDj project and it's status.

-


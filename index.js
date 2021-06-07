const {io} = require("socket.io-client");
const path = require('path');
const { app, BrowserWindow, screen, Tray, Menu } = require('electron')
const iconPath = path.join(__dirname, 'trayicon.png')
const cfg = require('./config.json')

var macAddress = "";
let serverURL = "http://" + cfg.host + ":" + cfg.port;

let phoneIP = cfg.phone.ip;
let phoneMac = cfg.phone.mac;

console.log(process.argv);

var tray = null;

app.whenReady().then(() => {

    tray = new Tray(iconPath);
    tray.focus();
    tray.on('click', () => {
        statusWin.show();
    })

    let display = screen.getPrimaryDisplay();
    let width = display.bounds.width;
    let height = display.bounds.height;
    var statusWin = new BrowserWindow({
        width: 400,
        height: 200,
        x: width-200,
        y: height-200,
        roundedCorners: true,
        autoHideMenuBar: true,
        alwaysOnTop: true,
        closable: false,
        show: false,
        icon: 'trayicon.png',
        opacity: 80,
        title: "",
        maxWidth: 400,
        maxHeight: 200
    })

    statusWin.loadURL(serverURL + "/client?ip=" + phoneIP + "&mac=" + phoneMac);
    statusWin.setAutoHideMenuBar(true);

    var socket = io.connect(serverURL)

    function connect(ip, mac){
        socket.emit('joinRoom', {'mac': mac, 'ip': ip});
        console.log("Connected to socket.")
        macAddress = mac;
    }

    connect(phoneIP, phoneMac);

    socket.on('incoming', (msg) => {
        statusWin.show();
    })

    socket.on('outgoing', (msg) => {
        statusWin.show();
    })

    socket.on('disconnected', (msg) => {
        statusWin.hide();
    })

})

app.on('window-all-closed', () => {

})
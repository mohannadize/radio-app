const string = `
stream_data[0]: "https://ice311.securenetsystems.net/NOGOUM |Nogoum FM|Various|FM|128|1"
stream_data[0]: "http://64.150.176.192:8276/; |90s FM|Various|FM|128|1"
 stream_data[1]: "http://64.150.176.192:8276|90s FM Arabic|Various|FM|128|1"
 stream_data[2]: "http://live.alhayafm.com:8000/;?1529541324751|Al Hayat FM |Various|FM|128|1"
 stream_data[3]: "http://listen.radionomy.com:80/ArabDJ |Arab DJ|Various|FM|128|1"
 stream_data[4]: "http://9090streaming.mobtada.com/9090FMEGYPT|Egypt - 9090 Egypt|Music|AR|128|1"
 stream_data[5]: "http://64.150.176.192:8276/;|Egypt - 90s FM|90s|AR|128|1"
 stream_data[6]: "http://82.201.132.237:8000/;|Egypt - JonaFm|Talk|AR|128|1"
 stream_data[7]: "http://live.radiomasr.net:8060/RADIOMASR|Egypt - Radio Egypt|Talk|AR|128|1"
 stream_data[8]: "http://serv02.streamsfortheworld.com:8000/radiosotak_hi|Egypt - Soutak|pop|AR|128|1"
 stream_data[9]: "http://192.99.17.12:4986/stream|Fioz Syria FM 91.1|Various|AR|128|1"
 stream_data[10]: "http://s2.voscast.com:11376/;|Mix FM 105.5 - Jeddah|Various|AR|128|1"
 stream_data[11]: "http://5.34.160.146:8000/live|Nas FM - Jenin|Various|AR|128|1"
 stream_data[12]: "http://curiosity.shoutca.st:6035/stream|Rotana FM 88.0 - Jeddah|Various|AR|128|1"
 stream_data[13]: "http://philae.shoutca.st:8114/;|Rotana FM KSA|Various|AR|128|1"
 stream_data[14]: "http://178.32.62.172:8614/;stream.nsv|Rotana FM LB Beirut|Various|AR|128|1"
 stream_data[15]: "http://elie91.primcast.com:7992/;stream.nsv|Sawt El Noujoum Beirut|Various|AR|128|1"
 stream_data[16]: "http://radio.mosaiquefm.net:8000/mosatarab|Tunisia - Mosaique FM Tarab|Various|AR|128|1"
 stream_data[17]: "http://audiostreaming.itworkscdn.com:9000/;|Virgin Radio Lebanon|Various|FM|128|1"
 stream_data[18]: "http://37.187.79.93:8192/;stream.nsv|lbi lebanon|Various|AR|128|1"
`;

let audio = new Audio();
let stations = parse_sii(string);
let player_station = document.getElementById("player_station");
let player_icon = document.getElementById("player_icon");
let stations_container = document.getElementById("stations_container");

function parse_sii(string) {
    let lines = string.split('\n');
    let stations = lines
        .filter(line => /stream_data.+\"(https?.+)\"/i.test(line))
        .map(line => {
            let array = line.match(/stream_data.+\"(https?.+)\"/i)[1].split("|");
            return {
                url: array[0],
                name: array[1],
                category: array[2],
                language: array[3],
                bitrate: array[4]
            }
        });
    return stations;
}

function populate_main() {
    let list = stations_container.querySelector('ul');
    let html = ``;
    stations.forEach(station => {
        html += `
        <li>
            <a onclick="set_station(this,'${station.url}','${station.name}')">
                <div class="level is-mobile">
                    <div class="level-left">
                        <div class='level-item has-text-weight-bold'>${station.name}</div>
                    </div>
                    <div class="level-right">
                        <div class='level-item'>${station.category}</div>
                    </div>
                </div>
            </a>
        </li>
        `;
    });

    list.innerHTML = (html);
};

function set_station(elem, url, name) {
    let list = stations_container.querySelectorAll('ul > li > a');
    player_station.innerText = name;
    [].slice.apply(list).forEach(station => station.classList.remove('is-active'));
    elem.classList.add("is-active");
    audio.src = url;
    player("play");
}

function player(options) {
    if (typeof options == 'string') {
        if (options == 'play') {
            audio.play();
            player_icon.innerHTML = '<i class="fa fa-pause"></i>';
            player_icon.onclick = () => {
                player("pause");
            }
            return;
        } else if (options == 'stop') {
            player_station.innerText = 'Select a station';
            audio.src = '';
        } else if (options == 'pause') {
            audio.pause();
        }
        player_icon.onclick = () => {
            player("play");
        }
        player_icon.innerHTML = '<i class="fa fa-play"></i>';
        player_icon.classList.add("fa-play")
        player_icon.classList.remove("fa-pause")
        return;
    }


}
populate_main();

if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
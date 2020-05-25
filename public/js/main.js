const string = `
stream_data[0]: "https://ice311.securenetsystems.net/NOGOUM |Nogoum FM|Various|FM|128|1"
 stream_data[3]: "http://listen.radionomy.com:80/ArabDJ |Arab DJ|Various|FM|128|1"
 stream_data[4]: "http://9090streaming.mobtada.com/9090FMEGYPT|Egypt - 9090 Egypt|Music|AR|128|1"
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
    stations.forEach((station, i) => {
        html += `
        <li>
            <a id='station-${i}' class='station' onclick="set_station(this,'${station.url}','${station.name}','${i}')">
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

function set_station(elem, url, name, i) {
    if (!elem) {
        elem = document.getElementById('station-'+i);
    }
    let list = stations_container.querySelectorAll('ul > li > a');
    player_station.innerText = name;
    [].slice.apply(list).forEach(station => station.classList.remove('is-active'));
    elem.classList.add("is-active");
    audio.src = url;
    let pageTitle = document.getElementsByTagName("title");
    pageTitle[0].innerText = name;

    if ('mediaSession' in navigator) {

        navigator.mediaSession.metadata = new MediaMetadata({
            title: name,
        });

        navigator.mediaSession.setActionHandler('play', function () {
            player('play')
        });
        navigator.mediaSession.setActionHandler('pause', function () {
            player('pause')
        });
        if (stations[i-1]) {
            navigator.mediaSession.setActionHandler('previoustrack', function () {
                set_station(null, stations[i-1].url, stations[i-1].name, i-1);
            });
        }
        if (stations[i+1]) {
            navigator.mediaSession.setActionHandler('nexttrack', function () {
                set_station(null, stations[i+1].url, stations[i+1].name, i+1);
            });
        }
    }

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
            let pageTitle = document.getElementsByTagName("title");
            pageTitle[0].innerText = 'Radio PWA';
            let elems = document.querySelectorAll('.station');
            [...elems].forEach(elem=>{
                elem.classList.remove('is-active')
            })
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
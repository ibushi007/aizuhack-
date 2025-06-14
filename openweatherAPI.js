const apiKey = 'cce1bac73b81afde50666a5778830228';
const city = 'otera,Fukushima,JP';
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=otera,Fukushima,JP&appid=cce1bac73b81afde50666a5778830228&units=metric`;

fetch(apiUrl)
.then(response => {
    if(!response.ok) {
        throw new Error('エラーが発生');
    }
    return response.json();
})
.then(data => {
    console.log(data);

    const weather = data.weather[0].main;
    const temp = data.main.temp;
    const cityname = data.name;
    const currentweather = data.weather[0].description;

    console.log(`都市名: ${cityname}`);
    console.log(`天気: ${weather}`);
    console.log(`気温: ${temp}`);
    console.log(`現在の天気: ${currentweather}`);

    const name1 = document.getElementById('name');
    const weather1 = document.getElementById('weather');
    const temperature1 = document.getElementById('temperature');

    name1.textContent = `都市名: ${cityname}`;
    weather1.textContent = `天気: ${weather}`;
    temperature1.textContent = `気温: ${temp}`;

    const warnweather = ['Rain'].includes(weather);

    if(warnweather) {
        console.log(`${cityname}の天気は${weather}です。`);
        SendNotification(`${cityname}は今日は雨が降る予想です`,
        `現在の天気は${currentweather}です`
);
}
    else {
        SendNotification(`${cityname}の天気は${weather}です`,
            `現在の天気は${currentweather}です`
        );
    }
})

function SendNotification(title, body) {
    if(!('Notification' in window)) {
        console.warn('通知ができません');
        return;
    }

    if(Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
        });
    } else if(Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if(permission === 'granted') {
                new Notification(title, {
            body: body,
        });
                console.log('許可が得られました');
            }
            else if(permission === 'denied') {
                console.log('拒否されました');
            }
        })
    }
    else{
        console.log('明確に通知を拒否しています');
    }
}
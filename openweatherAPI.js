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

    // 天気 main を日本語に変換する辞書
    const weatherJP = {
        Clear: '晴れ',
        Clouds: 'くもり',
        Rain: '雨',
        Drizzle: '霧雨',
        Thunderstorm: '雷雨',
        Snow: '雪',
        Mist: '霧',
        Smoke: '煙',
        Haze: 'もや',
        Dust: 'ほこり',
        Fog: '霧',
        Sand: '砂',
        Ash: '灰',
        Squall: 'スコール',
        Tornado: '竜巻'
    };
    const weatherTextJP = weatherJP[weather] || weather;
    const currentweatherJP = currentweather; // descriptionはAPIでjaにできない場合はそのまま

    // 今日の天気を日本語で表示
    const weather1 = document.getElementById('weather');
    if (weather1) weather1.textContent = `天気: ${weatherTextJP}（${currentweatherJP}）`;

    // 気温表示
    const temperature1 = document.getElementById('temperature');
    if (temperature1) temperature1.textContent = `気温: ${temp}℃`;

    const name1 = document.getElementById('name');
    if (name1) name1.textContent = `都市名: ${cityname}`;

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

    // 天気情報をlocalStorageに保存（じゃんけんゲームで自動設定するため）
    localStorage.setItem('currentWeather', weather);

    // 気温差計算フォームの処理（バックエンドAPI経由）
    const tempForm = document.getElementById('temp-form');
    const userTempInput = document.getElementById('user-temp');
    const tempDiffDiv = document.getElementById('temp-diff');

    if (tempForm && userTempInput && tempDiffDiv) {
        tempForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const userTempStr = userTempInput.value.trim();
            const userTemp = parseFloat(userTempStr);
            if (userTempStr === '' || isNaN(userTemp)) {
                tempDiffDiv.textContent = '正しい数値を入力してください。';
                tempDiffDiv.style.color = '#e53935';
                return;
            }
            tempDiffDiv.textContent = '計算中...';
            try {
                const res = await fetch('http://localhost:3001/api/calc-diff', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userTemp })
                });
                const data = await res.json();
                if (data.error) {
                    tempDiffDiv.textContent = 'エラーが発生しました。';
                    tempDiffDiv.style.color = '#e53935';
                } else {
                    tempDiffDiv.textContent = `実際の気温（${data.temp}℃）との差は ${data.diff.toFixed(1)}℃ です。`;
                    tempDiffDiv.style.color = '#1976d2';
                    // 通知
                    if ('Notification' in window) {
                        if (Notification.permission === 'granted') {
                            new Notification('気温差のお知らせ', {
                                body: `実際の気温: ${data.temp}℃\n設定気温: ${userTemp}℃\n差: ${data.diff.toFixed(1)}℃`
                            });
                        } else if (Notification.permission === 'default') {
                            Notification.requestPermission().then(permission => {
                                if (permission === 'granted') {
                                    new Notification('気温差のお知らせ', {
                                        body: `実際の気温: ${data.temp}℃\n設定気温: ${userTemp}℃\n差: ${data.diff.toFixed(1)}℃`
                                    });
                                }
                            });
                        }
                    }
                }
            } catch (err) {
                tempDiffDiv.textContent = 'サーバーに接続できません。';
                tempDiffDiv.style.color = '#e53935';
            }
        });
    }

    // トップページの背景を天気に応じて変更
    function changeWeatherBackground(weatherType) {
        const body = document.body;
        switch(weatherType) {
            case 'Clear':
                body.style.backgroundImage = "url('./image/sun.jpg')";
                break;
            case 'Clouds':
                body.style.backgroundImage = "url('./image/clowd.jpg')";
                break;
            case 'Rain':
            case 'Drizzle':
                body.style.backgroundImage = "url('./image/rain.jpg')";
                break;
            default:
                body.style.backgroundImage = "url('./image/sun.jpg')";
                break;
        }
    }

    // 天気に応じて背景を変更
    changeWeatherBackground(weather);

    // じゃんけんゲームへのリンクに天気情報を追加
    const gameLink = document.getElementById('game-link');
    if (gameLink) {
        // 天気に応じてリンクを変更
        if (weather === 'Clear') {
            gameLink.href = 'game.html?weather=hare';
        } else if (weather === 'Clouds') {
            gameLink.href = 'game.html?weather=kumori';
        } else if (weather === 'Rain' || weather === 'Drizzle') {
            gameLink.href = 'game.html?weather=default';
        } else {
            gameLink.href = 'game.html?weather=default';
        }
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

// 気温差分を通知する関数
function notifyTempDiff(actualTemp, userTemp, diff) {
    if (!('Notification' in window)) return;
    const title = '気温差のお知らせ';
    const body = `実際の気温: ${actualTemp}℃\n設定気温: ${userTemp}℃\n差: ${diff.toFixed(1)}℃`;
    if (Notification.permission === 'granted') {
        new Notification(title, { body });
    } else if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(title, { body });
            }
        });
    }
}
//変更する
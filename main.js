window.onload = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;


                const savebutton = document.getElementById("save")
                if(savebutton){
                    savebutton.addEventListener("click", function() {
                        const tem = document.getElementById("temp").value;

                        // localStorageに保存
                        localStorage.setItem("temp", tem);

                    });
                }
                

                const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weather_code,temperature_2m_max,temperature_2m_min,rain_sum,wind_speed_10m_max&hourly=temperature_2m,weather_code,wind_speed_10m,rain&timezone=Asia%2FTokyo`;
                //

                //const tem = document.getElementById('temp').value; //設定温度（文字列で入力される）

                //const temp = parseInt(tem); //設定温度を数字化する。

                const temp = localStorage.getItem("temp");

                const test = document.getElementById('m'); //背景を変えるための文。bodyについてるid

                //ここからは服装をお勧めするURL
                const message_1 = document.getElementById('message1'); //URLを非表示にしたり、表示するための文
                const message_2 = document.getElementById('message2');
                const message_3 = document.getElementById('message3');

                // APIからデータを取得してHTMLに表示
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);

                        //現在の天気
                        const weather = data.current_weather;
                        const temperature = weather.temperature;
                        const set_tempo = temperature - temp;
                        const set_temp = parseInt(set_tempo);
                        const windspeed = weather.windspeed;
                        const weathercode = weather.weathercode;

                        const weatherDescriptions = {
                            0: "快晴",
                            1: "主に晴れ",
                            2: "部分的に曇り",
                            3: "曇り",
                            45: "霧",
                            48: "霧氷性霧",
                            51: "小雨（霧雨）",
                            53: "中程度の霧雨",
                            55: "濃い霧雨",
                            61: "小雨",
                            63: "中程度の雨",
                            65: "大雨",
                            80: "弱いにわか雨",
                            81: "にわか雨",
                            82: "強いにわか雨",
                        };

                        const description = weatherDescriptions[weathercode] || "不明";
                        document.getElementById('nowwe').innerHTML = description;

                        //消すのここ
                        //const weatherText = `気温: ${temperature}°C<br>風速: ${windspeed} km/h<br>天気: ${description} <br>気温: ${set_temp}℃`;
                        //document.getElementById('weather').innerHTML = weatherText;


                        //tuika----------------------------------------------------------------------------------------------------------------------------------------
                        const now = new Date();

                        const year = now.getFullYear();
                        const month = String(now.getMonth() + 1).padStart(2, '0');
                        const day = String(now.getDate()).padStart(2, '0');
                        const hour = String(now.getHours()).padStart(2, '0');

                        const nowISO = `${year}-${month}-${day}T${hour}:00`;


                        // 現在時刻のインデックスを取得
                        const startIndex = data.hourly.time.indexOf(nowISO);

                        if (startIndex === -1) {
                            document.getElementById("hotable").innerText = "現在時刻のデータが見つかりません。";
                            return;
                        }

                        const weatherCodes = {
                            0: "晴れ",
                            1: "晴れ",
                            2: "曇り",
                            3: "曇り",
                            45: "霧",
                            48: "霧と霜",
                            51: "霧雨",
                            61: "雨",
                            63: "雨",
                            65: "雨",
                            80: "小雨",
                            81: "中雨",
                            82: "激しい雨"
                            };

                        const n = startIndex;

                        for (let i = 0; i < 20; i++) {
                            const time = data.hourly.time[n + i].slice(11, 13); // "HH"
                            const temp = data.hourly.temperature_2m[n + i];
                            const code = data.hourly.weather_code[n + i];

                            document.getElementById(`time${i + 1}`).innerHTML = `${time}時`;
                            document.getElementById(`w${i + 1}`).innerHTML = weatherCodes[code] || "不明";
                            document.getElementById(`c${i + 1}`).innerHTML = `${temp}℃`;
                        }

                        

                        const today_temp = `${temperature}℃`;
                        document.getElementById('ttem').innerHTML = today_temp;
                        //tuika-------------------------------------------------------------------------------------------------------------------------------------


                        const weather_temp = ` ${set_temp}℃`;
                        document.getElementById('test').innerHTML = weather_temp;

                        //通知



                        
 

                        //日ごとの天気
                        const weather1 = data.daily;
                        const temperature1 = weather1.temperature_2m_max;
                        const temperature2 = weather1.temperature_2m_min;
                        const rainsum1 = weather1.rain_sum;
                        const windspeed1 = weather1.wind_speed_10m_max;

                        //------------------------------------------------------------------------------------------------------------------------------------------------------
                        const today_max = ` ${temperature1[0]}℃`;
                        document.getElementById('ttwe').innerHTML = today_max;
                        const today_min =  `${temperature2[0]}℃`;
                        document.getElementById('tttem').innerHTML = today_min;


                        //日ごとの天気を得るための文
                        const weathercode1 = weather1.weather_code[1];        
                        const weathercode2 = weather1.weather_code[2];
                        const weathercode3 = weather1.weather_code[3];
                        const weathercode4 = weather1.weather_code[4];
                        const weathercode5 = weather1.weather_code[5];
                        const weathercode6 = weather1.weather_code[6];

                        const date_data = weather1.time;
                        const days = date_data.map(date => date.split("-")[2]);

                        const weatherDescriptions1 = {
                            0: "快晴",
                            1: "主に晴れ",
                            2: "部分的に曇り",
                            3: "曇り",
                            45: "霧",
                            48: "霧氷性霧",
                            51: "小雨（霧雨）",
                            53: "中程度の霧雨",
                            55: "濃い霧雨",
                            61: "小雨",
                            63: "中程度の雨",
                            65: "大雨",
                            80: "弱いにわか雨",
                            81: "にわか雨",
                            82: "強いにわか雨",
                        };

                        //ここから表

                        //日ごとの天気を得るための文
                        const description1 = weatherDescriptions1[weathercode1] || "不明";
                        const description2 = weatherDescriptions1[weathercode2] || "不明";
                        const description3 = weatherDescriptions1[weathercode3] || "不明";
                        const description4 = weatherDescriptions1[weathercode4] || "不明";
                        const description5 = weatherDescriptions1[weathercode5] || "不明";
                        const description6 = weatherDescriptions1[weathercode6] || "不明";

                        //for使えばよかった
                        //Today.data
                        const weatherText1 = `${temperature1[0]}°C`;
                        const weatherText2 = `${temperature2[0]}°C`
                        const weatherText3 = `${rainsum1[0]}mm`
                        const weatherText4 = `${windspeed1[0]} km/h`
                        const weatherText5 = `${description}`
                        const dateText = `${days[0]}日`;
                        document.getElementById('ex1').innerHTML = weatherText5;
                        document.getElementById('ex2').innerHTML = weatherText1;
                        document.getElementById('ex3').innerHTML = weatherText2;
                        document.getElementById('ex4').innerHTML = weatherText3;
                        document.getElementById('ex5').innerHTML = weatherText4;
                        document.getElementById('date').innerHTML = dateText;


                        //1later.data
                        const weatherText6 = `${temperature1[1]}°C`;
                        const weatherText7 = `${temperature2[1]}°C`
                        const weatherText8 = `${rainsum1[1]}mm`
                        const weatherText9 = `${windspeed1[1]} km/h`
                        const weatherText10 = `${description1}`
                        const dateText1 = `${days[1]}日`;
                        document.getElementById('ex6').innerHTML = weatherText10;
                        document.getElementById('ex7').innerHTML = weatherText6;
                        document.getElementById('ex8').innerHTML = weatherText7;
                        document.getElementById('ex9').innerHTML = weatherText8;
                        document.getElementById('ex10').innerHTML = weatherText9;
                        document.getElementById('date1').innerHTML = dateText1;

                        //2later.data
                        const weatherText11 = `${temperature1[2]}°C`;
                        const weatherText12 = `${temperature2[2]}°C`
                        const weatherText13 = `${rainsum1[2]}mm`
                        const weatherText14 = `${windspeed1[2]} km/h`
                        const weatherText15 = `${description2}`
                        const dateText2 = `${days[2]}日`;
                        document.getElementById('ex11').innerHTML = weatherText15;
                        document.getElementById('ex12').innerHTML = weatherText11;
                        document.getElementById('ex13').innerHTML = weatherText12;
                        document.getElementById('ex14').innerHTML = weatherText13;
                        document.getElementById('ex15').innerHTML = weatherText14;
                        document.getElementById('date2').innerHTML = dateText2;

                        //3later.data
                        const weatherText16 = `${temperature1[3]}°C`;
                        const weatherText17 = `${temperature2[3]}°C`
                        const weatherText18 = `${rainsum1[3]}mm`
                        const weatherText19 = `${windspeed1[3]} km/h`
                        const weatherText20 = `${description3}`
                        const dateText3 = `${days[3]}日`;
                        document.getElementById('ex16').innerHTML = weatherText20;
                        document.getElementById('ex17').innerHTML = weatherText16;
                        document.getElementById('ex18').innerHTML = weatherText17;
                        document.getElementById('ex19').innerHTML = weatherText18;
                        document.getElementById('ex20').innerHTML = weatherText19;
                        document.getElementById('date3').innerHTML = dateText3;

                        //4later.data
                        const weatherText21 = `${temperature1[4]}°C`;
                        const weatherText22 = `${temperature2[4]}°C`
                        const weatherText23 = `${rainsum1[4]}mm`
                        const weatherText24 = `${windspeed1[4]} km/h`
                        const weatherText25 = `${description4}`
                        const dateText4 = `${days[4]}日`;
                        document.getElementById('ex21').innerHTML = weatherText25;
                        document.getElementById('ex22').innerHTML = weatherText21;
                        document.getElementById('ex23').innerHTML = weatherText22;
                        document.getElementById('ex24').innerHTML = weatherText23;
                        document.getElementById('ex25').innerHTML = weatherText24;
                        document.getElementById('date4').innerHTML = dateText4;

                        //5later.data
                        const weatherText26 = `${temperature1[5]}°C`;
                        const weatherText27 = `${temperature2[5]}°C`
                        const weatherText28 = `${rainsum1[5]}mm`
                        const weatherText29 = `${windspeed1[5]} km/h`
                        const weatherText30 = `${description5}`
                        const dateText5 = `${days[5]}日`;
                        document.getElementById('ex26').innerHTML = weatherText30;
                        document.getElementById('ex27').innerHTML = weatherText26;
                        document.getElementById('ex28').innerHTML = weatherText27;
                        document.getElementById('ex29').innerHTML = weatherText28;
                        document.getElementById('ex30').innerHTML = weatherText29;
                        document.getElementById('date5').innerHTML = dateText5;

                        //6later.data
                        const weatherText31 = `${temperature1[6]}°C`;
                        const weatherText32 = `${temperature2[6]}°C`
                        const weatherText33 = `${rainsum1[6]}mm`
                        const weatherText34 = `${windspeed1[6]} km/h`
                        const weatherText35 = `${description6}`
                        const dateText6 = `${days[6]}日`;
                        document.getElementById('ex31').innerHTML = weatherText35;
                        document.getElementById('ex32').innerHTML = weatherText31;
                        document.getElementById('ex33').innerHTML = weatherText32;
                        document.getElementById('ex34').innerHTML = weatherText33;
                        document.getElementById('ex35').innerHTML = weatherText34;
                        document.getElementById('date6').innerHTML = dateText6;

 

                            //設定温度との誤差によって服装を勧める。
                        if (set_temp >= 0){ //設定温度との誤差が10以上であれば半袖を勧める。
                            document.getElementById('test2').innerHTML = '半袖を着よう';
                            message_1.classList.remove('hidden');
                        } else if (set_temp < 0) {
                            document.getElementById('test2').innerHTML = '長袖を着よう';
                            message_2.classList.remove('hidden');
                        }    

                        //天気によって背景を変える。上記の記述を参照。
                        if (weathercode <= 1) {
                            test.classList.remove('m1');
                            test.classList.add('m3');
                        } else if (weathercode >= 2 && weathercode <=3) {
                            test.classList.remove('m1');
                            test.classList.add('m2');
                        } else if (weathercode >= 45 && weathercode <=82) {
                            test.classList.remove('m1');
                            test.classList.add('m4')
                        }

                        
        
                    })
                    .catch(error => {
                        console.error('エラー:', error);
                        document.getElementById('weather').innerText = '天気情報の取得に失敗しました';


                    });
                
            },
            function(error) {
                console.error("位置情報の取得に失敗しました: " + error.message);
            }
        );
    } else {
        console.error("このブラウザはGeolocationに対応していません。");
    }
}
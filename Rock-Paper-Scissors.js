'use strict';

// JavaScriptは関数スコープのため
// 変数や関数を外から見えなくするために（カプセル化・プライベート化）
// 即時関数でスコープを閉じながら、関数内の処理をすぐに実行している。
(() => {
  // 手の形を数で表現。それぞれの数値はHTMLのbuttonタグ内のvalue属性で定義している。
  // value="1" => グー
  // value="2" => チョキ
  // value="0" => パー
  const HAND_FORMS = [
    0, // パー
    1, // グー
    2  // チョキ
  ];

  // images/sprite.png(グーチョキパーの画像)を切り取って使う際に
  // それぞれの手のx座標を指定している。
  const HAND_X = [
    0,   // グー
    380, // チョキ
    750  // パー
  ];
  // images/sprite.png(グーチョキパーの画像)を切り取って使う際に
  // それぞれの手のwidth(横幅)を指定している。
  const HAND_WIDTH = [
    360, // グー
    340, // チョキ
    430  // パー
  ];
  // ↑
  // 例: それぞれの手の形の画像を切り出したいときは
  // - グー : x軸が0pxから横幅360px切り出した範囲
  // - チョキ : x軸が380pxから横幅340px切り出した範囲
  // - パー : x軸が750pxから横幅430px切り出した範囲


  const IMAGE_PATH = './image/sprite.png';
  // 1秒間で60コマ（フレーム）のアニメーションを行う
  // ここの値が大きいほど手の切り替わりスピードが早くなる
  // 例:
  // - FPSの値が1: 1秒に1回手が切り替わる
  // - FPSの値が10: 1秒に10回手が切り替わる
  // - FPSの値が60: 1秒に60回手が切り替わる
  const FPS = 10;

  // loop関数内で呼び出しているdraw関数の実行をするかしないかを切り分けているフラグ
  // グー・チョキ・パーのいずれかのボタンが押された時にtrueになる。(onClick関数を参照)
  let isPause = false;

  // draw関数が実行されるたびに1増える(インクリメント)
  // currentFrameの値を剰余算演算子(%)を使い出たあまりを使うことで、
  // 表示される手の形を決める。
  // 今回の場合は手の形は3つ(HAND_FORMS.length)なので
  // 値は必ず0, 1, 2のいずれかとなる。
  // 例:
  // currentFrameが30のとき: 30 % 3 => 0 => HAND_FORMS[0] => グー
  // currentFrameが31のとき: 30 % 3 => 1 => HAND_FORMS[1] => チョキ
  // currentFrameが32のとき: 30 % 3 => 2 => HAND_FORMS[2] => パー
  let currentFrame = 0;

  /**
   * 実際にアニメーションを開始させる処理
   */
  function main() {
    const canvas = document.getElementById('screen');
    const context = canvas.getContext('2d');
    const imageObj = new Image();
    currentFrame = 0;

    // 画像('./images/sprite.png')の読み込みが完了したら、
    // loop関数の無限ループを実行する。
    imageObj.onload = function () {
      function loop() {
        if (!isPause) {
          draw(canvas, context, imageObj, currentFrame++);
        }

        // 指定した時間が経過したらloop関数を呼び出す。
        // 関数自身を呼び出す関数のことを再帰関数という。
        //
        // 例: FPSの値に応じてloop関数が実行される時間間隔が変わる
        // FPSが60 => 1000/60 => 16.666 => 0.016秒後にloop関数を実行 => 0.016秒毎に1回手が切り替わる
        // FPSが10 => 1000/10 => 100 => 0.1秒後にloop関数を実行 => 0.1秒毎に1回手が切り替わる
        // FPSが1 => 1000/1 => 1000 => 1秒後にloop関数を実行 => 1秒毎に1回手が切り替わる
        setTimeout(loop, 1000 / FPS);
      }
      loop();
    };
    imageObj.src = IMAGE_PATH;
  }

  /**
   * グー・チョキ・パー画像('./images/sprite.png')から特定の手の形を切り取る
   * @param {*} canvas HTMLのcanvas要素
   * @param {*} context canvasから取得した値。この値を使うことでcanvasに画像や図形を描画することが出来る
   * @param {*} imageObject 画像データ。
   * @param {*} frame 現在のフレーム数(コマ数)。フレーム % HAND_FORMS.lengthによって0(グー), 1(チョキ), 2(パー)を決める
   */
  function draw(canvas, context, imageObject, frame) {
    // HTML5から導入されたcanvasをJavaScriptを使って画像の切り替えを行っている。
    // - Canvas API: https://developer.mozilla.org/ja/docs/Web/HTML/Canvas
    // - CanvasRenderingContext2D: https://developer.mozilla.org/ja/docs/Web/API/CanvasRenderingContext2D

    // Canvasをまっさらな状態にする。（クリアする）
    // クリアをしなかった場合、以前に描画した画像がcanvas上に残ったままになってしまう。
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 0: グー, 1, チョキ, 2: パー
    const handIndex = frame % HAND_FORMS.length;
    const sx = HAND_X[handIndex];
    const swidth = HAND_WIDTH[handIndex];

    // 画像のx座標(sx)と指定した手の横幅(swidth)を使って、
    // グー・チョキ・パー画像('./images/sprite.png')から特定の手の形を切り取る
    context.drawImage(
      imageObject,
      sx,
      0,
      swidth,
      imageObject.height,
      0,
      0,
      swidth,
      canvas.height
    );
  }

  /**
   * ボタンクリック時の処理の定義をまとめて行う関数
   */
  function setButtonAction() {
    const rock = document.getElementById('rock');
    const scissors = document.getElementById('scissors');
    const paper = document.getElementById('paper');
    const restart = document.getElementById('restart');

    // グー・チョキ・パーのいずれかをクリックした時に呼ばれる。
    function onClick(event) {
      // 自分の手と相手の手の値を取得する。
      const myHandType = parseInt(event.target.value, 10);
      const enemyHandType = parseInt(currentFrame % HAND_FORMS.length, 10);

      // isPauseフラグをtrueにすることでloop関数内で呼び出している
      // draw関数が実行されなくなる。
      isPause = true;

      // 自分の手の値と相手の値をjudge関数に渡して勝敗を確認する。
      judge(myHandType, enemyHandType);
    }

    // グー・チョキ・パーボタンを押したときの処理をonClick関数で共通化
    rock.addEventListener('click', onClick);
    scissors.addEventListener('click', onClick);
    paper.addEventListener('click', onClick);

    // 再開ボタンを押したとき、ブラウザをリロードする
    // https://developer.mozilla.org/en-US/docs/Web/API/Location/reload
    restart.addEventListener('click', function () {
      window.location.reload();
    });
  }

  // 自分の手の値(0~2のいずれか)と相手の手の値(0~2のいずれか)を使って計算を行い
  // 値に応じて勝ち・負け・引き分けを判断して、アラートに結果を表示する。
  function judge(myHandType, enemyHandType) {
    // 0: 引き分け, 1: 負け, 2: 勝ち
    // じゃんけんの勝敗判定のアルゴリズム: https://qiita.com/mpyw/items/3ffaac0f1b4a7713c869
    const result = (myHandType - Math.abs(enemyHandType) + 3) % HAND_FORMS.length;

    if (result === 0) {
      // 引き分けの場合は通知せずに自動再開
      setTimeout(() => {
        isPause = false; // アニメーションを再開
      }, 1000); // 1秒後に再開
    } else if (result === 1) {
      alert('あなたの負けです!');
    } else {
      // 勝利演出の設定を確認
      const victoryEffect = localStorage.getItem('victoryEffect') || 'on';
      if (victoryEffect === 'on') {
        // 勝利時のUI変更とトップページへの移動
        showVictoryUI();
      } else {
        // 従来のアラート表示
        alert('あなたの勝ちです!');
      }
    }
  }

  // 勝利時のUI変更とトップページへの移動
  function showVictoryUI() {
    // 勝利メッセージを表示
    const victoryMessage = document.createElement('div');
    victoryMessage.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
      color: white;
      padding: 30px 50px;
      border-radius: 20px;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 1000;
      animation: victoryPulse 1s ease-in-out;
    `;
    victoryMessage.innerHTML = `
      🎉 あなたの勝ちです！ 🎉<br>
      <small style="font-size: 16px; margin-top: 10px; display: block;">3秒後にトップページに戻ります...</small>
    `;
    
    // 勝利アニメーションのCSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes victoryPulse {
        0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.1); }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(victoryMessage);
    
    // 3秒後にトップページに移動（勝利フラグ付き）
    setTimeout(() => {
      // グローバル関数を呼び出して勝利フラグを設定
      if (typeof goToTopPageWithVictory === 'function') {
        goToTopPageWithVictory();
      } else {
        localStorage.setItem('showVictoryMessage', 'true');
        window.location.href = 'main.html';
      }
    }, 3000);
  }

  // ボタンクリック時の処理の定義を行ってから、アニメーションを開始する
  setButtonAction();
  main();
})();
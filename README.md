# DiscordにGoogle Calendarの予定を通知するGAS

GASでGoogle Calendarの予定をDiscordに送信します。

##　登録方法
DiscordにWebHook追加し、そのURLを取得し、`CONFIG`の`webhookUrl`に設定します。
[取得方法](https://zenn.dev/lambta/articles/5edbda4ccb1ec6)

Calendar IDを取得し、`CONFIG`の`calendarId`に設定します。
[ID取得方法](https://qiita.com/mikeneko_t98/items/60e264941492d0b44fe5)

# Google Apps Script の設定

1. Google Apps Scriptを開く
2. プロジェクトを新規作成
3. `code.js`の内容をコピペ
4. `CONFIG`の`webhookUrl`と`calendarId`を設定
5. `トリガー`を設定
   - `notifyTodaysSchedule`の設定
     - 午前6時〜午前7時の間に実行するように設定
   - `notifyNextSchedule` の設定
     - 1分毎に実行するように設定

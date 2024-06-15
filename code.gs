const url =
  "https://discord.com/api/webhooks/0000000000000000000/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA?wait=true&thread_id=0000000000000000000";

const calendar_id =
  "a_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@group.calendar.google.com";

function TodaysSchedule() {
  var calendar = CalendarApp.getCalendarById(calendar_id);
  var events = calendar.getEventsForDay(new Date()); // 今日のイベントを取得する例
  if (events.length <= 0) {
    return;
  }

  const embeds = Array.from(events).map((event) => {
    var startTime = formatTime(event.getStartTime()); // 開始時刻を日本時間表記に変換
    var endTime = formatTime(event.getEndTime()); // 終了時刻を日本時間表記に変換

    return {
      title: event.getTitle(),
      description: event.getDescription(),
      timestamp: event.getStartTime(),
      color: 0x3498db,
      fields: [
        {
          name: ":calendar: スタート",
          value: startTime,
          inline: true,
        },
        {
          name: ":calendar: 終了",
          value: endTime,
          inline: true,
        },
        {
          name: ":map: 場所",
          value: event.getLocation() || "指定なし",
        },
      ],
      footer: {
        text: "Google Calendar",
        icon_url: "https://www.google.com/calendar/images/favicon_v2014_1.ico",
      },
    };
  });
  var payload = {
    username: "スケジュールを教えてくれるオラフ",
    content: "今日の予定をお知らせします。",
    avatar_url:
      "https://lumiere-a.akamaihd.net/v1/images/chara_olaf_42b28a03.jpeg",
    embeds: embeds,
  };
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
  };
  UrlFetchApp.fetch(url, options);
}

// 時間を日本時間表記（HH:mm）に変換する関数
function formatTime(date) {
  var japanTime = Utilities.formatDate(
    date,
    Session.getScriptTimeZone(),
    "HH:mm",
  );
  return japanTime;
}

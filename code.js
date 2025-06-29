// 定数の定義
const scriptProperties = PropertiesService.getScriptProperties();
const CONFIG = {
  webhookUrl:
    scriptProperties.getProperty("webhookUrl"),
  calendarId:
    scriptProperties.getProperty("calendarId"),
  username: 
    scriptProperties.getProperty("username"),
  avatarUrl:
    scriptProperties.getProperty("avatarUrl"),
  footerIconUrl:
    scriptProperties.getProperty("footerIconUrl"),
};

function setProperties() {
  scriptProperties.setProperty(
    "webhookUrl",
    "https://discord.com/api/webhooks/0000000000000000000/qazwsxedcrfvtgbyhnujmik",
  );
  scriptProperties.setProperty(
    "calendarId",
    "00000000000000000000@group.calendar.google.com",
  );
  scriptProperties.setProperty(
    "avatarUrl",
    "https://example.com/image.webp",
  );
  scriptProperties.setProperty(
    "footerIconUrl",
    "https://www.example.com/image2.png",
  );
}


// 時間を日本時間表記（HH:mm）に変換する関数
function formatTime(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "HH:mm");
}

// イベントのEmbedを作成する関数
function createEventEmbeds(events) {
  return events.map((event) => {
    if (event.isAllDayEvent()) {
      return {
        title: event.getTitle(),
        description: event.getDescription(),
        timestamp: event.getStartTime(),
        color: 0x3498db,
        fields: [
          {
            name: ":calendar: スタート",
            value: "終日",
            inline: true,
          },
          {
            name: ":map: 場所",
            value: event.getLocation()
              ? `${event.getLocation()} \n${`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.getLocation())}`}`
              : "指定なし",
          },
        ],
        footer: { text: "Google Calendar", icon_url: CONFIG.footerIconUrl },
      };
    } else {
      return {
        title: event.getTitle(),
        description: event.getDescription(),
        timestamp: event.getStartTime(),
        color: 0x3498db,
        fields: [
          {
            name: ":calendar: スタート",
            value: formatTime(event.getStartTime()),
            inline: true,
          },
          {
            name: ":calendar: 終了",
            value: formatTime(event.getEndTime()),
            inline: true,
          },
          {
            name: ":map: 場所",
            value: event.getLocation()
              ? `${event.getLocation()} \n${`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.getLocation())}`}`
              : "指定なし",
          },
        ],
        footer: { text: "Google Calendar", icon_url: CONFIG.footerIconUrl },
      };
    }
  });
}

// 通知を送信する関数
function sendNotification(content, embeds) {
  const payload = {
    username: CONFIG.username,
    content: content,
    avatar_url: CONFIG.avatarUrl,
    embeds: embeds,
  };
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
  };
  try {
    UrlFetchApp.fetch(CONFIG.webhookUrl, options);
  } catch (error) {
    Logger.log("Error sending notification: " + error.toString());
  }
}

// 今日のスケジュールを取得して通知する
function notifyTodaysSchedule() {
  const calendar = CalendarApp.getCalendarById(CONFIG.calendarId);
  const events = calendar.getEventsForDay(new Date());
  if (events.length > 0) {
    const embeds = createEventEmbeds(events);
    sendNotification(
      `今日の予定をお知らせします。`,
      embeds,
    );
  }
}

// 30分後のスケジュールを取得して通知する
function notifyNextSchedule() {
  const calendar = CalendarApp.getCalendarById(CONFIG.calendarId);
  const scriptProperties = PropertiesService.getScriptProperties();
  const lastSearched = new Date(
    scriptProperties.getProperty("lastSearched") || new Date(),
  );
  const events = calendar
    .getEvents(lastSearched, new Date(Date.now() + 30 * 60 * 1000))
    .filter(
      (event) => event.getStartTime() > lastSearched && !event.isAllDayEvent(),
    );
  scriptProperties.setProperty(
    "lastSearched",
    new Date(Date.now() + 30 * 60 * 1000),
  );
  if (events.length > 0) {
    const embeds = createEventEmbeds(events);
    sendNotification(
      `30分後の予定をお知らせします。`,
      embeds,
    );
  }
}

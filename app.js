const STORAGE_KEY = "pokemonSleepTrackerLite";

let events = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

let selectedEventId = null;

let currentDay = 1;

function saveData() {

  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));

}

function renderEvents() {

  const eventList = document.getElementById("eventList");

  if (!eventList) return;

  eventList.innerHTML = "";

  if (events.length === 0) {

    eventList.innerHTML = "<p>イベントがありません</p>";

    return;

  }

  events.forEach((event, index) => {

    const div = document.createElement("div");

    div.style.border = "1px solid #ddd";

    div.style.padding = "10px";

    div.style.marginBottom = "10px";

    div.style.borderRadius = "10px";

    div.style.background = "#fff";

    div.innerHTML = `

<h3>${event.name}</h3>

  <p>${event.date}</p>

  <p>${event.note}</p>

  <button onclick="openEvent(${event.id})">

    開く

  </button>

  <button onclick="deleteEvent(${index})">

    削除

  </button>

`;
    eventList.appendChild(div);

  });

}

function saveEvent() {

  const name =

    document.getElementById("eventName").value;

  const date =

    document.getElementById("eventStart").value;

  const note =

    document.getElementById("eventNote").value;

  if (!name) {

    alert("イベント名を入力してください");

    return;

  }

  events.push({



  id: Date.now(),

  name,

  date,

  note,

  days: {

    1:{note:""},

    2:{note:""},

    3:{note:""},

    4:{note:""},

    5:{note:""},

    6:{note:""},

    7:{note:""}

  }

});

  saveData();

  renderEvents();

  document.getElementById("eventName").value = "";

  document.getElementById("eventStart").value = "";

  document.getElementById("eventNote").value = "";

}

function deleteEvent(index) {

  if (!confirm("削除しますか？")) {

    return;

  }

  events.splice(index, 1);

  saveData();

  renderEvents();

}

document

  .getElementById("saveEventBtn")

  .addEventListener("click", saveEvent);

renderEvents();

function openEvent(id){

  selectedEventId = id;

  alert("イベントを開く機能は次で実装");

}

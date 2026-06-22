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

1:{note:"",records:[]},

  2:{note:"",records:[]},

  3:{note:"",records:[]},

  4:{note:"",records:[]},

  5:{note:"",records:[]},

  6:{note:"",records:[]},

  7:{note:"",records:[]}

}

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
  
  const event =

    events.find(e => e.id === id);

  if(!event) return;

  document.getElementById("eventDetail").style.display =

    "block";

  document.getElementById("detailTitle").textContent =

    event.name;

  currentDay = 1;

  updateDayView();

  renderRecords();

}

function prevDay(){

  if(currentDay > 1){

    currentDay--;

    updateDayView();

  }

}

function nextDay(){

  if(currentDay < 7){

    currentDay++;

    updateDayView();

  }

}

function saveDayNote(){

  const event =

    events.find(

      e => e.id === selectedEventId

    );

  if(!event) return;

  event.days[currentDay].note =

    document.getElementById(

      "dayNote"

    ).value;

  saveData();

  alert("保存しました");

}

function updateDayView(){

  const event =

    events.find(

      e => e.id === selectedEventId

    );

  if(!event) return;

  document.getElementById("dayLabel").textContent =

    `Day${currentDay}`;

  document.getElementById("dayNote").value =

    event.days[currentDay].note;

renderRecords();
  
}

function addPokemonRecord(){

  const name =

    document.getElementById(

      "pokemonName"

    ).value.trim();

  if(!name) return;

  const event =

    events.find(

      e => e.id === selectedEventId

    );

  if(!event) return;

  if(!event.days[currentDay].records){

    event.days[currentDay].records = [];

  }

  event.days[currentDay].records.push({

    name,

    count: 1

  });

  saveData();

  renderRecords();

  document.getElementById(

    "pokemonName"

  ).value = "";

}

function renderRecords(){

  const event =

    events.find(

      e => e.id === selectedEventId

    );

  if(!event) return;

  const area =

    document.getElementById(

      "recordList"

    );

  area.innerHTML = "";

  const records =

    event.days[currentDay].records || [];

  records.forEach((record,index)=>{

    const div =

      document.createElement("div");

    div.innerHTML = `

      ${record.name}

<button onclick="decreaseRecord(${index})">

    -

  </button>

  ${record.count}

  <button onclick="increaseRecord(${index})">

    +

  </button>

  <button onclick="deleteRecord(${index})">

    削除

  </button>

`;
    area.appendChild(div);

  });

}

function increaseRecord(index){

  const event =

    events.find(

      e => e.id === selectedEventId

    );

  event.days[currentDay]

    .records[index]

    .count++;

  saveData();

  renderRecords();

}

function decreaseRecord(index){

  const event =

    events.find(

      e => e.id === selectedEventId

    );

  const record =

    event.days[currentDay]

    .records[index];

  if(record.count > 1){

    record.count--;

  }

  saveData();

  renderRecords();

}

function deleteRecord(index){

  const event =

    events.find(

      e => e.id === selectedEventId

    );

  event.days[currentDay]

    .records.splice(index,1);

  saveData();

  renderRecords();

}

function showSummary(){

    const event =

        events.find(

            e => e.id === selectedEventId

        );

    if(!event) return;

    const totals = {};

    for(let day=1; day<=7; day++){

        const records =

            event.days[day].records || [];

        records.forEach(record => {

            if(!totals[record.name]){

                totals[record.name] = 0;

            }

            totals[record.name] += record.count;

        });

    }

    const summaryList =

        document.getElementById("summaryList");

    summaryList.innerHTML = "";

    Object.entries(totals)

        .sort((a,b)=>b[1]-a[1])

        .forEach(([name,count])=>{

            const div =

                document.createElement("div");

            div.textContent =

                `${name} (${count})`;

            summaryList.appendChild(div);

        });

    document.getElementById(

        "summaryArea"

    ).style.display = "block";

}

const STORAGE_KEY = "pokemonSleepTrackerLite";
window.onerror = function(message, source, line){

  alert(

    "JSエラー\n" +

    message +

    "\n行:" + line

  );

};
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

renderPokemonCandidates();

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

renderPokemonCandidates();

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

renderPokemonCandidates();
  
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

  div.innerHTML =

  `${record.name} `;

const minusBtn =

  document.createElement("button");

minusBtn.textContent = "-";

minusBtn.onclick = () => {

  decreaseRecord(index);

};

div.appendChild(minusBtn);

div.append(

  ` ${record.count} `

);

const plusBtn =

  document.createElement("button");

plusBtn.textContent = "+";

plusBtn.onclick = () => {

  increaseRecord(index);

};

div.appendChild(plusBtn);

const deleteBtn =

  document.createElement("button");

deleteBtn.textContent = "削除";

deleteBtn.onclick = () => {

  deleteRecord(index);

};

div.appendChild(deleteBtn);
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
alert("decreaseRecord読込OK");
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

  renderPokemonCandidates();

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

let rank = 1;

let totalCount = 0;

Object.values(totals).forEach(v => {

    totalCount += v;

});

summaryList.innerHTML =

    `<div><strong>総出現数 ${totalCount}</strong></div><hr>`;

Object.entries(totals)

    .sort((a,b)=>b[1]-a[1])

    .forEach(([name,count])=>{

        const div =

            document.createElement("div");

        div.textContent =

            `${rank}位 ${name} ${count}`;

        summaryList.appendChild(div);

        rank++;

    });

    document.getElementById(

        "summaryArea"

    ).style.display = "block";

}

function exportData(){

  const data = JSON.stringify(

    events,

    null,

    2

  );

  const blob = new Blob(

    [data],

    {

      type:"application/json"

    }

  );

  const url =

    URL.createObjectURL(blob);

  const a =

    document.createElement("a");

  a.href = url;

  a.download =

    "pokemon-sleep-backup.json";

  a.click();

  URL.revokeObjectURL(url);

}

function importData(event){

  const file =

    event.target.files[0];

  if(!file) return;

  const reader =

    new FileReader();

  reader.onload = function(e){

    try{

      events =

        JSON.parse(

          e.target.result

        );

      saveData();

      renderEvents();

renderPokemonCandidates();
      
      alert("復元完了");

    }catch(error){

      alert(

        "JSON読込失敗"

      );

    }

  };

  reader.readAsText(file);

}

function renderPokemonCandidates(){

  const area =

    document.getElementById(

      "candidateList"

    );

  if(!area) return;

  area.innerHTML = "";

  const event =

    events.find(

      e => e.id === selectedEventId

    );

  if(!event) return;

  const names = new Set();

  for(let day=1; day<=7; day++){

    const records =

      event.days[day].records || [];

    records.forEach(record => {

      names.add(record.name);

    });

  }

  [...names]

    .sort()

    .forEach(name => {

      const btn =

        document.createElement(

          "button"

        );

      btn.textContent = name;

      btn.onclick = () => {

        document.getElementById(

          "pokemonName"

        ).value = name;

      };

      area.appendChild(btn);

    });

}

alert("app.js最後まで読込成功");

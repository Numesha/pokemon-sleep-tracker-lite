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

let currentSession = 1;

let eventListCollapsed = false;

let history = [];

let favorites = JSON.parse(

  localStorage.getItem(

    "pokemonFavorites"

  ) || "[]"

);

function saveData() {

  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));

}

function renderEvents() {

  const eventList = document.getElementById("eventList");

const toggleBtn =

  document.getElementById(

    "toggleEventListBtn"

  );

if(toggleBtn){

  toggleBtn.textContent =

    eventListCollapsed

    ? "イベント一覧を表示"

    : "イベント一覧を隠す";

}
  
  if (!eventList) return;


  
  eventList.innerHTML = "";

  if (events.length === 0) {

    eventList.innerHTML = "<p>イベントがありません</p>";

    return;

  }

  events.forEach((event, index) => {

if(

  eventListCollapsed &&

  event.id !== selectedEventId

){

  return;

}
    
    const div = document.createElement("div");

div.id = `event-${event.id}`;
    
    div.style.border = "1px solid #ddd";

    div.style.padding = "10px";

    div.style.marginBottom = "10px";

    div.style.borderRadius = "10px";

    div.style.background = "#fff";

    div.innerHTML = `

<h3

  onclick="openEvent(${event.id})"

  style="cursor:pointer;"

>

  ${event.name}

</h3>

  <p>${event.date}</p>

  <p>${event.note}</p>

  <button onclick="deleteEvent(${index})">

    削除

  </button>

`;
    eventList.appendChild(div);

  });

if(selectedEventId){

  const selectedCard =

    document.getElementById(

      `event-${selectedEventId}`

    );

  if(selectedCard){

    selectedCard.style.background =

      "#e8f4ff";

    selectedCard.style.border =

      "2px solid #4da3ff";

  }

}

const cards =

  document.querySelectorAll(

    '[id^="event-"]'

  );

cards.forEach(card => {

  card.style.background = "#fff";

  card.style.border = "1px solid #ddd";

});

if(selectedEventId){

  const selectedCard =

    document.getElementById(

      `event-${selectedEventId}`

    );

  if(selectedCard){

    selectedCard.style.background =

      "#e8f4ff";

    selectedCard.style.border =

      "2px solid #4da3ff";

  }

}
  
}

function toggleEventList(){

  eventListCollapsed =

    !eventListCollapsed;

  renderEvents();

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

 const newEvent = {

  id: Date.now(),

  name,

  date,

  note,

  days: {

    1:{note:"",records1:[],records2:[]},

    2:{note:"",records1:[],records2:[]},

    3:{note:"",records1:[],records2:[]},

    4:{note:"",records1:[],records2:[]},

    5:{note:"",records1:[],records2:[]},

    6:{note:"",records1:[],records2:[]},

    7:{note:"",records1:[],records2:[]}

  }

};

  events.unshift(newEvent);

  saveData();

  renderEvents();

openEvent(newEvent.id);

  document.getElementById("eventName").value = "";

  document.getElementById("eventStart").value = "";

  document.getElementById("eventNote").value = "";

}

function deleteEvent(index) {

createBackup();
  
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

  const detailArea =

    document.getElementById(

      "eventDetail"

    );

  if(!detailArea) return;

  detailArea.style.display =

    "block";

  document.getElementById(

    "detailTitle"

  ).textContent =

    event.name;

  currentDay = 1;

  updateDayView();

  renderRecords();

  renderPokemonCandidates();

const eventCard =

  document.getElementById(

    `event-${id}`

  );

if(

  eventCard &&

  detailArea

){

  eventCard.after(

    detailArea

  );

}
  
renderEvents();
  
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

renderPokemonCandidates();
  
}

function addPokemonRecord(){

createBackup();
  
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

const key =

  currentSession === 1

  ? "records1"

  : "records2";

if(!event.days[currentDay][key]){

  event.days[currentDay][key] = [];

}

const existing =

  event.days[currentDay][key]

    .find(

      p => p.name === name

    );

if(existing){

  existing.count++;

}else{

  event.days[currentDay][key]

    .push({

      name,

      count:1

    });

}

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

  const key =

  currentSession === 1

  ? "records1"

  : "records2";

const records =

  event.days[currentDay][key] || [];
  
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

createBackup();
  
  const event =

    events.find(

      e => e.id === selectedEventId

    );

  const key =

    currentSession === 1

    ? "records1"

    : "records2";

  event.days[currentDay][key]

    [index]

    .count++;

  saveData();

  renderRecords();

}

function decreaseRecord(index){

createBackup();
  
  const event =

    events.find(

      e => e.id === selectedEventId

    );

  const key =

    currentSession === 1

    ? "records1"

    : "records2";

  const record =

    event.days[currentDay][key]

      [index];

if(record.count > 1){

  record.count--;

}else{

  event.days[currentDay][key]

    .splice(index,1);

}

  saveData();

  renderRecords();

renderPokemonCandidates();
  
}

function deleteRecord(index){

createBackup();
  
  const event =

    events.find(

      e => e.id === selectedEventId

    );

  const key =

    currentSession === 1

    ? "records1"

    : "records2";

  event.days[currentDay][key]

    .splice(index,1);

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

  const totals1 = {};

  const totals2 = {};

  const totalsAll = {};

  for(let day=1; day<=7; day++){

    const records1 =

      event.days[day].records1 || [];

    const records2 =

      event.days[day].records2 || [];

    records1.forEach(record => {

      totals1[record.name] =

        (totals1[record.name] || 0)

        + record.count;

      totalsAll[record.name] =

        (totalsAll[record.name] || 0)

        + record.count;

    });

    records2.forEach(record => {

      totals2[record.name] =

        (totals2[record.name] || 0)

        + record.count;

      totalsAll[record.name] =

        (totalsAll[record.name] || 0)

        + record.count;

    });

  }

  const summaryList =

    document.getElementById(

      "summaryList"

    );

  summaryList.innerHTML = "";

function addRanking(title,data){

  const h =

    document.createElement("h4");

  h.textContent = title;

  summaryList.appendChild(h);

  let total = 0;

  Object.values(data)

    .forEach(v => {

      total += v;

    });

  let rank = 1;

  Object.entries(data)

    .sort((a,b)=>b[1]-a[1])

    .forEach(([name,count])=>{

      const rate =

        total === 0

        ? 0

        : ((count / total) * 100)

            .toFixed(1);

      const div =

        document.createElement("div");

      div.textContent =

        `${rank}位 ${name} ${count} (${rate}%)`;

      summaryList.appendChild(div);

      rank++;

    });

  summaryList.appendChild(

    document.createElement("hr")

  );

}

  addRanking(

    "【1回目】",

    totals1

  );

  addRanking(

    "【2回目】",

    totals2

  );

  let totalCount = 0;

  Object.values(totalsAll)

    .forEach(v => {

      totalCount += v;

    });

  const totalDiv =

    document.createElement("div");

  totalDiv.innerHTML =

    `<strong>総出現数 ${totalCount}</strong>`;

  summaryList.appendChild(totalDiv);

  addRanking(

    "【合計】",

    totalsAll

  );

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

  const currentArea =

    document.getElementById(

      "currentCandidateList"

    );

  const allArea =

    document.getElementById(

      "allCandidateList"

    );

  if(!currentArea || !allArea){

    return;

  }

  currentArea.innerHTML = "";

  allArea.innerHTML = "";

  const currentCounts = {};

  const allCounts = {};

const todayPokemon = {};
  
  const currentEvent =

    events.find(

      e => e.id === selectedEventId

    );

  if(currentEvent){

    for(let day=1; day<=7; day++){

      const records1 =

        currentEvent.days[day]

          .records1 || [];

      const records2 =

        currentEvent.days[day]

          .records2 || [];

    [...records1,...records2]

  .forEach(record => {

    currentCounts[

      record.name

    ] =

      (currentCounts[

        record.name

      ] || 0)

      + record.count;

    if(day === currentDay){

      todayPokemon[

        record.name

      ] = true;

    }

  });

    }

  }

  events.forEach(ev => {

    for(let day=1; day<=7; day++){

      const records1 =

        ev.days[day]

          .records1 || [];

      const records2 =

        ev.days[day]

          .records2 || [];

      [...records1,...records2]

        .forEach(record => {

          allCounts[

            record.name

          ] =

            (allCounts[

              record.name

            ] || 0)

            + record.count;

        });

    }

  });

  document.getElementById(

    "currentCandidateTitle"

  ).textContent =

    `今回イベント候補 (${

      Object.keys(

        currentCounts

      ).length

    })`;

  document.getElementById(

    "allCandidateTitle"

  ).textContent =

    `全イベント候補 (${

      Object.keys(

        allCounts

      ).length

    })`;

  function createButton(

    area,

    name,

    count

  ){

    const btn =

      document.createElement(

        "button"

      );

  btn.textContent =

  `${name} (${count})`;

const starBtn =

  document.createElement(

    "button"

  );

starBtn.textContent =

  favorites.includes(name)

  ? "★"

  : "☆";

starBtn.onclick = e => {

  e.stopPropagation();

  if(

    favorites.includes(name)

  ){

    favorites =

      favorites.filter(

        p => p !== name

      );

  }else{

    favorites.push(name);

  }

  localStorage.setItem(

    "pokemonFavorites",

    JSON.stringify(

      favorites

    )

  );

  renderFavorites();

  renderPokemonCandidates();

};

area.appendChild(

  starBtn

);

    btn.onclick = () => {

      const event =

        events.find(

          e =>

            e.id ===

            selectedEventId

        );

      if(!event){

        return;

      }

      const key =

        currentSession === 1

        ? "records1"

        : "records2";

      if(!event.days[

        currentDay

      ][key]){

        event.days[

          currentDay

        ][key] = [];

      }

      createBackup();

    const existing =

  event.days[

    currentDay

  ][key].find(

    p => p.name === name

  );

if(existing){

  existing.count++;

}else{

  event.days[

    currentDay

  ][key].push({

    name,

    count:1

  });

}

      saveData();

      renderRecords();

      renderPokemonCandidates();

    };

    area.appendChild(btn);

  }

  const currentSearch =

  document.getElementById(

    "currentSearch"

  )?.value || "";

const todayTitle =

  document.createElement("h4");
  
  document.createElement("h4");

todayTitle.textContent =

  "【今日出現】";

currentArea.appendChild(

  todayTitle

);

Object.entries(

  currentCounts

)

.filter(

  ([name]) =>

    todayPokemon[name] 

)

.sort(

  (a,b) =>

    b[1] - a[1]

)

.forEach(

  ([name,count]) => {

    createButton(

      currentArea,

      name,

      count

    );

  }

);

const allTitle =

  document.createElement("h4");

allTitle.textContent =

  "【イベント累計】";

currentArea.appendChild(

  allTitle

);

Object.entries(

  currentCounts

)

.filter(

  ([name]) =>

    !todayPokemon[name] 

)

.sort(

  (a,b) =>

    b[1] - a[1]

)

.forEach(

  ([name,count]) => {

    const hiraName =

      name.replace(

        /[\u30a1-\u30f6]/g,

        s => String.fromCharCode(

          s.charCodeAt(0) - 0x60

        )

      );

    const hiraSearch =

      currentSearch.replace(

        /[\u30a1-\u30f6]/g,

        s => String.fromCharCode(

          s.charCodeAt(0) - 0x60

        )

      );

    if(

      hiraSearch &&

      !hiraName.includes(

        hiraSearch

      )

    ){

      return;

    }

    createButton(

      currentArea,

      name,

      count

    );

  }

);

  const allSearch =

  (

    document.getElementById(

      "allSearch"

    )?.value || ""

  )

  .trim()

  .toLowerCase();

Object.entries(

  allCounts

)

.sort(

  (a,b) =>

    b[1] - a[1]

  )

.forEach(

  ([name,count]) => {

    const hiraName =

      name.replace(

        /[\u30a1-\u30f6]/g,

        s => String.fromCharCode(

          s.charCodeAt(0) - 0x60

        )

      );

    const hiraSearch =

      allSearch.replace(

        /[\u30a1-\u30f6]/g,

        s => String.fromCharCode(

          s.charCodeAt(0) - 0x60

        )

      );

    if(

      hiraSearch &&

      !hiraName.includes(

        hiraSearch

      )

    ){

      return;

    }

    createButton(

      allArea,

      name,

      count

    );

  }

);

}
  
function selectSession(session){

  currentSession = session;

  document.getElementById(

    "sessionLabel"

  ).textContent =

    `${session}回目`;

  renderRecords();

}

document

  .getElementById(

    "currentSearch"

  )

  ?.addEventListener(

    "input",

    renderPokemonCandidates

  );

document

  .getElementById(

    "allSearch"

  )

  ?.addEventListener(

    "input",

    renderPokemonCandidates

  );

renderFavorites();

function createBackup(){

  history.push(

    JSON.stringify(events)

  );

  if(history.length > 10){

    history.shift();

  }

}

function undoLastAction(){

  if(history.length === 0){

    alert("戻せるデータがありません");

    return;

  }

  const backup =

    history.pop();

  events =

    JSON.parse(backup);

  saveData();

  renderEvents();

if(selectedEventId){

  openEvent(selectedEventId);

}
  
  if(selectedEventId){

    renderRecords();

    renderPokemonCandidates();

renderFavorites();
    
renderFavorites();
    
  }

  alert(

    `元に戻しました\n残り${history.length}回`

  );

}

function renderFavorites(){

  const area =

    document.getElementById(

      "favoriteList"

    );

  if(!area) return;

  area.innerHTML = "";

  document.getElementById(

    "favoriteTitle"

  ).textContent =

    `お気に入り (${favorites.length})`;

  favorites.forEach(name => {

    const btn =

      document.createElement(

        "button"

      );

    btn.textContent = name;

    btn.onclick = () => {

      const event =

        events.find(

          e =>

            e.id ===

            selectedEventId

        );

      if(!event) return;

      const key =

        currentSession === 1

        ? "records1"

        : "records2";

      createBackup();

const existing =

  event.days[

    currentDay

  ][key].find(

    p => p.name === name

  );

if(existing){

  existing.count++;

}else{

  event.days[

    currentDay

  ][key].push({

    name,

    count:1

  });

}

      saveData();

      renderRecords();

    };

    area.appendChild(btn);

  });

}

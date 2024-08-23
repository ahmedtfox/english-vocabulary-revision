let text = "";
const translateIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-translate" viewBox="0 0 16 16">
      <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286zm1.634-.736L5.5 3.956h-.049l-.679 2.022z"/>
      <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm7.138 9.995q.289.451.63.846c-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6 6 0 0 1-.415-.492 2 2 0 0 1-.94.31"/>
    </svg>`;

const myForm = document.getElementById("myForm");
const csvFile = document.getElementById("csvFile");
let lastStudy = {
  from: 0,
  to: 10,
};

let fileLines = [];
let voicesArr = [];
myForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = csvFile.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    text = e.target.result;
    //document.write(text);
    console.log(text);
    prepareData(text);
    getInput();
    writeInPage();
  };
  reader.readAsText(input);

  //console.log(text[2]);
});

function getInput() {
  const numberOfVocabFrom = document.getElementById("numberOfVocabFrom");
  const numberOfVocabTo = document.getElementById("numberOfVocabTo");
  const value1 = Number(numberOfVocabFrom.value) || 0;
  const value2 = Number(numberOfVocabTo.value) || 10;
  if (value1 >= value2) {
    //alert("wrong");
  } else {
    lastStudy.from = value1;
    lastStudy.to = value2;
    setLocalStorage("lastStudy", lastStudy);
  }
}

function prepareData(pram) {
  //console.log(pram);
  const lines = pram.split(/\r?\n/); // Split text into an array of lines
  let newArr = [];
  for (let i = 0; i < lines.length; i++) {
    // Remove commas and trim whitespace
    //pram[i] = text.replace(/, */g, "");
    //console.log(lines[i].replace(/, */g, ""));
    const line = lines[i].replace(/, */g, "");
    const line2 = line.split(".")[0];
    if (line2 === "" || line2 === undefined) {
    } else {
      newArr.push(line2);
    }
  }
  fileLines = newArr;
  setLocalStorage("fileLines", fileLines);
}

function setLocalStorage(pram1, pram2) {
  //localStorage.setItem('fileLines',)
  localStorage.setItem(pram1, JSON.stringify(pram2));
}
function getLocalStorage(pram) {
  return JSON.parse(localStorage.getItem(pram));
}
writeInPage();
changeWords();
playBtn();
nextPageBtn();

function changeWords() {
  const changeWords = document.getElementById("changeWords");
  changeWords.addEventListener("click", () => {
    //console.log("hiii");
    getInput();
    writeInPage();
    document.getElementById("numberOfVocabFrom").value = lastStudy.from;
  });
}

let waitingFlag = 0;

function playBtn() {
  // console.log("hi");
  const playBtn = document.getElementById("playBtn");
  playBtn.addEventListener("click", () => {
    // console.log("voice.lang");
    //getInput();
    let x = lastStudy.from;
    // console.log("hi");

    const myInterval = setInterval(() => {
      // if pause button clicked
      if (x === Number(lastStudy.to)) {
        clearInterval(myInterval);
      }
      if (x === Number(lastStudy.to)) {
        return;
      }
      if (waitingFlag === 0) {
        waitingFlag = 1;
        selectWord(fileLines[x]);
        readWord(fileLines[x], chosenVoice);
        x++;
      }
    }, waitingTime);
  });
}

function writeInPage() {
  let counter = 0;
  lastStudy = getLocalStorage("lastStudy") || {
    from: 0,
    to: 0,
  };
  fileLines = getLocalStorage("fileLines");
  const container = document.getElementById("container");
  let html = "";
  // const toVar = lastStudy.to >=
  for (let i = lastStudy.from; i < lastStudy.to; i++) {
    if (fileLines[i] === undefined) {
      break;
    }
    html =
      html +
      `<li id="${fileLines[i]}_li">
      <span class="searchIcon" id="${fileLines[i]}_icon">
      <button class="searchIcon" id="${fileLines[i]}_icon">
      ${translateIcon}
      </button>
      </span>
       <span class="word" id="${fileLines[i]}">
       ${fileLines[i]}
       </span>
       </li>`;
    counter++;
  }
  document.getElementById(
    "info"
  ).innerText = `form ${lastStudy.from} to ${lastStudy.to} and number of words is ${fileLines.length} `;
  container.innerHTML = html;
  container.setAttribute("start", lastStudy.from);
  readAloud();
  searchIcon();
}
let chosenVoice = "";

function readAloud() {
  const wordsElement = document.querySelectorAll(".word");

  wordsElement.forEach((element) => {
    element.addEventListener("click", function (event) {
      let word = event.target.innerText;
      readWord(word, getChosenVoice());
    });
  });
}

function searchIcon() {
  const searchIcon = document.querySelectorAll(".searchIcon");

  searchIcon.forEach((element) => {
    element.addEventListener("click", function (event) {
      let word = event.target.id;
      const word2 = word.split("_")[0].toLowerCase();
      const searchUrl = `https://www.oxfordlearnersdictionaries.com/definition/american_english/${word2}`;
      window.open(searchUrl, "_blank");
    });
  });
}

function getChosenVoice() {
  let elements = document.getElementById("selectVoice");

  elements.addEventListener("click", () => {
    voicesArr = [];
    voices = window.speechSynthesis.getVoices();

    for (let i = 0; i < voices.length; i++) {
      if (voices[i].lang === "en-US") {
        voicesArr.push({ id: i, name: voices[i].name });
      }
    }
    if (voicesArr.length > 1) {
      localStorage.setItem("voiceStorage", JSON.stringify(voicesArr));
    } else {
      voicesArr = getLocalStorage("voiceStorage");
    }
  });
  voicesArr = getLocalStorage("voiceStorage");

  if (elements.options.length !== voicesArr.length) {
    while (elements.hasChildNodes()) {
      elements.removeChild(elements.firstChild);
    }
    for (let i = 0; i < voicesArr.length; i++) {
      let opt = ``;
      if (i === 0) {
        opt = `<option selected value="${voicesArr[i].id}">${voicesArr[i].name}</option>`;
      } else {
        opt = `<option value="${voicesArr[i].id}">${voicesArr[i].name}</option>`;
      }

      /* 
      let opt = document.createElement("option");
      opt.value = voicesArr[i].id;
      opt.innerText = voicesArr[i].name; */

      elements.insertAdjacentHTML("beforeend", opt);
    }
  }

  const selectedOption = elements.value;

  const voiceNumber = Number(selectedOption) || 0;
  //console.log(voiceNumber);
  let result = voicesArr[voiceNumber].id;
  //console.log(result);
  return result;
}

let voices = [];
let waitingTime = 1000;

function readWord(word, chosenVoice) {
  if ("speechSynthesis" in window) {
    let msg = new SpeechSynthesisUtterance();

    msg.text = word;

    voices = window.speechSynthesis.getVoices();
    //console.log(voices);
    msg.onend = function (event) {
      waitingTime = event.elapsedTime.toFixed(0);
      if (waitingFlag === 1) {
        unSelectWord(word);
      }
      waitingFlag = 0;
    };

    const voiceSelected = voices[getChosenVoice()] || voices[0];
    msg.volume = 1; // From 0 to 1
    msg.rate = 1; // From 0.1 to 10
    msg.pitch = 1; // From 0 to 2
    msg.lang = "en-US";
    msg.voice = voiceSelected;
    //console.log(voiceSelected);
    window.speechSynthesis.speak(msg);
  } else {
    alert("Sorry, your browser does not support speech synthesis.");
  }
}

function selectWord(input) {
  const id = `${input}_li`;
  const element = document.getElementById(id);
  element.setAttribute("class", "selectedWord");
  if (window.innerHeight + window.scrollY < document.body.offsetHeight) {
    window.scrollBy(0, 40); // Continue scrolling if not at the bottom
  }
}

function unSelectWord(input) {
  const id = `${input}_li`;
  const element = document.getElementById(id);
  element.removeAttribute("class", "selectedWord");
}

function nextPageBtn() {
  const nextPage = document.querySelectorAll(".nextPage");

  nextPage.forEach((element) => {
    element.addEventListener("click", () => {
      if (lastStudy.to < fileLines.length) {
        const delta = lastStudy.to - lastStudy.from; //100
        lastStudy.from = lastStudy.to;
        lastStudy.to = lastStudy.from + delta;

        setLocalStorage("lastStudy", lastStudy);
        writeInPage();
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }
    });
  });
}

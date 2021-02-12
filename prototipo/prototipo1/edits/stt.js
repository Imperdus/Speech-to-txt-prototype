//=====================================================|Variaveis|======================================================
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var gum = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

var button = document.querySelector('#stt')
var stop = document.querySelector('#stop')
var textarea = document.querySelector('#result')
var bg = document.querySelector('html');
var hints = document.querySelector('.hints');
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
var listas = JSON.parse(window.localStorage.getItem('file')) || []
var id = listas.length || 0
var mediaRecorder;
var result;

// Variaveis de data
var data = new Date();
var dia = data.getDate();           // 1-31
var mes = data.getMonth()+1;          // 0-11 (zero=janeiro)
var ano = data.getFullYear()           // 4 dígitos

// Tabel function
var file
var cell0
var cell1
var cell2
var cell3
var cell4
var cell5
var id
var date
var txt
var WAV
var del
//======================================================|Funções|=======================================================
function toggle(id) {
    listas.forEach(function(item) {
        // use == not ===, because here types are different. One is number and other is string
        if (item.id == id) {
          // toggle the value
          item.completed = !item.completed;
        }
    });
}
function deleteTodo(id) {
    listas = listas.filter(function(item) {
        return item.id != id;
    });
    window.localStorage.setItem('file',JSON.stringify(listas));
    tabel();
}
function tabel(){

    file = JSON.parse(window.localStorage.getItem('file')) || []
    document.getElementById('storage').innerHTML= ''

    for(let element of file){

        cell0 = document.createElement("tr");
        cell1 = document.createElement("td");
        cell2 = document.createElement("td");
        cell3 = document.createElement("td");
        cell4 = document.createElement("td");
        cell5 = document.createElement("td");
        id = document.createTextNode(element.id);
        date = document.createTextNode(element.data);

        txt = document.createElement("button");
        txt.innerHTML= 'texto'
        txt.onclick = function(){
            console.log(element)
            textarea.value = element.txt;
        }

        WAV = document.createElement("audio");
        WAV.setAttribute('controls', '');
        WAV.src = element.WAV.replace('blob:', '');

        del = document.createElement("button");
        del.innerHTML= 'delete'
        del.onclick = function(){
        deleteTodo(element.id)
        console.log(element.id)
        }

        cell1.appendChild(id);
        cell2.appendChild(date);
        cell3.appendChild(txt);
        cell4.appendChild(WAV);
        cell5.appendChild(del);
        cell0.appendChild(cell1);
        cell0.appendChild(cell2);
        cell0.appendChild(cell3);
        cell0.appendChild(cell4);
        cell0.appendChild(cell5);
        document.getElementById('storage').appendChild(cell0);
    }
}
//========================================================|IF|==========================================================
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
   console.log('getUserMedia supported.');
   navigator.mediaDevices.getUserMedia (
      // constraints - only audio needed for this app
      {
         audio: true
      })

      // Success callback
      .then(function(stream) {

          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = function(e) {
              let chunks = [];
              chunks.push(e.data);
              mediaRecorder.onstop = function(e) {

                  console.log("recorder stopped");
                  const clipName = prompt('Enter a name for your sound clip');
                  const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
                  chunks = [];
                  const audioURL = window.URL.createObjectURL(blob);
                  // audio.src = audioURL;
                  console.log(audioURL);

                  listas.push({
                      id: id+=1,
                      data: dia+" / "+mes+" / "+ano,
                      txt: result,
                      WAV: audioURL,
                      del: '',
                  })
                  window.localStorage.setItem('file',JSON.stringify(listas));
              }
          }
      })

      // Error callback
      .catch(function(err) {
         console.log('The following getUserMedia error occurred: ' + err);
      }
   );
}
else {
   console.log('getUserMedia not supported on your browser!');
}
//======================================================================================================================
window.onstorage = () => {
    console.log('b');
    tabel();
};

tabel()

recognition.continuous = false;
recognition.lang = 'pt-br';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
recognition.onresult = function(event) {
    result = event.results[0][0].transcript;
    textarea.value = result;

}

stt.onclick = function() {
    recognition.start();
    mediaRecorder.start();
    console.log(mediaRecorder.state);
    console.log("recorder started");
}
stop.onclick = function() {
    //tabel();
    recognition.stop();
    console.log(recognition)
    mediaRecorder.stop();
    console.log(mediaRecorder.state);
    console.log("recorder stopped");
}


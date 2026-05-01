<audio id="makeCoffeeAudio" src="audio/make-a-coffee.mp3" preload="none"></audio>
  <audio id="machineOnAudio" src="audio/machine-on.mp3" preload="none"></audio>
  <audio id="podGoAudio" src="audio/pod-go.mp3" preload="none"></audio>
  <audio id="waterTankAudio" src="audio/water-tank.mp3" preload="none"></audio>
  <audio id="refillWaterAudio" src="audio/refill-water.mp3" preload="none"></audio>
  <audio id="emptyPodsAudio" src="audio/empty-pods.mp3" preload="none"></audio>
  <audio id="machineStoppedAudio" src="audio/machine-stopped.mp3" preload="none"></audio>

  <script>
    const answers = {
      coffeeAnswer: {
        audio: "makeCoffeeAudio",
        keywords: ["take a look", "make coffee", "make a coffee", "coffee", "cup", "drink", "brew", "espresso", "lungo"]
      },
      machineOnAnswer: {
        audio: "machineOnAudio",
        keywords: ["machine on", "turned on", "on", "light", "ready", "warming"]
      },
      podGoAnswer: {
        audio: "podGoAudio",
        keywords: ["pod", "pods", "which way", "way round", "way up", "capsule"]
      },
      waterTankAnswer: {
        audio: "waterTankAudio",
        keywords: ["water tank", "tank", "where is the water", "water container"]
      },
      waterAnswer: {
        audio: "refillWaterAudio",
        keywords: ["refill", "fill water", "add water", "more water"]
      },
      podsAnswer: {
        audio: "emptyPodsAudio",
        keywords: ["empty pods", "used pods", "bin", "drawer", "capsule tray", "empty"]
      },
      stoppedAnswer: {
        audio: "machineStoppedAudio",
        keywords: ["stopped", "stuck", "not working", "broken", "jammed", "stops", "reset", "descaling"]
      }
    };

    function stopAudio() {
      Object.values(answers).forEach(item => {
        const audio = document.getElementById(item.audio);
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    }

    function hideAllAnswers() {
      document.querySelectorAll(".answer").forEach(answer => {
        answer.classList.remove("show");
      });
    }

   function playAudio(audioId) {
  const audio = document.getElementById(audioId);
  const status = document.getElementById("voiceStatus");

  if (!audio) {
    if (status) status.textContent = "Audio file could not be found.";
    return;
  }

  audio.pause();
  audio.currentTime = 0;
  audio.load();

  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.catch(() => {
      if (status) {
        status.textContent = "Audio did not start. Please tap the question again.";
      }
    });
  }
}

function showAnswer(answerId) {
  const answer = document.getElementById(answerId);
  const item = answers[answerId];

  if (!answer || !item) return;

  stopAudio();
  hideAllAnswers();

  answer.classList.add("show");

  playAudio(item.audio);

  setTimeout(() => {
    answer.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 100);
}
    function findBestAnswer(spokenText) {
      const text = spokenText.toLowerCase();

      for (const [answerId, item] of Object.entries(answers)) {
        if (item.keywords.some(keyword => text.includes(keyword))) {
          return answerId;
        }
      }

      return null;
    }

    function startVoiceAsk() {
      const status = document.getElementById("voiceStatus");
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        status.textContent = "Voice recognition is not available in this browser. Please tap a question below.";
        return;
      }

      const recognition = new SpeechRecognition();

      recognition.lang = "en-GB";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      status.textContent = "Listening. Ask your coffee machine question.";

      recognition.start();

      recognition.onresult = function(event) {
        const spokenText = event.results[0][0].transcript;
        const answerId = findBestAnswer(spokenText);

        if (answerId) {
          status.textContent = "I heard: “" + spokenText + "”. Opening the closest answer.";
          showAnswer(answerId);
        } else {
          status.textContent = "I heard: “" + spokenText + "”. Please tap the closest question below.";
        }
      };

      recognition.onerror = function() {
        status.textContent = "Voice did not start clearly. Please tap a question below.";
      };
    }
  </script>

(function () {
  "use strict";

  let watchedRoomCode = "";
  let statusListener = null;
  let newRoundButton = null;

  function getRoomCode() {
    const roomCodeElement =
      document.getElementById("coachRoomCode");

    if (!roomCodeElement) {
      return "";
    }

    return roomCodeElement.textContent
      .trim()
      .toUpperCase();
  }

  function getQuestionBank() {
    return Array.isArray(window.QUESTION_BANK)
      ? window.QUESTION_BANK
      : [];
  }

  function shuffle(array) {
    const copied = [...array];

    for (let i = copied.length - 1; i > 0; i--) {
      const randomIndex =
        Math.floor(Math.random() * (i + 1));

      [copied[i], copied[randomIndex]] = [
        copied[randomIndex],
        copied[i]
      ];
    }

    return copied;
  }

  function versePosition(chapter, verse) {
    return Number(chapter) * 1000 + Number(verse);
  }

  function getQuestionsForSettings(settings) {
    const questionBank = getQuestionBank();

    const start =
      versePosition(
        settings.startChapter,
        settings.startVerse
      );

    const end =
      versePosition(
        settings.endChapter,
        settings.endVerse
      );

    const selectedTypes =
      Array.isArray(settings.questionTypes)
        ? settings.questionTypes
        : [];

    return questionBank.filter(question => {
      const position =
        versePosition(
          question.chapter,
          question.verse
        );

      return (
        position >= start &&
        position <= end &&
        selectedTypes.includes(question.type)
      );
    });
  }

  function showMessage(message) {
    const errorBox =
      document.getElementById("errorMessage");

    if (!errorBox) {
      alert(message);
      return;
    }

    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
  }

  function setButtonVisible(visible) {
    if (!newRoundButton) {
      return;
    }

    newRoundButton.style.display =
      visible ? "block" : "none";
  }

  function createNewRoundButton() {
    if (document.getElementById("coachNewRoundButton")) {
      newRoundButton =
        document.getElementById("coachNewRoundButton");

      return;
    }

    const nextButton =
      document.getElementById("coachNextButton");

    if (!nextButton) {
      return;
    }

    newRoundButton =
      document.createElement("button");

    newRoundButton.id =
      "coachNewRoundButton";

    newRoundButton.className =
      "green";

    newRoundButton.textContent =
      "New Round";

    newRoundButton.style.display =
      "none";

    newRoundButton.addEventListener(
      "click",
      startNewRound
    );

    nextButton.insertAdjacentElement(
      "afterend",
      newRoundButton
    );
  }

  function watchRoom(roomCode) {
    if (!roomCode) {
      return;
    }

    if (
      watchedRoomCode === roomCode &&
      statusListener
    ) {
      return;
    }

    if (
      statusListener &&
      watchedRoomCode
    ) {
      firebase
        .database()
        .ref("rooms/" + watchedRoomCode + "/status")
        .off("value", statusListener);
    }

    watchedRoomCode = roomCode;

    statusListener = snapshot => {
      const status = snapshot.val();

      setButtonVisible(
        status === "finished"
      );
    };

    firebase
      .database()
      .ref("rooms/" + roomCode + "/status")
      .on("value", statusListener);
  }

  async function startNewRound() {
    const roomCode = getRoomCode();

    if (!roomCode) {
      showMessage(
        "Could not find the current room code."
      );
      return;
    }

    if (!window.firebase) {
      showMessage(
        "Firebase is not available."
      );
      return;
    }

    try {
      if (newRoundButton) {
        newRoundButton.disabled = true;
        newRoundButton.textContent =
          "Creating New Round...";
      }

      const roomReference =
        firebase
          .database()
          .ref("rooms/" + roomCode);

      const snapshot =
        await roomReference.once("value");

      const room = snapshot.val();

      if (!room) {
        showMessage(
          "This room no longer exists."
        );
        return;
      }

      const settings =
        room.settings;

      if (!settings) {
        showMessage(
          "This room does not have saved quiz settings."
        );
        return;
      }

      const availableQuestions =
        getQuestionsForSettings(settings);

      if (availableQuestions.length === 0) {
        showMessage(
          "No questions match the saved settings."
        );
        return;
      }

      const requestedCount =
        settings.questionCount === "all"
          ? availableQuestions.length
          : Number(settings.questionCount);

      const actualCount =
        Math.min(
          requestedCount,
          availableQuestions.length
        );

      const newQuestions =
        shuffle(availableQuestions)
          .slice(0, actualCount);

      const updates = {
        status: "started",
        questionIds:
          newQuestions.map(
            question => question.id
          ),
        currentQuestionIndex: 0,
        buzzedBy: null,
        questionOpen: true,
        questionVisibleToStudents: false,
        questionStartedAt:
          firebase.database.ServerValue.TIMESTAMP,
        startedAt:
          firebase.database.ServerValue.TIMESTAMP
      };

      /*
        Reset all player scores for the new round.
      */
      Object.entries(
        room.players || {}
      ).forEach(([uid, player]) => {
        if (player.role === "student") {
          updates[
            "players/" + uid + "/correct"
          ] = 0;

          updates[
            "players/" + uid + "/wrong"
          ] = 0;

          updates[
            "players/" + uid + "/limitOverride"
          ] = false;
        }
      });

      await roomReference.update(updates);

      setButtonVisible(false);

    } catch (error) {
      showMessage(
        "Could not create new round: " +
        error.message
      );
    } finally {
      if (newRoundButton) {
        newRoundButton.disabled = false;
        newRoundButton.textContent =
          "New Round";
      }
    }
  }

  function makeDefaultMaxCorrectFour() {
    const maxCorrect =
      document.getElementById(
        "maxCorrectSelect"
      );

    if (!maxCorrect) {
      return;
    }

    /*
      Only change the default before a room has
      been created. It does not change an active room.
    */
    if (!getRoomCode()) {
      maxCorrect.value = "4";
    }
  }

  function startWatchingForRoom() {
    createNewRoundButton();
    makeDefaultMaxCorrectFour();

    /*
      Watch the Coach room-code area.
      When Coach creates a room, attach a Firebase
      listener and show New Round after status=finished.
    */
    window.setInterval(() => {
      const roomCode =
        getRoomCode();

      if (roomCode) {
        watchRoom(roomCode);
      }
    }, 1000);
  }

  document.addEventListener(
    "DOMContentLoaded",
    startWatchingForRoom
  );

  /*
    If this script loads after DOMContentLoaded,
    run immediately.
  */
  if (
    document.readyState === "interactive" ||
    document.readyState === "complete"
  ) {
    startWatchingForRoom();
  }
})();

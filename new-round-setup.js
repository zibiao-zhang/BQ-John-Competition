(function () {
  "use strict";

  let roundSetupMode = false;
  let watchedRoomCode = "";
  let statusListener = null;
  let newRoundSetupButton = null;

  function getRoomCode() {
    const element =
      document.getElementById(
        "coachRoomCode"
      );

    if (!element) {
      return "";
    }

    return element.textContent
      .trim()
      .toUpperCase();
  }

  function getRoomReference(roomCode) {
    return firebase
      .database()
      .ref("rooms/" + roomCode);
  }

  function getQuestionBank() {
    return Array.isArray(window.QUESTION_BANK)
      ? window.QUESTION_BANK
      : [];
  }

  function getPosition(chapter, verse) {
    return Number(chapter) * 1000 +
      Number(verse);
  }

  function shuffle(array) {
    const copied = [...array];

    for (
      let index = copied.length - 1;
      index > 0;
      index--
    ) {
      const randomIndex =
        Math.floor(
          Math.random() * (index + 1)
        );

      [
        copied[index],
        copied[randomIndex]
      ] = [
        copied[randomIndex],
        copied[index]
      ];
    }

    return copied;
  }

  function showErrorMessage(message) {
    const errorBox =
      document.getElementById(
        "errorMessage"
      );

    if (errorBox) {
      errorBox.textContent = message;
      errorBox.classList.remove("hidden");
    } else {
      alert(message);
    }
  }

  function clearErrorMessage() {
    const errorBox =
      document.getElementById(
        "errorMessage"
      );

    if (errorBox) {
      errorBox.textContent = "";
      errorBox.classList.add("hidden");
    }
  }

  function getCheckedTypes() {
    return [
      ...document.querySelectorAll(
        'input[name="coachType"]:checked'
      )
    ].map(input => input.value);
  }

  function getSettingsFromForm() {
    return {
      startChapter: Number(
        document.getElementById(
          "coachStartChapter"
        ).value
      ),

      startVerse: Number(
        document.getElementById(
          "coachStartVerse"
        ).value
      ),

      endChapter: Number(
        document.getElementById(
          "coachEndChapter"
        ).value
      ),

      endVerse: Number(
        document.getElementById(
          "coachEndVerse"
        ).value
      ),

      questionTypes: getCheckedTypes(),

      questionCount:
        document.getElementById(
          "coachQuestionCount"
        ).value === "all"
          ? "all"
          : Number(
              document.getElementById(
                "coachQuestionCount"
              ).value
            ),

      maxCorrect: Number(
        document.getElementById(
          "maxCorrectSelect"
        ).value
      )
    };
  }

  function getQuestionsForSettings(settings) {
    const start =
      getPosition(
        settings.startChapter,
        settings.startVerse
      );

    const end =
      getPosition(
        settings.endChapter,
        settings.endVerse
      );

    const selectedTypes =
      Array.isArray(settings.questionTypes)
        ? settings.questionTypes
        : [];

    return getQuestionBank().filter(
      question => {
        const position =
          getPosition(
            question.chapter,
            question.verse
          );

        return (
          position >= start &&
          position <= end &&
          selectedTypes.includes(question.type)
        );
      }
    );
  }

  function applySettingsToForm(settings) {
    if (!settings) {
      return;
    }

    const startChapter =
      document.getElementById(
        "coachStartChapter"
      );

    const startVerse =
      document.getElementById(
        "coachStartVerse"
      );

    const endChapter =
      document.getElementById(
        "coachEndChapter"
      );

    const endVerse =
      document.getElementById(
        "coachEndVerse"
      );

    const questionCount =
      document.getElementById(
        "coachQuestionCount"
      );

    const maxCorrect =
      document.getElementById(
        "maxCorrectSelect"
      );

    /*
      Set chapters first.
    */
    startChapter.value =
      String(settings.startChapter);

    endChapter.value =
      String(settings.endChapter);

    /*
      Trigger verse list rebuilding.
    */
    startChapter.dispatchEvent(
      new Event("change")
    );

    endChapter.dispatchEvent(
      new Event("change")
    );

    startVerse.value =
      String(settings.startVerse);

    endVerse.value =
      String(settings.endVerse);

    questionCount.value =
      String(settings.questionCount);

    maxCorrect.value =
      String(settings.maxCorrect || 4);

    const allowedTypes =
      Array.isArray(settings.questionTypes)
        ? settings.questionTypes
        : [];

    document
      .querySelectorAll(
        'input[name="coachType"]'
      )
      .forEach(input => {
        input.checked =
          allowedTypes.includes(
            input.value
          );
      });

    if (typeof updateCoachPreview === "function") {
      updateCoachPreview();
    }
  }

  function showCoachSetup() {
    const home =
      document.getElementById(
        "homeScreen"
      );

    const coach =
      document.getElementById(
        "coachScreen"
      );

    const student =
      document.getElementById(
        "studentScreen"
      );

    const coachCompetition =
      document.getElementById(
        "coachCompetitionScreen"
      );

    const studentCompetition =
      document.getElementById(
        "studentCompetitionScreen"
      );

    [
      home,
      coach,
      student,
      coachCompetition,
      studentCompetition
    ].forEach(element => {
      if (element) {
        element.classList.add("hidden");
      }
    });

    if (coach) {
      coach.classList.remove("hidden");
    }
  }

  function setSetupModeUI(active) {
    const createButton =
      document.getElementById(
        "createRoomButton"
      );

    const roomArea =
      document.getElementById(
        "coachRoomArea"
      );

    const title =
      document.querySelector(
        "#coachScreen h2"
      );

    if (active) {
      if (title) {
        title.textContent =
          "New Round Setup";
      }

      if (createButton) {
        createButton.textContent =
          "Start New Round";
      }

      if (roomArea) {
        roomArea.classList.add("hidden");
      }
    } else {
      if (title) {
        title.textContent =
          "Coach Setup";
      }

      if (createButton) {
        createButton.textContent =
          "Create New Room";
      }
    }
  }

  function createNewRoundButton() {
    const existing =
      document.getElementById(
        "coachNewRoundSetupButton"
      );

    if (existing) {
      newRoundSetupButton = existing;
      return;
    }

    const nextButton =
      document.getElementById(
        "coachNextButton"
      );

    if (!nextButton) {
      return;
    }

    newRoundSetupButton =
      document.createElement("button");

    newRoundSetupButton.id =
      "coachNewRoundSetupButton";

    newRoundSetupButton.className =
      "green";

    newRoundSetupButton.textContent =
      "New Round Setup";

    newRoundSetupButton.style.display =
      "none";

    newRoundSetupButton.addEventListener(
      "click",
      openNewRoundSetup
    );

    nextButton.insertAdjacentElement(
      "afterend",
      newRoundSetupButton
    );
  }

  function setNewRoundButtonVisible(visible) {
    if (!newRoundSetupButton) {
      return;
    }

    newRoundSetupButton.style.display =
      visible ? "block" : "none";
  }

  async function openNewRoundSetup() {
    const roomCode = getRoomCode();

    if (!roomCode) {
      showErrorMessage(
        "Could not find the current room code."
      );

      return;
    }

    try {
      clearErrorMessage();

      const snapshot =
        await getRoomReference(roomCode)
          .once("value");

      const room = snapshot.val();

      if (!room) {
        showErrorMessage(
          "The room no longer exists."
        );

        return;
      }

      /*
        Keep old values prefilled so Coach can
        keep them or change them.
      */
      applySettingsToForm(room.settings);

      roundSetupMode = true;
      setSetupModeUI(true);
      showCoachSetup();

      /*
        Students stay connected but return to
        waiting screen while Coach sets up.
      */
      await getRoomReference(roomCode).update({
        status: "round_setup",
        buzzedBy: null,
        questionOpen: false,
        questionVisibleToStudents: false
      });

      setNewRoundButtonVisible(false);

    } catch (error) {
      showErrorMessage(
        "Could not open New Round Setup: " +
        error.message
      );
    }
  }

  async function startNewRound() {
    const roomCode = getRoomCode();

    if (!roomCode) {
      showErrorMessage(
        "Could not find the current room code."
      );

      return;
    }

    const settings =
      getSettingsFromForm();

    if (
      getPosition(
        settings.startChapter,
        settings.startVerse
      ) >
      getPosition(
        settings.endChapter,
        settings.endVerse
      )
    ) {
      showErrorMessage(
        "Invalid reference range."
      );

      return;
    }

    if (settings.questionTypes.length === 0) {
      showErrorMessage(
        "Select at least one question type."
      );

      return;
    }

    const availableQuestions =
      getQuestionsForSettings(settings);

    if (availableQuestions.length === 0) {
      showErrorMessage(
        "No questions match these new round settings."
      );

      return;
    }

    try {
      clearErrorMessage();

      const createButton =
        document.getElementById(
          "createRoomButton"
        );

      if (createButton) {
        createButton.disabled = true;
        createButton.textContent =
          "Starting New Round...";
      }

      const roomReference =
        getRoomReference(roomCode);

      const snapshot =
        await roomReference.once("value");

      const room = snapshot.val();

      if (!room) {
        showErrorMessage(
          "The room no longer exists."
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

      const selectedQuestions =
        shuffle(availableQuestions)
          .slice(0, actualCount);

      const updates = {
        status: "started",
        settings: settings,
        questionIds:
          selectedQuestions.map(
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
        Reset every Student score.
        Coach remains in room unchanged.
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

      roundSetupMode = false;
      setSetupModeUI(false);
      setNewRoundButtonVisible(false);

    } catch (error) {
      showErrorMessage(
        "Could not start New Round: " +
        error.message
      );
    } finally {
      const createButton =
        document.getElementById(
          "createRoomButton"
        );

      if (createButton) {
        createButton.disabled = false;

        if (roundSetupMode) {
          createButton.textContent =
            "Start New Round";
        } else {
          createButton.textContent =
            "Create New Room";
        }
      }
    }
  }

  function attachCreateRoomInterceptor() {
    const createButton =
      document.getElementById(
        "createRoomButton"
      );

    if (!createButton) {
      return;
    }

    /*
      Capture phase runs BEFORE the existing
      normal Create Room listener.
    */
    createButton.addEventListener(
      "click",
      event => {
        if (!roundSetupMode) {
          return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();

        startNewRound();
      },
      true
    );
  }

  function attachBackButtonHandler() {
    const backButton =
      document.getElementById(
        "coachBackButton"
      );

    if (!backButton) {
      return;
    }

    backButton.addEventListener(
      "click",
      () => {
        if (roundSetupMode) {
          roundSetupMode = false;
          setSetupModeUI(false);
        }
      },
      true
    );
  }

  function watchRoomStatus(roomCode) {
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
      watchedRoomCode &&
      statusListener
    ) {
      getRoomReference(watchedRoomCode)
        .child("status")
        .off("value", statusListener);
    }

    watchedRoomCode = roomCode;

    statusListener = snapshot => {
      const status = snapshot.val();

      setNewRoundButtonVisible(
        status === "finished"
      );

      /*
        Student waiting message while Coach
        is setting up a new round.
      */
      if (status === "round_setup") {
        const studentStatus =
          document.getElementById(
            "studentStatus"
          );

        const studentCompetitionStatus =
          document.getElementById(
            "studentCompetitionStatus"
          );

        if (studentStatus) {
          studentStatus.textContent =
            "Round finished. Waiting for the coach to set up the next round.";
        }

        if (studentCompetitionStatus) {
          studentCompetitionStatus.textContent =
            "Round finished. Waiting for the coach to set up the next round.";
        }
      }
    };

    getRoomReference(roomCode)
      .child("status")
      .on("value", statusListener);
  }

  function setDefaultMaxCorrect() {
    const maxCorrect =
      document.getElementById(
        "maxCorrectSelect"
      );

    if (!maxCorrect) {
      return;
    }

    /*
      Default only. Active room settings remain unchanged.
    */
    if (!getRoomCode()) {
      maxCorrect.value = "4";
    }
  }

  function initializeNewRoundFeature() {
    createNewRoundButton();
    attachCreateRoomInterceptor();
    attachBackButtonHandler();
    setDefaultMaxCorrect();

    /*
      Find Coach Room Code after a room is created.
    */
    window.setInterval(() => {
      const roomCode =
        getRoomCode();

      if (roomCode) {
        watchRoomStatus(roomCode);
      }
    }, 1000);
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initializeNewRoundFeature
    );
  } else {
    initializeNewRoundFeature();
  }
})();

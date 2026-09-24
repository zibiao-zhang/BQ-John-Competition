(function () {
  "use strict";

  let watchedRoomCode = "";
  let roomListener = null;
  let answerBox = null;
  let answerText = null;
  let answerReference = null;

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

  function getQuestion(questionId) {
    if (!Array.isArray(window.QUESTION_BANK)) {
      return null;
    }

    return window.QUESTION_BANK.find(
      question => question.id === questionId
    );
  }

  function createCoachAnswerBox() {
    if (
      document.getElementById(
        "coachCorrectAnswerBox"
      )
    ) {
      answerBox =
        document.getElementById(
          "coachCorrectAnswerBox"
        );

      answerText =
        document.getElementById(
          "coachCorrectAnswerText"
        );

      answerReference =
        document.getElementById(
          "coachCorrectAnswerReference"
        );

      return;
    }

    const questionBox =
      document.getElementById(
        "coachQuestionBox"
      );

    if (!questionBox) {
      return;
    }

    answerBox =
      document.createElement("div");

    answerBox.id =
      "coachCorrectAnswerBox";

    answerBox.style.marginTop =
      "18px";

    answerBox.style.padding =
      "14px";

    answerBox.style.borderLeft =
      "5px solid #16834b";

    answerBox.style.borderRadius =
      "8px";

    answerBox.style.background =
      "#effcf5";

    const label =
      document.createElement("div");

    label.textContent =
      "CORRECT ANSWER";

    label.style.color =
      "#16834b";

    label.style.fontWeight =
      "bold";

    label.style.fontSize =
      "13px";

    label.style.marginBottom =
      "8px";

    answerText =
      document.createElement("div");

    answerText.id =
      "coachCorrectAnswerText";

    answerText.style.fontWeight =
      "bold";

    answerText.style.fontSize =
      "18px";

    answerText.style.lineHeight =
      "1.45";

    answerReference =
      document.createElement("div");

    answerReference.id =
      "coachCorrectAnswerReference";

    answerReference.style.marginTop =
      "8px";

    answerReference.style.color =
      "#667085";

    answerReference.style.fontSize =
      "13px";

    answerBox.appendChild(label);
    answerBox.appendChild(answerText);
    answerBox.appendChild(answerReference);

    questionBox.appendChild(answerBox);
  }

  function showAnswer(room) {
    createCoachAnswerBox();

    if (
      !answerBox ||
      !answerText ||
      !answerReference
    ) {
      return;
    }

    if (
      !room ||
      room.status !== "started" ||
      !Array.isArray(room.questionIds) ||
      room.currentQuestionIndex < 0
    ) {
      answerBox.style.display =
        "none";

      return;
    }

    const questionId =
      room.questionIds[
        room.currentQuestionIndex
      ];

    const question =
      getQuestion(questionId);

    if (!question) {
      answerBox.style.display =
        "none";

      return;
    }

    answerText.textContent =
      question.answer || "";

    answerReference.textContent =
      "Reference: " +
      (question.reference || "");

    answerBox.style.display =
      "block";
  }

  function watchRoom(roomCode) {
    if (!roomCode || !window.firebase) {
      return;
    }

    if (
      watchedRoomCode === roomCode &&
      roomListener
    ) {
      return;
    }

    if (
      watchedRoomCode &&
      roomListener
    ) {
      firebase
        .database()
        .ref("rooms/" + watchedRoomCode)
        .off("value", roomListener);
    }

    watchedRoomCode = roomCode;

    roomListener = snapshot => {
      showAnswer(snapshot.val());
    };

    firebase
      .database()
      .ref("rooms/" + roomCode)
      .on("value", roomListener);
  }

  function initialize() {
    /*
      Check every second whether the Coach
      has created or joined a room.
    */
    window.setInterval(() => {
      const roomCode =
        getRoomCode();

      if (roomCode) {
        watchRoom(roomCode);
      }
    }, 1000);
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initialize
    );
  } else {
    initialize();
  }
})();

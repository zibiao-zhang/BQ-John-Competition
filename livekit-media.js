window.LiveKitMedia = {
  room: null,
  localTracks: [],
  connected: false,
  mediaContainer: null,
  participantElements: {},

  async connect(roomName) {
    if (!window.LivekitClient) {
      throw new Error("LiveKit SDK is not loaded.");
    }

    if (!window.LIVEKIT_CONFIG) {
      throw new Error("LiveKit configuration is missing.");
    }

    if (this.room) {
      return this.room;
    }

    let tokenSource;

    if (
      LivekitClient.TokenSource &&
      typeof LivekitClient.TokenSource
        .developmentTokenServer === "function"
    ) {
      tokenSource =
        LivekitClient.TokenSource
          .developmentTokenServer(
            window.LIVEKIT_CONFIG.tokenServerId
          );
    } else if (
      LivekitClient.TokenSource &&
      typeof LivekitClient.TokenSource
        .sandboxTokenServer === "function"
    ) {
      tokenSource =
        LivekitClient.TokenSource
          .sandboxTokenServer(
            window.LIVEKIT_CONFIG.tokenServerId
          );
    } else {
      throw new Error(
        "No compatible LiveKit token server method was found."
      );
    }

    const tokenResult =
      await tokenSource.fetch({
        roomName: roomName
      });

    this.room =
      new LivekitClient.Room({
        adaptiveStream: true,
        dynacast: true,
        autoSubscribe: true
      });

    this.room.on(
      LivekitClient.RoomEvent.TrackSubscribed,
      (track, publication, participant) => {
        this.attachRemoteTrack(
          track,
          participant
        );
      }
    );

    this.room.on(
      LivekitClient.RoomEvent.TrackUnsubscribed,
      (track, publication, participant) => {
        this.detachTrack(track);
      }
    );

    this.room.on(
      LivekitClient.RoomEvent.ParticipantDisconnected,
      participant => {
        this.removeParticipantMedia(
          participant.identity
        );
      }
    );

    await this.room.connect(
      tokenResult.serverUrl,
      tokenResult.participantToken
    );

    this.connected = true;

    this.createMediaContainer();

    console.log(
      "Connected to LiveKit room:",
      roomName
    );

    return this.room;
  },

  async ensureConnected(roomName) {
    if (!this.connected || !this.room) {
      await this.connect(roomName);
    }

    return this.room;
  },

  createMediaContainer() {
    if (this.mediaContainer) {
      return this.mediaContainer;
    }

    this.mediaContainer =
      document.createElement("div");

    this.mediaContainer.id =
      "livekitMediaContainer";

    this.mediaContainer.style.display =
      "grid";

    this.mediaContainer.style.gridTemplateColumns =
      "repeat(auto-fit, minmax(220px, 1fr))";

    this.mediaContainer.style.gap =
      "12px";

    this.mediaContainer.style.marginTop =
      "16px";

    const coachBox =
      document.getElementById(
        "coachCompetitionScreen"
      );

    const studentBox =
      document.getElementById(
        "studentCompetitionScreen"
      );

    if (coachBox) {
      coachBox.appendChild(
        this.mediaContainer.cloneNode(false)
      );
    }

    if (studentBox) {
      studentBox.appendChild(
        this.mediaContainer.cloneNode(false)
      );
    }

    return this.mediaContainer;
  },

  getVisibleMediaContainer() {
    const coachScreen =
      document.getElementById(
        "coachCompetitionScreen"
      );

    const studentScreen =
      document.getElementById(
        "studentCompetitionScreen"
      );

    if (
      coachScreen &&
      !coachScreen.classList.contains("hidden")
    ) {
      let container =
        document.getElementById(
          "coachLivekitMediaContainer"
        );

      if (!container) {
        container =
          document.createElement("div");

        container.id =
          "coachLivekitMediaContainer";

        container.className =
          "livekit-media-container";

        coachScreen.appendChild(container);
      }

      return container;
    }

    if (
      studentScreen &&
      !studentScreen.classList.contains("hidden")
    ) {
      let container =
        document.getElementById(
          "studentLivekitMediaContainer"
        );

      if (!container) {
        container =
          document.createElement("div");

        container.id =
          "studentLivekitMediaContainer";

        container.className =
          "livekit-media-container";

        studentScreen.appendChild(container);
      }

      return container;
    }

    return null;
  },

  attachRemoteTrack(track, participant) {
    const container =
      this.getVisibleMediaContainer();

    if (!container) {
      return;
    }

    const identity =
      participant.identity;

    let participantBox =
      document.getElementById(
        "participant-" + identity
      );

    if (!participantBox) {
      participantBox =
        document.createElement("div");

      participantBox.id =
        "participant-" + identity;

      participantBox.className =
        "livekit-participant";

      const name =
        document.createElement("div");

      name.className =
        "livekit-participant-name";

      name.textContent =
        participant.name ||
        identity;

      participantBox.appendChild(name);
      container.appendChild(participantBox);

      this.participantElements[identity] =
        participantBox;
    }

    const element =
      track.attach();

    element.dataset.identity =
      identity;

    if (track.kind === "video") {
      element.className =
        "livekit-video";

      element.autoplay = true;
      element.playsInline = true;
    }

    if (track.kind === "audio") {
      element.className =
        "livekit-audio";

      element.autoplay = true;
      element.controls = false;
    }

    participantBox.appendChild(element);

    try {
      element.play();
    } catch (error) {
      console.warn(
        "Autoplay requires user interaction.",
        error
      );
    }
  },

  attachLocalPreview(track) {
    const container =
      this.getVisibleMediaContainer();

    if (!container) {
      return;
    }

    let participantBox =
      document.getElementById(
        "participant-local"
      );

    if (!participantBox) {
      participantBox =
        document.createElement("div");

      participantBox.id =
        "participant-local";

      participantBox.className =
        "livekit-participant";

      const name =
        document.createElement("div");

      name.className =
        "livekit-participant-name";

      name.textContent =
        "You";

      participantBox.appendChild(name);
      container.appendChild(participantBox);
    }

    const element =
      track.attach();

    element.dataset.identity =
      "local";

    if (track.kind === "video") {
      element.className =
        "livekit-video";

      element.autoplay = true;
      element.muted = true;
      element.playsInline = true;
    }

    if (track.kind === "audio") {
      element.className =
        "livekit-audio";

      element.autoplay = true;
      element.muted = true;
    }

    participantBox.appendChild(element);
  },

  detachTrack(track) {
    try {
      track.detach();
    } catch (error) {
      console.warn(
        "Could not detach track.",
        error
      );
    }
  },

  removeParticipantMedia(identity) {
    const element =
      document.getElementById(
        "participant-" + identity
      );

    if (element) {
      element.remove();
    }

    delete this.participantElements[
      identity
    ];
  },

  hasAudioTrack() {
    return this.localTracks.some(
      track => track.kind === "audio"
    );
  },

  hasVideoTrack() {
    return this.localTracks.some(
      track => track.kind === "video"
    );
  },

  async turnMicrophoneOn(roomName) {
    await this.ensureConnected(roomName);

    if (this.hasAudioTrack()) {
      return;
    }

    const tracks =
      await LivekitClient.createLocalTracks({
        audio: true,
        video: false
      });

    for (const track of tracks) {
      await this.room.localParticipant
        .publishTrack(track);

      this.localTracks.push(track);
      this.attachLocalPreview(track);
    }

    console.log("Microphone turned on.");
  },

  turnMicrophoneOff() {
    const tracks =
      this.localTracks.filter(
        track => track.kind === "audio"
      );

    tracks.forEach(track => {
      try {
        this.room.localParticipant
          .unpublishTrack(track);
      } catch (error) {
        console.warn(error);
      }

      this.detachTrack(track);
      track.stop();
    });

    this.localTracks =
      this.localTracks.filter(
        track => track.kind !== "audio"
      );

    this.removeLocalAudioElements();

    console.log("Microphone turned off.");
  },

  async turnCameraOn(roomName) {
    await this.ensureConnected(roomName);

    if (this.hasVideoTrack()) {
      return;
    }

    const tracks =
      await LivekitClient.createLocalTracks({
        audio: false,
        video: true
      });

    for (const track of tracks) {
      await this.room.localParticipant
        .publishTrack(track);

      this.localTracks.push(track);
      this.attachLocalPreview(track);
    }

    console.log("Camera turned on.");
  },

  turnCameraOff() {
    const tracks =
      this.localTracks.filter(
        track => track.kind === "video"
      );

    tracks.forEach(track => {
      try {
        this.room.localParticipant
          .unpublishTrack(track);
      } catch (error) {
        console.warn(error);
      }

      this.detachTrack(track);
      track.stop();
    });

    this.localTracks =
      this.localTracks.filter(
        track => track.kind !== "video"
      );

    this.removeLocalVideoElements();

    console.log("Camera turned off.");
  },

  removeLocalAudioElements() {
    const elements =
      document.querySelectorAll(
        '[data-identity="local"]'
      );

    elements.forEach(element => {
      if (element.tagName === "AUDIO") {
        element.remove();
      }
    });
  },

  removeLocalVideoElements() {
    const elements =
      document.querySelectorAll(
        '[data-identity="local"]'
      );

    elements.forEach(element => {
      if (element.tagName === "VIDEO") {
        element.remove();
      }
    });
  },

  disconnect() {
    this.turnMicrophoneOff();
    this.turnCameraOff();

    if (this.room) {
      this.room.disconnect();
    }

    this.room = null;
    this.connected = false;

    this.removeParticipantMedia("local");

    document
      .querySelectorAll(".livekit-participant")
      .forEach(element => {
        element.remove();
      });

    console.log("Disconnected from LiveKit.");
  }
};

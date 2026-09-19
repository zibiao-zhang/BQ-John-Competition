window.LiveKitMedia = {
  room: null,
  localTracks: [],
  connected: false,
  participantIdentity: null,
  participantName: null,

  async connect(
    roomName,
    participantIdentity,
    participantName
  ) {
    if (!window.LivekitClient) {
      throw new Error("LiveKit SDK is not loaded.");
    }

    if (!window.LIVEKIT_CONFIG) {
      throw new Error("LiveKit configuration is missing.");
    }

    if (this.room && this.connected) {
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
        roomName: roomName,
        participantIdentity: participantIdentity,
        participantName: participantName
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
      track => {
        try {
          track.detach();
        } catch (error) {
          console.warn(error);
        }
      }
    );

    this.room.on(
      LivekitClient.RoomEvent.ParticipantDisconnected,
      participant => {
        const element =
          document.getElementById(
            "livekit-" + participant.identity
          );

        if (element) {
          element.remove();
        }
      }
    );

    await this.room.connect(
      tokenResult.serverUrl,
      tokenResult.participantToken
    );

    this.connected = true;
    this.participantIdentity =
      participantIdentity;
    this.participantName =
      participantName;

    console.log(
      "Connected to LiveKit room:",
      roomName,
      "as:",
      participantIdentity
    );

    return this.room;
  },

  async ensureConnected(
    roomName,
    participantIdentity,
    participantName
  ) {
    if (!this.connected || !this.room) {
      await this.connect(
        roomName,
        participantIdentity,
        participantName
      );
    }

    return this.room;
  },

  getMediaContainer() {
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
      return document.getElementById(
        "coachLivekitMediaContainer"
      );
    }

    if (
      studentScreen &&
      !studentScreen.classList.contains("hidden")
    ) {
      return document.getElementById(
        "studentLivekitMediaContainer"
      );
    }

    return null;
  },

  getParticipantBox(identity, name) {
    const container =
      this.getMediaContainer();

    if (!container) {
      return null;
    }

    let box =
      document.getElementById(
        "livekit-" + identity
      );

    if (!box) {
      box =
        document.createElement("div");

      box.id =
        "livekit-" + identity;

      box.className =
        "livekit-participant";

      const title =
        document.createElement("div");

      title.className =
        "livekit-participant-name";

      title.textContent =
        name || identity;

      box.appendChild(title);
      container.appendChild(box);
    }

    return box;
  },

  attachRemoteTrack(track, participant) {
    const box =
      this.getParticipantBox(
        participant.identity,
        participant.name
      );

    if (!box) {
      return;
    }

    const element =
      track.attach();

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
      element.controls = true;
    }

    box.appendChild(element);

    element.play().catch(() => {
      console.log(
        "Browser requires media click before playback."
      );
    });
  },

  attachLocalPreview(track) {
    const box =
      this.getParticipantBox(
        "local",
        "You"
      );

    if (!box) {
      return;
    }

    const element =
      track.attach();

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

    box.appendChild(element);
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

  async turnMicrophoneOn(
    roomName,
    participantIdentity,
    participantName
  ) {
    await this.ensureConnected(
      roomName,
      participantIdentity,
      participantName
    );

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
    const audioTracks =
      this.localTracks.filter(
        track => track.kind === "audio"
      );

    audioTracks.forEach(track => {
      try {
        this.room.localParticipant
          .unpublishTrack(track);
      } catch (error) {
        console.warn(error);
      }

      track.detach();
      track.stop();
    });

    this.localTracks =
      this.localTracks.filter(
        track => track.kind !== "audio"
      );

    console.log("Microphone turned off.");
  },

  async turnCameraOn(
    roomName,
    participantIdentity,
    participantName
  ) {
    await this.ensureConnected(
      roomName,
      participantIdentity,
      participantName
    );

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
    const videoTracks =
      this.localTracks.filter(
        track => track.kind === "video"
      );

    videoTracks.forEach(track => {
      try {
        this.room.localParticipant
          .unpublishTrack(track);
      } catch (error) {
        console.warn(error);
      }

      track.detach();
      track.stop();
    });

    this.localTracks =
      this.localTracks.filter(
        track => track.kind !== "video"
      );

    console.log("Camera turned off.");
  },

  disconnect() {
    this.turnMicrophoneOff();
    this.turnCameraOff();

    if (this.room) {
      this.room.disconnect();
    }

    this.room = null;
    this.connected = false;
    this.participantIdentity = null;
    this.participantName = null;

    console.log("Disconnected from LiveKit.");
  }
};

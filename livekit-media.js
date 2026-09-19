window.LiveKitMedia = {
  room: null,
  roomName: null,
  localTracks: [],
  connected: false,

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

    /*
      If currently connected to another room,
      disconnect before joining the new room.
    */
    if (
      this.connected &&
      this.room &&
      this.roomName === roomName
    ) {
      return this.room;
    }

    if (this.room) {
      this.disconnect();
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
        "LiveKit development token server is unavailable."
      );
    }

    /*
      Force a fresh token request.
      Each Coach and Student gets a unique identity.
    */
    const tokenResult =
      await tokenSource.fetch(
        {
          roomName: roomName,
          participantIdentity: participantIdentity,
          participantName: participantName
        },
        true
      );

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
          console.warn(
            "Could not detach remote track:",
            error
          );
        }
      }
    );

    this.room.on(
      LivekitClient.RoomEvent.ParticipantDisconnected,
      participant => {
        this.removeParticipant(
          participant.identity
        );
      }
    );

    await this.room.connect(
      tokenResult.serverUrl,
      tokenResult.participantToken
    );

    this.connected = true;
    this.roomName = roomName;

    console.log(
      "Connected to LiveKit room:",
      roomName,
      "Identity:",
      this.room.localParticipant.identity
    );

    /*
      Attach tracks from participants already
      in the room when we connected.
    */
    this.room.remoteParticipants.forEach(
      participant => {
        participant.trackPublications.forEach(
          publication => {
            if (publication.track) {
              this.attachRemoteTrack(
                publication.track,
                participant
              );
            }
          }
        );
      }
    );

    return this.room;
  },

  async ensureConnected(
    roomName,
    participantIdentity,
    participantName
  ) {
    if (
      !this.connected ||
      !this.room ||
      this.roomName !== roomName
    ) {
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
        "livekit-participant-" + identity
      );

    if (!box) {
      box =
        document.createElement("div");

      box.id =
        "livekit-participant-" + identity;

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

    element.dataset.livekitIdentity =
      participant.identity;

    element.dataset.livekitKind =
      track.kind;

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
        "Browser may require a user click to play remote media."
      );
    });
  },

  attachLocalPreview(track) {
    const box =
      this.getParticipantBox(
        "local-preview",
        "You"
      );

    if (!box) {
      return;
    }

    const element =
      track.attach();

    element.dataset.livekitIdentity =
      "local-preview";

    element.dataset.livekitKind =
      track.kind;

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
      element.controls = false;
    }

    box.appendChild(element);
  },

  removeParticipant(identity) {
    const box =
      document.getElementById(
        "livekit-participant-" + identity
      );

    if (box) {
      box.remove();
    }
  },

  removeLocalPreview(kind) {
    const elements =
      document.querySelectorAll(
        '[data-livekit-identity="local-preview"]'
      );

    elements.forEach(element => {
      if (
        !kind ||
        element.dataset.livekitKind === kind
      ) {
        element.remove();
      }
    });

    const localBox =
      document.getElementById(
        "livekit-participant-local-preview"
      );

    if (
      localBox &&
      localBox.querySelectorAll("video, audio").length === 0
    ) {
      localBox.remove();
    }
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
        console.warn(
          "Could not unpublish microphone:",
          error
        );
      }

      try {
        track.detach();
        track.stop();
      } catch (error) {
        console.warn(error);
      }
    });

    this.localTracks =
      this.localTracks.filter(
        track => track.kind !== "audio"
      );

    this.removeLocalPreview("audio");

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
        console.warn(
          "Could not unpublish camera:",
          error
        );
      }

      try {
        track.detach();
        track.stop();
      } catch (error) {
        console.warn(error);
      }
    });

    this.localTracks =
      this.localTracks.filter(
        track => track.kind !== "video"
      );

    this.removeLocalPreview("video");

    console.log("Camera turned off.");
  },

  disconnect() {
    this.turnMicrophoneOff();
    this.turnCameraOff();

    if (this.room) {
      this.room.disconnect();
    }

    this.room = null;
    this.roomName = null;
    this.connected = false;

    document
      .querySelectorAll(".livekit-participant")
      .forEach(element => {
        element.remove();
      });

    console.log("Disconnected from LiveKit.");
  }
};

window.LiveKitMedia = {
  room: null,
  roomName: null,
  localTracks: [],
  connected: false,
  connectingPromise: null,

  async connect(
    roomName,
    participantIdentity,
    participantName
  ) {
    if (
      this.room &&
      this.connected &&
      this.roomName === roomName
    ) {
      return this.room;
    }

    if (this.connectingPromise) {
      return this.connectingPromise;
    }

    this.connectingPromise =
      this.createConnection(
        roomName,
        participantIdentity,
        participantName
      );

    try {
      return await this.connectingPromise;
    } finally {
      this.connectingPromise = null;
    }
  },

  async createConnection(
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

    if (this.room) {
      this.disconnect();
    }

    let tokenSource;

    if (
      typeof LivekitClient.TokenSource
        .developmentTokenServer === "function"
    ) {
      tokenSource =
        LivekitClient.TokenSource
          .developmentTokenServer(
            window.LIVEKIT_CONFIG.tokenServerId
          );
    } else {
      tokenSource =
        LivekitClient.TokenSource
          .sandboxTokenServer(
            window.LIVEKIT_CONFIG.tokenServerId
          );
    }

    const tokenResult =
      await tokenSource.fetch({
        roomName: roomName,
        participantIdentity: participantIdentity,
        participantName: participantName
      });

    const room =
      new LivekitClient.Room({
        adaptiveStream: false,
        dynacast: false,
        autoSubscribe: true
      });

    room.on(
      LivekitClient.RoomEvent.TrackSubscribed,
      (track, publication, participant) => {
        this.attachRemoteTrack(
          track,
          participant
        );
      }
    );

    room.on(
      LivekitClient.RoomEvent.TrackUnsubscribed,
      track => {
        try {
          track.detach().forEach(element => {
            element.remove();
          });
        } catch (error) {
          console.warn(error);
        }
      }
    );

    room.on(
      LivekitClient.RoomEvent.ParticipantDisconnected,
      participant => {
        this.removeParticipant(
          participant.identity
        );
      }
    );

    room.on(
      LivekitClient.RoomEvent.Disconnected,
      () => {
        this.connected = false;
        console.log("LiveKit disconnected.");
      }
    );

    await room.connect(
      tokenResult.serverUrl,
      tokenResult.participantToken
    );

    this.room = room;
    this.roomName = roomName;
    this.connected = true;

    console.log(
      "LiveKit connected:",
      roomName,
      room.localParticipant.identity
    );

    this.renderExistingRemoteTracks();

    return room;
  },

  renderExistingRemoteTracks() {
    if (!this.room) {
      return;
    }

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

    const oldElement =
      box.querySelector(
        '[data-track-kind="' +
        track.kind +
        '"]'
      );

    if (oldElement) {
      oldElement.remove();
    }

    const element =
      track.attach();

    element.dataset.trackKind =
      track.kind;

    element.dataset.participantIdentity =
      participant.identity;

    if (track.kind === "video") {
      element.className =
        "livekit-video";

      /*
        Important for iPhone Safari:
        inline playback and muted video autoplay.
        Audio is received through a separate audio element.
      */
      element.autoplay = true;
      element.muted = true;
      element.playsInline = true;
      element.setAttribute("playsinline", "");
      element.setAttribute("webkit-playsinline", "");
    }

    if (track.kind === "audio") {
      element.className =
        "livekit-audio";

      element.autoplay = true;
      element.controls = true;
    }

    box.appendChild(element);

    requestAnimationFrame(() => {
      element.play().catch(error => {
        console.warn(
          "Remote media playback needs user interaction:",
          error
        );
      });
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

    const oldElement =
      box.querySelector(
        '[data-track-kind="' +
        track.kind +
        '"]'
      );

    if (oldElement) {
      oldElement.remove();
    }

    const element =
      track.attach();

    element.dataset.trackKind =
      track.kind;

    if (track.kind === "video") {
      element.className =
        "livekit-video";
      element.autoplay = true;
      element.muted = true;
      element.playsInline = true;
      element.setAttribute("playsinline", "");
    }

    if (track.kind === "audio") {
      element.className =
        "livekit-audio";
      element.autoplay = true;
      element.muted = true;
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
    await this.connect(
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

      track.detach();
      track.stop();
    });

    this.localTracks =
      this.localTracks.filter(
        track => track.kind !== "audio"
      );
  },

  async turnCameraOn(
    roomName,
    participantIdentity,
    participantName
  ) {
    await this.connect(
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

      track.detach();
      track.stop();
    });

    this.localTracks =
      this.localTracks.filter(
        track => track.kind !== "video"
      );
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
  }
};

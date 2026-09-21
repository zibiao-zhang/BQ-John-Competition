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
    /*
      Already connected to this exact room.
    */
    if (
      this.room &&
      this.connected &&
      this.roomName === roomName
    ) {
      return this.room;
    }

    /*
      A connection is already being created.
      Do not create another connection.
    */
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

    /*
      Close a previous room only if it is a different room.
    */
    if (this.room && this.roomName !== roomName) {
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
        "No compatible LiveKit token server was found."
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
        adaptiveStream: true,
        dynacast: true,
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
          track.detach();
        } catch (error) {
          console.warn("Could not detach track.", error);
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
        console.log("LiveKit room disconnected.");
        this.connected = false;
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
      "as",
      room.localParticipant.identity
    );

    /*
      Attach tracks that already existed before
      this user joined the room.
    */
    room.remoteParticipants.forEach(
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

    return room;
  },

  async ensureConnected(
    roomName,
    participantIdentity,
    participantName
  ) {
    return this.connect(
      roomName,
      participantIdentity,
      participantName
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

    /*
      Do not attach same kind twice.
    */
    const existing =
      box.querySelector(
        '[data-livekit-kind="' + track.kind + '"]'
      );

    if (existing) {
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
        "Remote media may require a click to play."
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

    const existing =
      box.querySelector(
        '[data-livekit-kind="' + track.kind + '"]'
      );

    if (existing) {
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

    const box =
      document.getElementById(
        "livekit-participant-local-preview"
      );

    if (
      box &&
      box.querySelectorAll("video, audio").length === 0
    ) {
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
        console.warn(error);
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
    this.connectingPromise = null;

    document
      .querySelectorAll(".livekit-participant")
      .forEach(element => {
        element.remove();
      });

    console.log("Disconnected from LiveKit.");
  }
};

window.LiveKitMedia = {
  room: null,
  roomName: null,
  localTracks: [],
  connected: false,
  connectingPromise: null,
  mediaContainer: null,

  safeId(identity) {
    return String(identity).replace(
      /[^a-zA-Z0-9_-]/g,
      "_"
    );
  },

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
      await this.disconnect();
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

    /*
      Force H.264 video for iPad / Safari compatibility.
    */
    const room =
      new LivekitClient.Room({
        adaptiveStream: false,
        dynacast: false,
        autoSubscribe: true,

        publishDefaults: {
          videoCodec: "h264",
          simulcast: false
        }
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
          const elements =
            track.detach();

          elements.forEach(element => {
            element.remove();
          });
        } catch (error) {
          console.warn(
            "Could not detach remote track:",
            error
          );
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
      "as:",
      room.localParticipant.identity
    );

    this.renderExistingRemoteTracks();

    return room;
  },

  setMediaContainer(container) {
    this.mediaContainer = container;
    this.renderExistingRemoteTracks();
  },

  renderExistingRemoteTracks() {
    if (!this.room || !this.mediaContainer) {
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

  getParticipantBox(identity, name) {
    if (!this.mediaContainer) {
      return null;
    }

    const boxId =
      "livekit-participant-" +
      this.safeId(identity);

    let box =
      document.getElementById(boxId);

    if (!box) {
      box =
        document.createElement("div");

      box.id = boxId;
      box.className = "livekit-participant";

      const title =
        document.createElement("div");

      title.className =
        "livekit-participant-name";

      title.textContent =
        name || identity;

      box.appendChild(title);
      this.mediaContainer.appendChild(box);
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

    const existing =
      box.querySelector(
        '[data-track-kind="' +
        track.kind +
        '"]'
      );

    if (existing) {
      existing.remove();
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

      element.autoplay = true;
      element.muted = true;
      element.playsInline = true;
      element.setAttribute(
        "playsinline",
        ""
      );

      element.setAttribute(
        "webkit-playsinline",
        ""
      );
    }

    if (track.kind === "audio") {
      element.className =
        "livekit-audio";

      element.autoplay = true;
      element.controls = true;
    }

    box.appendChild(element);

    requestAnimationFrame(() => {
      element.play().catch(() => {
        console.log(
          "Remote media may need Enable Remote Audio."
        );
      });
    });
  },

  attachLocalPreview(track) {
    /*
      Only show local CAMERA preview.
      Do not add local audio preview.
    */
    if (track.kind !== "video") {
      return;
    }

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
        '[data-track-kind="' +
        track.kind +
        '"]'
      );

    if (existing) {
      existing.remove();
    }

    const element =
      track.attach();

    element.dataset.trackKind =
      track.kind;

    element.dataset.participantIdentity =
      "local-preview";

    element.className =
      "livekit-video";

    element.autoplay = true;
    element.muted = true;
    element.playsInline = true;
    element.setAttribute(
      "playsinline",
      ""
    );

    box.appendChild(element);
  },

  removeParticipant(identity) {
    const box =
      document.getElementById(
        "livekit-participant-" +
        this.safeId(identity)
      );

    if (box) {
      box.remove();
    }
  },

  removeLocalPreview() {
    this.removeParticipant("local-preview");
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

  async startAudio() {
    if (
      this.room &&
      typeof this.room.startAudio === "function"
    ) {
      await this.room.startAudio();
    }

    document
      .querySelectorAll(".livekit-audio")
      .forEach(audio => {
        audio.play().catch(() => {});
      });
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
        .publishTrack(track, {
          source: LivekitClient.Track.Source.Microphone
        });

      this.localTracks.push(track);
    }

    console.log("Microphone turned on.");
  },

  async turnMicrophoneOff() {
    const audioTracks =
      this.localTracks.filter(
        track => track.kind === "audio"
      );

    for (const track of audioTracks) {
      try {
        await this.room.localParticipant
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
    }

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
      /*
        Force H.264 for iPad / Safari.
      */
      await this.room.localParticipant
        .publishTrack(track, {
          source: LivekitClient.Track.Source.Camera,
          videoCodec: "h264",
          simulcast: false
        });

      this.localTracks.push(track);
      this.attachLocalPreview(track);
    }

    console.log("Camera turned on with H264.");
  },

  async turnCameraOff() {
    const videoTracks =
      this.localTracks.filter(
        track => track.kind === "video"
      );

    for (const track of videoTracks) {
      try {
        await this.room.localParticipant
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
    }

    this.localTracks =
      this.localTracks.filter(
        track => track.kind !== "video"
      );

    this.removeLocalPreview();

    console.log("Camera turned off.");
  },

  async disconnect() {
    await this.turnMicrophoneOff();
    await this.turnCameraOff();

    if (this.room) {
      this.room.disconnect();
    }

    this.room = null;
    this.roomName = null;
    this.connected = false;
    this.connectingPromise = null;
    this.mediaContainer = null;

    document
      .querySelectorAll(".livekit-participant")
      .forEach(element => {
        element.remove();
      });

    console.log("Disconnected from LiveKit.");
  }
};

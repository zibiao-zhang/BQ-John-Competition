window.LiveKitMedia = {
  room: null,
  localTracks: [],
  connected: false,

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

    await this.room.connect(
      tokenResult.serverUrl,
      tokenResult.participantToken
    );

    this.connected = true;

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
      console.log("Microphone is already on.");
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
    }

    console.log("Microphone turned on.");
  },

  turnMicrophoneOff() {
    if (!this.room) {
      return;
    }

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

      track.stop();
      track.detach();
    });

    this.localTracks =
      this.localTracks.filter(
        track => track.kind !== "audio"
      );

    console.log("Microphone turned off.");
  },

  async turnCameraOn(roomName) {
    await this.ensureConnected(roomName);

    if (this.hasVideoTrack()) {
      console.log("Camera is already on.");
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
    }

    console.log("Camera turned on.");
  },

  turnCameraOff() {
    if (!this.room) {
      return;
    }

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

      track.stop();
      track.detach();
    });

    this.localTracks =
      this.localTracks.filter(
        track => track.kind !== "video"
      );

    console.log("Camera turned off.");
  },

  turnAllMediaOff() {
    this.turnMicrophoneOff();
    this.turnCameraOff();
  },

  disconnect() {
    this.turnAllMediaOff();

    if (this.room) {
      this.room.disconnect();
    }

    this.room = null;
    this.connected = false;

    console.log("Disconnected from LiveKit.");
  }
};

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

    const tokenSource =
      LivekitClient.TokenSource
        .developmentTokenServer(
          window.LIVEKIT_CONFIG.tokenServerId
        );

    const tokenResult =
      await tokenSource.fetch({
        roomName: roomName
      });

    this.room =
      new LivekitClient.Room({
        adaptiveStream: true,
        dynacast: true
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

  async enableMicrophone() {
    if (!this.room) {
      throw new Error("LiveKit room is not connected.");
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

    console.log("Microphone enabled.");
  },

  async enableCamera() {
    if (!this.room) {
      throw new Error("LiveKit room is not connected.");
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

    console.log("Camera enabled.");
  },

  disableMicrophone() {
    this.localTracks.forEach(track => {
      if (track.kind === "audio") {
        track.stop();
        track.detach();
      }
    });

    this.localTracks =
      this.localTracks.filter(
        track => track.kind !== "audio"
      );

    console.log("Microphone disabled.");
  },

  disableCamera() {
    this.localTracks.forEach(track => {
      if (track.kind === "video") {
        track.stop();
        track.detach();
      }
    });

    this.localTracks =
      this.localTracks.filter(
        track => track.kind !== "video"
      );

    console.log("Camera disabled.");
  },

  disconnect() {
    this.localTracks.forEach(track => {
      track.stop();
      track.detach();
    });

    this.localTracks = [];

    if (this.room) {
      this.room.disconnect();
    }

    this.room = null;
    this.connected = false;

    console.log("Disconnected from LiveKit.");
  }
};

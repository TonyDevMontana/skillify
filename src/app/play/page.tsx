import MuxPlayer from "@mux/mux-player-react";

function Page() {
  return (
    <div>
      <MuxPlayer
        playbackId="oquu6FHIHTZniPeLZeHNRI7xKRm1A0100zVbzILTGLUCw"
        accentColor="#ea580c"
        metadata={{
          videoTitle: "Test VOD",
          ViewerUserId: "user-id-007",
        }}
      />
    </div>
  );
}

export default Page;

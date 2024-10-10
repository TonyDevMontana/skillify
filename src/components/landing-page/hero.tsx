import { SparklesCore } from "@/components/ui/sparkles";
import { Spotlight } from "../ui/Spotlight";
import MagicButton from "../ui/magic-button";

export function Hero() {
  return (
    <div className="h-screen relative w-full flex items-center justify-center overflow-hidden rounded-md">
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      <Spotlight
        className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
        fill="white"
      />
      <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="orange" />
      <Spotlight className="h-[80vh] w-[50vw] top-10 left-full" fill="purple" />
      <div>
        <div className="flex justify-center relative z-10">
          <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center">
            <h2 className="uppercase tracking-widest text-xs text-center text-black dark:text-blue-100 max-w-80">
              Start upskilling yourself today
            </h2>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="text-center text-[40px] md:text-5xl lg:text-6xl uppercase mb-6 lg:max-w-5xl font-bold mt-4">
            Learn from the
            <span className="text-orange-500">
              {" "}
              world&#39;s best instructor
            </span>
          </div>
        </div>

        <div className="text-center md:tracking-wider mb-8">
          Only stop for enhancing your technical skills
        </div>
        <div className="flex justify-center">
          <MagicButton href="/browse" content="Explore Courses" />
        </div>
      </div>
    </div>
  );
}

import { SproutApp } from "@/components/SproutApp";
import { TweaksRoot } from "@/components/Tweaks";

export default function Home() {
  return (
    <div id="__sprout-root">
      <TweaksRoot>
        <SproutApp />
      </TweaksRoot>
    </div>
  );
}

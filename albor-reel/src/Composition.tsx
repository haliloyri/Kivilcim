import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";

const serif = loadSerif("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] }).fontFamily;
const sans = loadSans("normal", { weights: ["500", "600"], subsets: ["latin", "latin-ext"] }).fontFamily;

const C = {
  paper: "#F7F2EA",
  ink: "#1A1A1A",
  teal: "#1F5E57",
  deep: "#12302C",
  gold: "#F2C96B",
  rust: "#B5651D",
};

const useIn = (delay = 0, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

const Rise: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay = 0,
  children,
  style,
}) => {
  const p = useIn(delay);
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 40}px)`, ...style }}>{children}</div>
  );
};

const Scene: React.FC<{ bg: string; children: React.ReactNode; duration: number; first?: boolean; last?: boolean }> = ({
  bg,
  children,
  duration,
  first,
  last,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8, duration - 8, duration], [first ? 1 : 0, 1, 1, last ? 1 : 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ background: bg, opacity }}>
      {children}
    </AbsoluteFill>
  );
};

const Phone: React.FC<{ src: string; top?: number }> = ({ src, top = 600 }) => {
  const frame = useCurrentFrame();
  const p = useIn(6, 14);
  const float = Math.sin(frame / 18) * 8;
  return (
    <div
      style={{
        position: "absolute",
        left: 230,
        top: top + (1 - p) * 500 + float,
        width: 620,
        height: 1348,
        borderRadius: 70,
        overflow: "hidden",
        boxShadow: "0 40px 90px rgba(0,0,0,0.35)",
        border: "10px solid #0d0d0d",
        opacity: p,
      }}
    >
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
};

const Caption: React.FC<{ title: string; sub: string; dark?: boolean }> = ({ title, sub, dark }) => (
  <div style={{ position: "absolute", top: 250, left: 70, right: 70, textAlign: "center" }}>
    <Rise>
      <div style={{ fontFamily: serif, fontSize: 84, lineHeight: 1.1, color: dark ? "#fff" : C.deep }}>
        {title}
      </div>
    </Rise>
    <Rise delay={8}>
      <div
        style={{
          fontFamily: sans,
          fontWeight: 500,
          fontSize: 38,
          marginTop: 22,
          color: dark ? "rgba(255,255,255,0.75)" : C.rust,
        }}
      >
        {sub}
      </div>
    </Rise>
  </div>
);

const Hook: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
    <Rise>
      <div style={{ fontFamily: serif, fontSize: 118, lineHeight: 1.1, color: "#fff", textAlign: "center" }}>
        Okumaya vaktin yok mu?
      </div>
    </Rise>
    <Rise delay={30} style={{ marginTop: 50 }}>
      <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 48, color: C.gold, textAlign: "center" }}>
        Yüzlerce kitap. Tek bir hayat.
      </div>
    </Rise>
  </AbsoluteFill>
);

const Brand: React.FC = () => {
  const p = useIn(0, 12);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          width: 300,
          height: 300,
          borderRadius: 70,
          overflow: "hidden",
          transform: `scale(${0.6 + p * 0.4})`,
          opacity: p,
          boxShadow: "0 0 140px rgba(242,201,107,0.5)",
        }}
      >
        <Img
          src={staticFile("logo.png")}
          style={{ width: "125%", height: "125%", marginLeft: "-12.5%", marginTop: "-12.5%", maxWidth: "none" }}
        />
      </div>
      <Rise delay={14} style={{ marginTop: 60 }}>
        <div style={{ fontFamily: serif, fontSize: 130, color: "#fff" }}>Albor</div>
      </Rise>
      <Rise delay={24} style={{ marginTop: 20, padding: "0 90px" }}>
        <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 48, color: C.gold, textAlign: "center", lineHeight: 1.3 }}>
          Kitapların özü, günde 6 dakikada.
        </div>
      </Rise>
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const p = useIn(0, 12);
  const pulse = 1 + Math.sin(useCurrentFrame() / 6) * 0.025;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: 220, height: 220, borderRadius: 50, overflow: "hidden", transform: `scale(${p})`, marginBottom: 50 }}>
        <Img
          src={staticFile("logo.png")}
          style={{ width: "125%", height: "125%", marginLeft: "-12.5%", marginTop: "-12.5%", maxWidth: "none" }}
        />
      </div>
      <Rise delay={6}>
        <div style={{ fontFamily: serif, fontSize: 100, color: "#fff", textAlign: "center", lineHeight: 1.1, padding: "0 80px" }}>
          Her gün bir fikir yak.
        </div>
      </Rise>
      <Rise delay={18} style={{ marginTop: 60 }}>
        <div
          style={{
            fontFamily: sans,
            fontWeight: 600,
            fontSize: 50,
            padding: "30px 70px",
            borderRadius: 80,
            background: C.gold,
            color: C.deep,
            transform: `scale(${pulse})`,
          }}
        >
          Albor'u indir
        </div>
      </Rise>
    </AbsoluteFill>
  );
};

type S = { d: number; bg: string; node: React.ReactNode };

const scenes: S[] = [
  { d: 90, bg: C.deep, node: <Hook /> },
  { d: 120, bg: C.deep, node: <Brand /> },
  {
    d: 150,
    bg: C.paper,
    node: (
      <>
        <Caption title="Her gün seçilmiş fikirler" sub="Finans, psikoloji, liderlik ve daha fazlası" />
        <Phone src="04-discover.png" />
      </>
    ),
  },
  {
    d: 150,
    bg: C.paper,
    node: (
      <>
        <Caption title="Oku ya da dinle" sub="Karmaşık kitaplar, sade hikâyeler" />
        <Phone src="05-story.png" />
      </>
    ),
  },
  {
    d: 150,
    bg: C.paper,
    node: (
      <>
        <Caption title="Öğrendiğini hemen kullan" sub="Toplantıda, evde, sohbette: tek cümleyle" />
        <Phone src="07-use-in-conversation.png" />
      </>
    ),
  },
  {
    d: 150,
    bg: "#0F1B33",
    node: (
      <>
        <Caption dark title="Okudukça unvan kazan" sub="Kendi gelişim yolunu seç" />
        <Phone src="09-path.png" />
      </>
    ),
  },
  { d: 90, bg: C.teal, node: <Cta /> },
];

export const TOTAL_FRAMES = scenes.reduce((a, s) => a + s.d, 0);

export const MyComposition: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{ background: C.deep }}>
      {scenes.map((s, i) => {
        const el = (
          <Sequence key={i} from={from} durationInFrames={s.d} name={`Scene ${i + 1}`}>
            <Scene bg={s.bg} duration={s.d} first={i === 0} last={i === scenes.length - 1}>
              {s.node}
            </Scene>
          </Sequence>
        );
        from += s.d;
        return el;
      })}
    </AbsoluteFill>
  );
};

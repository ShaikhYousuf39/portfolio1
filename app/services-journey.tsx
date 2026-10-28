"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import s from "./services-journey.module.css";

const services = [
  { first: "Landing", second: "pages", description: "A clear story, thoughtful interactions, and a memorable first impression." },
  { first: "Business", second: "websites", description: "A distinctive digital home built around your brand and your customers." },
  { first: "Web", second: "applications", description: "Intuitive interfaces and dependable code. Big ideas, made useful." },
  { first: "API &", second: "integrations", description: "Connect your tools with secure APIs and seamless integrations." },
];

// A continuous, looping route behind the four services, from upper right to lower left.
const desktopPath = "M1590 25 C1320 45 1050 150 1090 255 C1130 345 1260 280 1170 200 C1060 100 820 300 620 430 C460 535 330 525 350 650 C370 780 570 785 620 680 C675 565 525 565 540 700 C555 850 1090 720 1240 895 C1360 1035 1130 1125 975 1090 C820 1055 970 930 1070 1050 C1200 1210 785 1350 590 1310 C400 1270 300 1400 420 1480 C540 1560 640 1380 475 1410 C320 1440 260 1575 20 1580";
const mobilePath = "M400 20 C320 35 90 70 110 175 C130 260 330 230 320 330 C305 440 65 420 70 545 C75 640 320 650 310 770 C300 890 70 850 85 990 C100 1110 325 1060 305 1200 C290 1330 65 1340 20 1450";

function Illustration({ index }: { index: number }) {
  return <svg viewBox="0 0 160 160" fill="none" aria-hidden="true" className={s.illustration}>
    <g stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      {index === 0 && <><rect x="22" y="32" width="116" height="94" rx="9" fill="white"/><path d="M22 54H138"/><path d="M33 43H35M44 43H46M55 43H57"/><rect x="34" y="68" width="52" height="11" rx="3" fill="var(--taupe)" stroke="none"/><path d="M34 90H69M34 100H59"/><g className={s.movingPart}><path d="M88 76L142 96L118 106L108 134Z" fill="var(--taupe)"/><path d="M118 106L135 127"/></g><path d="M14 17L20 23M66 14V22M148 57L155 53"/></>}
      {index === 1 && <><path d="M28 67H132V137H28Z" fill="white"/><path d="M20 37H140L149 67H11Z" fill="var(--taupe)"/><path d="M11 67V77C11 93 38 93 38 77C38 93 66 93 66 77C66 93 94 93 94 77C94 93 122 93 122 77C122 93 149 93 149 77V67" fill="white"/><path d="M41 37L38 67M67 37L66 67M93 37L94 67M119 37L122 67"/><path d="M42 105H68V137H42Z" fill="var(--taupe)"/><rect x="85" y="104" width="31" height="21" rx="2"/><g className={s.movingPart}><path d="M56 27V15H106V27"/><path d="M67 21H95"/></g></>}
      {index === 2 && <><rect x="15" y="30" width="130" height="96" rx="10" fill="white"/><path d="M15 53H145M29 42H31M40 42H42M51 42H53"/><g className={s.movingPart}><path d="M58 73L40 89L58 105M102 73L120 89L102 105M88 67L72 110" stroke="var(--brown)" strokeWidth="6"/></g><path d="M63 126L59 140H101L97 126M45 140H115"/><path d="M5 20L11 25M150 17L146 24"/></>}
      {index === 3 && <><path d="M20 145C-1 103 47 94 57 118C67 144 101 138 105 109" stroke="var(--taupe)" strokeWidth="10"/><g className={s.movingPart}><path d="M47 35L68 56L44 80C31 93 8 70 21 57Z" fill="white"/><path d="M52 40L68 24M63 51L79 35"/><path d="M97 66L120 89L96 113C81 128 57 103 73 88Z" fill="var(--taupe)"/><path d="M102 71L118 55M113 82L129 66"/></g><path d="M104 25L111 10M130 39L146 35M89 19V10"/><path d="M44 80L31 94M96 113L107 125"/></>}
    </g>
  </svg>;
}

export default function ServicesJourney() {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    let alive = true;
    let context: gsap.Context | undefined;
    let media: gsap.MatchMedia | undefined;
    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      if (!alive) return;
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          const timeline = gsap.timeline({ scrollTrigger: { trigger: `.${s.canvas}`, start: "top 70%", end: "bottom 70%", scrub: 1.2, invalidateOnRefresh: true } });
          gsap.utils.toArray<SVGPathElement>(`.${s.inkPath}`).forEach(path => {
            const length = path.getTotalLength();
            timeline.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1, ease: "none" }, 0);
          });
          gsap.utils.toArray<HTMLElement>(`.${s.serviceNode}`).forEach((node, index) => {
            const start = 0.05 + index * 0.25;
            timeline.from(node.querySelectorAll(`.${s.titleWord}`), { yPercent: 110, opacity: 0, duration: 0.12, stagger: 0.015, ease: "power3.out" }, start);
            timeline.fromTo(node.querySelector(`.${s.iconSlot}`), { width: "0em", scale: 0, opacity: 0, rotation: -20 }, { width: "1.85em", scale: 1, opacity: 1, rotation: 0, duration: 0.15, ease: "back.out(2.5)" }, start + 0.025);
            timeline.from(node.querySelector(`.${s.description}`), { scale: 0, opacity: 0, rotation: 8, duration: 0.15, ease: "back.out(2.5)" }, start + 0.05);
            const drawing = node.querySelector(`.${s.illustration}`);
            gsap.to(drawing, { y: -7, rotation: index % 2 ? 4 : -4, duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut", scrollTrigger: { trigger: node, start: "top bottom", end: "bottom top", toggleActions: "play pause resume pause" } });
            gsap.to(node.querySelector(`.${s.movingPart}`), { x: index === 3 ? -5 : 3, y: -4, duration: 1.1, repeat: -1, yoyo: true, ease: "sine.inOut", scrollTrigger: { trigger: node, start: "top bottom", end: "bottom top", toggleActions: "play pause resume pause" } });
          });
        });
      }, root);
      document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
    });
    return () => { alive = false; media?.revert(); context?.revert(); };
  }, []);

  return <section ref={root} className={s.services} id="services" aria-labelledby="services-title">
    <header className={s.header}><p>My services</p><h2 id="services-title">This is my<br/>thing.</h2></header>
    <div className={s.canvas}>
      <svg className={s.desktopLine} viewBox="0 0 1600 1600" fill="none" aria-hidden="true">
        <path d={desktopPath} className={s.guidePath}/><path d={desktopPath} className={s.inkPath}/>
        <ellipse cx="1585" cy="25" rx="10" ry="20" className={s.endpoint}/><ellipse cx="20" cy="1580" rx="10" ry="20" className={s.endpoint}/>
      </svg>
      <svg className={s.mobileLine} viewBox="0 0 390 1480" fill="none" preserveAspectRatio="none" aria-hidden="true"><path d={mobilePath} className={s.guidePath}/><path d={mobilePath} className={s.inkPath}/></svg>
      {services.map((service, index) => <article className={s.serviceNode} key={service.first}>
        <h3 aria-label={`${service.first} ${service.second}`}><span className={s.wordMask}><span className={s.titleWord}>{service.first}</span></span><span className={s.iconSlot}><Illustration index={index}/></span><span className={s.wordMask}><span className={s.titleWord}>{service.second}</span></span></h3>
        <a className={s.description} href={`mailto:hello@shaikhyousuf.dev?subject=${encodeURIComponent(`${service.first} ${service.second} inquiry`)}`} aria-label={`Discuss ${service.first} ${service.second}: ${service.description}`}>{service.description}<span aria-hidden="true">↗</span></a>
      </article>)}
    </div>
  </section>;
}

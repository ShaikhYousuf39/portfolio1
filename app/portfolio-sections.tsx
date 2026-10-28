"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import s from "./portfolio-sections.module.css";

const work = [
  { name: "Nook", category: "Creative tool · Chrome extension", year: "2026", description: "An inspiration archive for creatives to save, organize, and revisit references in a more immersive way.", style: "nook" },
  { name: "Remake Tools", category: "Web application · Creative stack", year: "2025", description: "A creative-stack web app that helps makers assemble, remix, and ship their toolkit.", style: "remake" },
  { name: "Balancé", category: "Mobile experience · Product design", year: "2025", description: "A mobile-first learning experience that helps dancers practice, track progress, and stay consistent.", style: "balance" },
];
const services = [
  ["Landing", "pages", "A clear story, thoughtful interactions, and a responsive experience that gives your next big idea a proper introduction.", "↗"],
  ["Business", "websites", "A distinctive digital home for your business. Built around your brand, your customers, and what they need to do next.", "✳"],
  ["Web", "applications", "Useful products with intuitive interfaces and dependable code. From an early idea to the details that make everyday use feel effortless.", "⌘"],
  ["API &", "integrations", "Connect the tools behind your business with secure APIs and thoughtful third-party integrations.", "↔"],
];
const process = [
  { title: "Good work starts with a good conversation.", label: "01 / Discover", text: "We talk about your goals, your audience, and what success looks like. Then we turn the big idea into a clear scope." },
  { title: "A little obsession with the details.", label: "02 / Design & build", text: "I bring the direction to life with thoughtful layouts, purposeful motion, and reliable code. You see the progress and help shape it." },
  { title: "Built to feel right. Ready for real life.", label: "03 / Refine & launch", text: "We review the experience across screen sizes, refine the interactions, and work through the final details before launch." },
];
const faqs = [
  ["What kind of projects do you take on?", "Landing pages, business websites, web applications, and API integrations. I enjoy projects where thoughtful design and useful functionality come together."],
  ["How much does a website cost?", "Every project has a different scope. Send me a little about your idea, the features you need, and your timeline, and we can work out a proposal."],
  ["Can you improve my existing website?", "Absolutely. We can look at what is working, what is holding it back, and whether a focused refresh or a larger rebuild makes sense."],
  ["Can we work together remotely?", "Yes. A clear brief, regular updates, and a shared feedback process make it possible to collaborate from different locations."],
  ["Will my website work on mobile?", "Yes. Responsive layouts and usable interactions on smaller screens are part of the build, from the beginning."],
  ["How involved do I need to be?", "Your knowledge of your business is essential. I will need your initial brief, content, and feedback at agreed milestones while I take care of the design and development."],
  ["How do we get started?", "Email me a short introduction to your project. Include your goals, any references, and your ideal timeline, and we can take it from there."],
];
const about = "I believe great websites need both imagination and intention. I’m Shaikh Yousuf, a developer turning ambitious ideas into thoughtful digital experiences. Built with care. Made to feel different.";

function Star({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="M50 0 57 32 78 9 69 39 100 35 73 51 96 73 65 65 65 98 50 72 32 100 35 67 4 78 26 53 0 39 33 40 22 9 44 32Z" fill="currentColor" /></svg>;
}

export default function PortfolioSections() {
  const root = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [selectedWork, setSelectedWork] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const workButtons = useRef<(HTMLButtonElement | null)[]>([]);

  useLayoutEffect(() => {
    let alive = true;
    let ctx: gsap.Context | undefined;
    let media: gsap.MatchMedia | undefined;
    const element = root.current;
    let refreshLayout = () => {};
    const onToggle = () => refreshLayout();
    element?.addEventListener("toggle", onToggle, true);
    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      if (!alive) return;
      gsap.registerPlugin(ScrollTrigger);
      refreshLayout = () => ScrollTrigger.refresh();
      ctx = gsap.context(() => {
        media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.fromTo(`.${s.word}`, { color: "#8d8379" }, { color: "#ffffff", stagger: 0.12, ease: "none", scrollTrigger: { trigger: `.${s.aboutText}`, start: "top 80%", end: "bottom 48%", scrub: 1 } });
          gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach(el => {
            gsap.from(el, { y: 65, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 93%", once: true } });
          });
          gsap.utils.toArray<HTMLElement>("[data-art]").forEach(el => {
            gsap.fromTo(el, { yPercent: -5, rotate: -2 }, { yPercent: 5, rotate: 2, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: 1 } });
          });
          gsap.to(`.${s.spin}`, { rotation: 360, duration: 24, repeat: -1, ease: "none" });
        });
      }, root);
      document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
    });
    return () => { alive = false; element?.removeEventListener("toggle", onToggle, true); media?.revert(); ctx?.revert(); };
  }, []);

  const openWork = (index: number) => { setSelectedWork(index); dialog.current?.showModal(); };

  return <div className={s.sections} ref={root}>
    <div className={s.ribbon} aria-label="Thoughtful code. Good looks included."><div aria-hidden="true">{Array.from({ length: 4 }, (_, i) => <span key={i}>THOUGHTFUL CODE <b>✳</b> GOOD LOOKS INCLUDED <b>✳</b> </span>)}</div></div>

    <section id="about" className={s.about}>
      <p className={s.eyebrow}>A little about me</p>
      <p className={s.aboutText} aria-label={about}>{about.split(" ").map((word, i) => <span aria-hidden="true" className={s.word} key={i}>{word} </span>)}</p>
      <div className={s.stickers} aria-hidden="true"><span>Logic meets imagination</span><span>Obsessed with the details</span><span>Made with intention</span></div>
      <div className={s.aboutBottom}><span>Independent developer.<br/>Personally invested.</span><Star className={s.spin}/><span>Design. Develop. Refine.<br/>Then a little more refining.</span></div>
    </section>

    <section id="projects" className={s.work}>
      <header className={s.sectionHeading} data-reveal><p className={s.eyebrow}>Featured projects / 2025—2026</p><h2>Selected<br/><span>works</span><sup>(03)</sup></h2><Star className={`${s.headingStar} ${s.spin}`}/></header>
      <div className={s.workGrid}>{work.map((project, i) => <article className={s.project} key={project.name} data-reveal>
        <button className={`${s.projectVisual} ${s[project.style]}`} onClick={() => openWork(i)} ref={el => { workButtons.current[i] = el; }} aria-label={`View ${project.name} project details`}>
          <span className={s.visualLabel}>SY® / DIGITAL EXPERIENCES</span>
          <div className={s.art} data-art>
            {i === 0 ? <><span className={s.nookWord}>nook<span>®</span></span><div className={s.archiveCard}><div>YOUR NEXT GREAT IDEA<br/>IS HIDING IN HERE.</div><div className={s.archiveTiles}><span>Form<br/>& feeling.</span><span>✳</span><span>Less,<br/>but better.</span></div><footer>A little space for a lot of inspiration. ↗</footer></div></> : i === 1 ? <><div className={s.remakeWord}>RE<br/>MAKE<span>TOOLS FOR<br/>THE WAY<br/>YOU CREATE.</span></div><div className={s.toolBar}><span>⌘</span><span>✳</span><span>↗</span><span>◎</span></div></> : <><span className={s.balanceWord}>balancé</span><div className={s.phone}><span>balancé <small>✳</small></span><h3>Find your<br/><em>rhythm.</em></h3><div className={s.dancer}>↝</div><div className={s.phoneBottom}>A little practice.<br/>A little progress.<b>Let’s move ↗</b></div></div><span className={s.balanceNote}>MAKE YOUR<br/>NEXT MOVE.</span></>}
          </div>
          <span className={s.viewCircle}>Explore ↗</span><span className={s.visualFoot}>0{i + 1} / {project.year}<span>DESIGN + DEVELOPMENT</span></span>
        </button>
        <div className={s.projectMeta}><h3>{project.name}</h3><span>{project.category}</span><span aria-hidden="true">↗</span></div>
      </article>)}</div>
      <div className={s.workEnd} data-reveal><Star className={s.spin}/><h3>YOUR NEXT BIG IDEA.<br/>MY NEXT GOOD CHALLENGE.</h3><a className={s.pill} href="mailto:hello@shaikhyousuf.dev">Let’s make something <span>↗</span></a></div>
    </section>

    <section id="services" className={s.services}>
      <header className={s.sectionHeading} data-reveal><p className={s.eyebrow}>What I can help with</p><h2>This is<br/>my thing<span className={s.period}>.</span></h2></header>
      <div>{services.map(([first, second, description, icon], i) => <details className={s.service} key={first} data-reveal>
        <summary><span className={s.serviceIndex}>0{i + 1}</span><h3>{first} <span>{second}</span></h3><span className={s.serviceIcon} aria-hidden="true">{icon}</span><span className={s.plus} aria-hidden="true">+</span></summary>
        <div className={s.serviceContent}><p>{description}</p><a href={`mailto:hello@shaikhyousuf.dev?subject=${encodeURIComponent(`${first} ${second} inquiry`)}`}>Let’s talk about your project ↗</a></div>
      </details>)}</div>
    </section>

    <section className={s.process}>
      <header className={s.sectionHeading} data-reveal><p className={s.eyebrow}>The working relationship</p><h2>Good things.<br/>Built together.</h2></header>
      <div className={s.processCard} data-reveal><span className={s.quoteMark} aria-hidden="true">“</span><div key={step} className={s.stepContent} aria-live="polite"><p className={s.eyebrow}>{process[step].label}</p><h3>{process[step].title}</h3><p>{process[step].text}</p></div><div className={s.processControls}><span>0{step + 1} / 03</span><div><button aria-label="Previous process step" onClick={() => setStep((step + 2) % 3)}>←</button><button aria-label="Next process step" onClick={() => setStep((step + 1) % 3)}>→</button></div></div><Star className={`${s.processStar} ${s.spin}`}/></div>
    </section>

    <section className={s.faq} id="faq"><header data-reveal><p className={s.eyebrow}>Frequently asked questions</p><h2>Things<br/>you might<br/><em>ask.</em></h2><div className={s.questionArt} aria-hidden="true">?<Star className={s.spin}/></div></header><div className={s.questions}>{faqs.map(([question, answer], i) => <details key={question} className={s.question} name="portfolio-faq" open={i === 0 ? true : undefined}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>

    <footer className={s.footer} id="contact"><p className={s.eyebrow} data-reveal>Enough scrolling. Let’s make something.</p><a className={s.bigContact} href="mailto:hello@shaikhyousuf.dev" data-reveal>LET’S TALK<span>↗</span></a><div className={s.footerGrid}><div><span>Have a project in mind?</span><a href="mailto:hello@shaikhyousuf.dev">hello@shaikhyousuf.dev ↗</a></div><nav aria-label="Footer navigation"><a href="#about">About me</a><a href="#projects">Selected work</a><a href="#services">Services</a></nav><p>Code with logic.<br/>Build with imagination.</p></div><div className={s.footerBottom}><span>© {new Date().getFullYear()} Shaikh Yousuf</span><span>Thoughtfully made, down to the last pixel.</span><a href="#home">Back to top ↑</a></div><div className={s.signature} aria-hidden="true">SHAIKH YOUSUF<Star/></div></footer>

    <dialog className={s.dialog} ref={dialog} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }} onClose={() => { if (selectedWork !== null) workButtons.current[selectedWork]?.focus(); }} aria-labelledby="project-dialog-title"><div className={s.dialogBody}><button className={s.dialogClose} onClick={() => dialog.current?.close()} aria-label="Close project details">×</button>{selectedWork !== null && <><p className={s.eyebrow}>Selected work / {work[selectedWork].year}</p><h2 id="project-dialog-title">{work[selectedWork].name}</h2><p>{work[selectedWork].description}</p><p className={s.dialogCategory}>{work[selectedWork].category}</p><a className={s.pill} href={`mailto:hello@shaikhyousuf.dev?subject=${encodeURIComponent(`Tell me about ${work[selectedWork].name}`)}`}>Ask about this project <span>↗</span></a></>}</div></dialog>
  </div>;
}

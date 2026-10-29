"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import s from "./portfolio-sections.module.css";
import ServicesJourney from "./services-journey";
import ContactSection from "./contact-section";

const work = [
  { name: "Flavora", category: "Recipe website · Food & cuisine", year: "2026", description: "A recipe discovery website celebrating food, culture, and the joy of cooking. Explore cuisines, discover trending dishes, and save recipes to return to later.", style: "flavora", url: "https://flavora-ashy.vercel.app/" },
  { name: "Remake Tools", category: "Web application · Creative stack", year: "2025", description: "A creative-stack web app that helps makers assemble, remix, and ship their toolkit.", style: "remake" },
  { name: "Balancé", category: "Mobile experience · Product design", year: "2025", description: "A mobile-first learning experience that helps dancers practice, track progress, and stay consistent.", style: "balance" },
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

function Orbit({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="2.5"><ellipse cx="50" cy="50" rx="44" ry="18" transform="rotate(-35 50 50)" /><ellipse cx="50" cy="50" rx="44" ry="18" transform="rotate(35 50 50)" /><circle cx="50" cy="50" r="8" fill="currentColor" stroke="none" /></g></svg>;
}

export default function PortfolioSections() {
  const root = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const processCard = useRef<HTMLDivElement>(null);
  const flip = useRef<gsap.core.Timeline | null>(null);

  const turningPage = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => () => { flip.current?.kill(); turningPage.current?.remove(); }, []);

  const switchStep = (direction: number) => {
    if (flip.current?.isActive()) return;
    const next = (step + direction + process.length) % process.length;
    if (!processCard.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(next);
      return;
    }
    setFlipping(true);
    const card = processCard.current;
    // Keep the outgoing sheet above the new content throughout the turn.
    const page = card.cloneNode(true) as HTMLDivElement;
    page.removeAttribute("data-reveal");
    page.setAttribute("aria-hidden", "true");
    page.inert = true;
    page.classList.add(s.turningPage);
    Object.assign(page.style, {
      position: "absolute", margin: "0", left: `${card.offsetLeft}px`,
      top: `${card.offsetTop}px`, width: `${card.offsetWidth}px`,
      height: `${card.offsetHeight}px`, transform: "none", opacity: "1",
    });
    page.querySelector(`.${s.processStar}`)?.remove();
    const corner = document.createElement("div");
    corner.className = s.pageFold;
    corner.style[direction > 0 ? "right" : "left"] = "0";
    if (direction < 0) corner.style.transform = "scaleX(-1)";
    page.appendChild(corner);
    card.parentElement?.appendChild(page);
    turningPage.current = page;
    setStep(next);
    gsap.set(page, { transformOrigin: direction > 0 ? "left top" : "right top", transformPerspective: 1600 });
    const foldSize = Math.min(card.offsetWidth * 0.24, 170);
    flip.current = gsap.timeline({
      onComplete: () => {
        page.remove();
        turningPage.current = null;
        gsap.set(card, { clearProps: "filter" });
        setFlipping(false);
      }
    })
      .set(card, { filter: "brightness(0.8)" })
      .to(corner, { width: foldSize, height: foldSize, duration: 0.28, ease: "power2.out" }, 0)
      .to(page, { rotation: direction * -1.2, rotationY: direction * -5, y: -5, boxShadow: "0 18px 35px #00000045", duration: 0.28, ease: "power2.out" }, 0)
      .to(page, { xPercent: direction * -22, y: -28, rotation: direction * -7, rotationY: direction * -22, opacity: 0, duration: 0.55, ease: "power2.inOut" }, 0.22)
      .to(corner, { width: foldSize * 1.6, height: foldSize * 1.6, duration: 0.5, ease: "power2.inOut" }, 0.22)
      .to(card, { filter: "brightness(1)", duration: 0.45, ease: "power2.out" }, 0.3);
  };
  const [selectedWork, setSelectedWork] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const workButtons = useRef<(HTMLButtonElement | null)[]>([]);

  useLayoutEffect(() => {
    let alive = true;
    let ctx: gsap.Context | undefined;
    let media: gsap.MatchMedia | undefined;
    const element = root.current;
    let refreshLayout = () => { };
    const onToggle = () => refreshLayout();
    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName === "height") refreshLayout();
    };
    element?.addEventListener("toggle", onToggle, true);
    element?.addEventListener("transitionend", onTransitionEnd);
    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      if (!alive) return;
      gsap.registerPlugin(ScrollTrigger);
      refreshLayout = () => ScrollTrigger.refresh();
      ctx = gsap.context(() => {
        media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          const story = gsap.timeline({ scrollTrigger: { trigger: `.${s.aboutStage}`, start: "top top", end: () => `+=${window.innerHeight * 1.8}`, pin: true, refreshPriority: 1, scrub: 0.65, invalidateOnRefresh: true } });
          story.fromTo(`.${s.word}`, { color: "#8d8379" }, { color: "#ffffff", duration: 0.35, stagger: 0.085, ease: "none" }, 0);
          gsap.utils.toArray<HTMLElement>(`.${s.stickers} span`).forEach((tag, i) => {
            story.fromTo(tag, { autoAlpha: 0, scale: 0.5, y: 40, rotation: i === 1 ? -14 : 14 }, { autoAlpha: 1, scale: 1, y: 0, rotation: i === 1 ? 7 : -6, duration: 0.45, ease: "back.out(1.7)" }, 0.65 + i * 0.85);
          });
          story.to({}, { duration: 0.4 });
          gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach(el => {
            gsap.from(el, { y: 65, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 93%", once: true } });
          });
          gsap.utils.toArray<HTMLElement>("[data-art]").forEach(el => {
            gsap.fromTo(el, { yPercent: -5, rotate: -2 }, { yPercent: 5, rotate: 2, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: 1 } });
          });
          gsap.utils.toArray<HTMLElement>(`.${s.spin}`).forEach(el => {
            gsap.fromTo(el, { rotation: -20 }, { rotation: 90, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.5 } });
          });
        });
      }, root);
      document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
    });
    return () => { alive = false; element?.removeEventListener("toggle", onToggle, true); element?.removeEventListener("transitionend", onTransitionEnd); media?.revert(); ctx?.revert(); };
  }, []);

  const openWork = (index: number) => { setSelectedWork(index); dialog.current?.showModal(); };

  return <div className={s.sections} ref={root}>
    <div className={s.straightRibbon} aria-label="Thoughtful code. Good looks included.">
      <div className={s.marqueeTrack} aria-hidden="true">
        {[0, 1].map(copy => <div className={s.marqueeGroup} key={copy}>{[0, 1].map(item => <span key={item}>THOUGHTFUL CODE <b>·</b> GOOD LOOKS INCLUDED <b>·</b></span>)}</div>)}
      </div>
    </div>
    <section id="about" className={s.about}>
      <div className={s.aboutStage}>
        <p className={s.eyebrow}>A little about me</p>
        <div className={s.aboutStory}>
          <p className={s.aboutText} aria-label={about}>{about.split(" ").map((word, i) => <span aria-hidden="true" className={s.word} key={i}>{word} </span>)}</p>
          <div className={s.stickers}><span>Professional overthinkers</span><span>Nerding out on design</span><span>Allergic to generic</span></div>
        </div>
        <div className={s.aboutBottom}><span>Independent developer.<br />Personally invested.</span><span className={s.scrollNote}>A little more scroll <span aria-hidden="true">↓</span></span><span>Design. Develop. Refine.<br />Then a little more refining.</span></div>
      </div>
    </section>

    <section id="projects" className={s.work}>
      <header className={s.sectionHeading} data-reveal><p className={s.eyebrow}>Featured projects / 2025—2026</p><h2>Selected<br /><span>works</span></h2><Orbit className={`${s.headingStar} ${s.spin}`} /></header>
      <div className={s.workGrid}>{work.map((project, i) => <article className={s.project} key={project.name} data-reveal>
        <button className={`${s.projectVisual} ${s[project.style]}`} onClick={() => openWork(i)} ref={el => { workButtons.current[i] = el; }} aria-label={`View ${project.name} project details`}>
          <span className={s.visualLabel}>SY® / DIGITAL EXPERIENCES</span>
          <div className={s.art} data-art>
            {i === 0 ? <div className={s.flavoraPreview}><div className={s.flavoraNav}><span>Flavora</span><small>Story · Recipes · Cuisine</small></div><div className={s.flavoraCover}><p>Discover the art of cooking</p><h3>A recipe is a story that ends with a good meal.</h3><span>Explore recipes ↗</span></div><div className={s.flavoraCaption}>Bringing the world’s flavors to your table.</div></div> : i === 1 ? <><div className={s.remakeWord}>RE<br />MAKE<span>TOOLS FOR<br />THE WAY<br />YOU CREATE.</span></div><div className={s.toolBar}><span>⌘</span><span>◎</span><span>↗</span><span>◎</span></div></> : <><span className={s.balanceWord}>balancé</span><div className={s.phone}><span>balancé <small>◎</small></span><h3>Find your<br /><em>rhythm.</em></h3><div className={s.dancer}>↝</div><div className={s.phoneBottom}>A little practice.<br />A little progress.<b>Let’s move ↗</b></div></div><span className={s.balanceNote}>MAKE YOUR<br />NEXT MOVE.</span></>}
          </div>
          <span className={s.viewCircle}>Explore ↗</span><span className={s.visualFoot}>0{i + 1} / {project.year}<span>DESIGN + DEVELOPMENT</span></span>
        </button>
        <div className={s.projectMeta}><h3>{project.name}</h3><span>{project.category}</span><span aria-hidden="true">↗</span></div>
      </article>)}</div>
      <div className={s.workEnd} data-reveal><Orbit className={s.spin} /><h3>YOUR NEXT BIG IDEA.<br />MY NEXT GOOD CHALLENGE.</h3><a className={s.pill} href="#contact">Let’s make something <span>↗</span></a></div>
    </section>

    <ServicesJourney />

    <section className={s.process}>
      <header className={s.sectionHeading} data-reveal><p className={s.eyebrow}>The working relationship</p><h2>Good things.<br />Built together.</h2></header>
      <div ref={processCard} className={s.processCard} data-reveal aria-busy={flipping}><span className={s.quoteMark} aria-hidden="true">“</span><div className={s.stepContent} aria-live="polite"><p className={s.eyebrow}>{process[step].label}</p><h3>{process[step].title}</h3><p>{process[step].text}</p></div><div className={s.processControls}><span>0{step + 1} / 03</span><div><button aria-label="Previous process step" disabled={flipping} onClick={() => switchStep(-1)}>←</button><button aria-label="Next process step" disabled={flipping} onClick={() => switchStep(1)}>→</button></div></div><Orbit className={`${s.processStar} ${s.spin}`} /></div>
    </section>

    <ContactSection />

    <section className={s.faq} id="faq"><header data-reveal><p className={s.eyebrow}>Frequently asked questions</p><h2>Things<br />you might<br /><em>ask.</em></h2><div className={s.questionArt} aria-hidden="true">?<Orbit className={s.spin} /></div></header><div className={s.questions}>{faqs.map(([question, answer], i) => <details key={question} className={s.question} name="portfolio-faq" open={i === 0 ? true : undefined}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>

    <footer className={s.footer}><p className={s.eyebrow} data-reveal>Enough scrolling. Let’s make something.</p><a className={s.bigContact} href="#contact" data-reveal>LET’S TALK<span>↗</span></a><div className={s.footerGrid}><div><span>Have a project in mind?</span><a href="mailto:hello@shaikhyousuf.dev">hello@shaikhyousuf.dev ↗</a></div><nav aria-label="Footer navigation"><a href="#about">About me</a><a href="#projects">Selected work</a><a href="#services">Services</a></nav><p>Code with logic.<br />Build with imagination.</p></div><div className={s.footerBottom}><span>© {new Date().getFullYear()} Shaikh Yousuf</span><span>Thoughtfully made, down to the last pixel.</span><a href="#home">Back to top ↑</a></div></footer>

    <dialog className={s.dialog} ref={dialog} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }} onClose={() => { if (selectedWork !== null) workButtons.current[selectedWork]?.focus(); }} aria-labelledby="project-dialog-title"><div className={s.dialogBody}><button className={s.dialogClose} onClick={() => dialog.current?.close()} aria-label="Close project details">×</button>{selectedWork !== null && <><p className={s.eyebrow}>Selected work / {work[selectedWork].year}</p><h2 id="project-dialog-title">{work[selectedWork].name}</h2><p>{work[selectedWork].description}</p><p className={s.dialogCategory}>{work[selectedWork].category}</p><a className={s.pill} href={work[selectedWork].url || `mailto:hello@shaikhyousuf.dev?subject=${encodeURIComponent(`Tell me about ${work[selectedWork].name}`)}`} target={work[selectedWork].url ? "_blank" : undefined} rel={work[selectedWork].url ? "noopener noreferrer" : undefined}>{work[selectedWork].url ? "Visit live website" : "Ask about this project"} <span>↗</span></a></>}</div></dialog>
  </div>;
}

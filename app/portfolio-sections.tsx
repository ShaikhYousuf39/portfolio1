"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import s from "./portfolio-sections.module.css";
import ServicesJourney from "./services-journey";
import ContactSection from "./contact-section";

const work = [
  { name: "Flavora", category: "Recipe website · Food & cuisine", year: "2026", description: "A recipe discovery website celebrating food, culture, and the joy of cooking. Explore cuisines, discover trending dishes, and save recipes to return to later.", style: "flavora", url: "https://flavora-ashy.vercel.app/" },
  { name: "Comforty", category: "Next.js · E-commerce website", year: "2025", description: "A Next.js e-commerce website for comfortable, stylish seating. Comforty brings a collection of chairs for home and office into a focused online shopping experience.", style: "comforty", url: "https://comforty-yousuf.vercel.app/" },
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
            {i === 0 ? <div className={s.flavoraComposition} aria-hidden="true"><div className={s.flavoraWord}>flavora<span>®</span></div><p className={s.flavoraTagline}>GOOD FOOD.<br/>GREAT STORIES.</p><div className={s.recipeSheet}><span className={s.recipeEdition}>THE RECIPE JOURNAL / 001</span><h3>A little spice.<br/><em>A lot of soul.</em></h3><div className={s.recipeRule}/><span className={s.recipeDish}>Chicken<br/>Biryani</span><div className={s.recipeMeta}><span>100 MIN</span><span>SERVES 4</span></div><div className={s.recipeFoot}>Made to be shared. <span>↗</span></div></div><div className={s.flavoraPlate}><div className={s.flavoraFood}/></div><div className={s.flavoraSeal}><span>FROM THE</span><svg viewBox="0 0 50 50" fill="none"><path d="M13 5V19Q13 26 20 26V45M20 5V26M27 5V19Q27 26 20 26M39 5C29 16 30 28 39 28V45M39 5V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg><span>HEART & KITCHEN</span></div><span className={s.flavoraScribble}>your next<br/>favorite meal ↗</span></div> : i === 1 ? <div className={s.comfortyComposition} aria-hidden="true"><div className={s.comfortyWord}>comforty<span>®</span></div><p className={s.comfortyHeadline}>A softer place<br/>to <em>land.</em></p><span className={s.comfortyOutline}>C</span><div className={s.comfortyStage}><span className={s.comfortyCollection}>THE SEATING EDIT</span><svg className={s.comfortyChair} viewBox="0 0 300 350" fill="none"><ellipse cx="156" cy="321" rx="103" ry="12" fill="#1c1a18" opacity=".12"/><path d="M88 228L66 315M211 228L234 315M112 225L123 306M194 225L182 306" stroke="#483b2e" strokeWidth="12" strokeLinecap="round"/><path d="M83 198L64 87Q58 42 101 33Q151 20 200 36Q229 44 229 80L217 201Z" fill="#483b2e"/><path d="M93 191L77 88Q73 54 105 47Q151 36 195 49Q216 55 216 84L204 194Z" fill="#8d8379"/><path d="M91 87Q151 70 205 87M95 123Q151 110 208 124M102 159Q153 148 205 160" stroke="#ffffff" strokeOpacity=".16" strokeWidth="2"/><path d="M57 181Q150 161 243 185L232 225Q156 255 69 226Z" fill="#483b2e"/><path d="M61 176Q151 154 240 178Q257 184 244 200Q155 226 63 203Q43 193 61 176Z" fill="#b0a497"/><path d="M55 177L44 139Q40 124 55 123L92 137M244 176L255 139Q259 125 244 125L211 137" stroke="#483b2e" strokeWidth="14" strokeLinecap="round"/><path d="M54 127L89 139M246 129L215 140" stroke="#8d8379" strokeWidth="10" strokeLinecap="round"/><path d="M76 190Q152 207 227 189" stroke="white" strokeOpacity=".25" strokeWidth="2"/></svg><div className={s.comfortyStageFoot}><span>FORM MEETS FEELING</span><span>01 / 03</span></div></div><div className={s.comfortyTag}><span>CONSIDERED COMFORT</span><strong>Take a seat.</strong><div><i/><i/><i/><b>↗</b></div></div><div className={s.comfortyNote}>Good design.<br/>Every day.</div></div> : <><span className={s.balanceWord}>balancé</span><div className={s.phone}><span>balancé <small>◎</small></span><h3>Find your<br /><em>rhythm.</em></h3><div className={s.dancer}>↝</div><div className={s.phoneBottom}>A little practice.<br />A little progress.<b>Let’s move ↗</b></div></div><span className={s.balanceNote}>MAKE YOUR<br />NEXT MOVE.</span></>}
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

"use client";

import Image from "next/image";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import styles from "./page.module.css";
import PortfolioSections from "./portfolio-sections";

const name = "Shaikh Yousuf";

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Me" },
  { id: "projects", label: "Projects" },
  { id: "services", label: "Services" },
];

const scrollToCurrentHash = () => {
  const targetId = window.location.hash.slice(1);
  const target = targetId ? document.getElementById(targetId) : null;

  if (!target) return;

  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;

  root.style.scrollBehavior = "auto";
  target.scrollIntoView({ block: "start" });
  root.style.scrollBehavior = previousScrollBehavior;
};

export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const cursor = cursorRef.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    if (!cursor || !finePointer.matches) return;

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    const moveX = gsap.quickTo(cursor, "x", {
      duration: 0.18,
      ease: "power3.out",
    });
    const moveY = gsap.quickTo(cursor, "y", {
      duration: 0.18,
      ease: "power3.out",
    });

    const handlePointerMove = (event: PointerEvent) => {
      moveX(event.clientX);
      moveY(event.clientY);
      cursor.dataset.visible = "true";
    };

    const handlePointerOver = (event: PointerEvent) => {
      const target = event.target;

      cursor.dataset.active =
        target instanceof Element &&
        Boolean(target.closest("a, button, [role='button']"))
          ? "true"
          : "false";
    };

    const handlePointerLeave = () => {
      cursor.dataset.visible = "false";
      cursor.dataset.active = "false";
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerover", handlePointerOver);
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerOver);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, []);

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.id);

    const syncWithHash = () => {
      const hash = window.location.hash.slice(1);
      if (sectionIds.includes(hash)) setActiveSection(hash);
    };

    syncWithHash();
    window.addEventListener("hashchange", syncWithHash);

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection) setActiveSection(visibleSection.target.id);
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 0.15, 0.5],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener("hashchange", syncWithHash);
      observer.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    const page = pageRef.current;
    const loader = loaderRef.current;
    const content = contentRef.current;

    if (!page || !loader || !content) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      gsap.set(loader, { display: "none" });
      requestAnimationFrame(scrollToCurrentHash);
      return;
    }

    document.body.classList.add("is-loading");

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          document.body.classList.remove("is-loading");
          gsap.set(loader, { display: "none" });
          gsap.set(content, { clearProps: "opacity,visibility" });
          requestAnimationFrame(scrollToCurrentHash);
        },
      });

      gsap.set(content, { autoAlpha: 0 });

      timeline
        .from(`.${styles.loaderLetter}`, {
          yPercent: 120,
          duration: 0.8,
          stagger: 0.035,
          ease: "power4.out",
        })
        .from(
          `.${styles.loaderMeta}`,
          { autoAlpha: 0, y: 10, duration: 0.45 },
          "-=0.35",
        )
        .to(
          `.${styles.loaderLetter}`,
          {
            yPercent: -120,
            duration: 0.55,
            stagger: 0.025,
            ease: "power3.in",
          },
          "+=0.55",
        )
        .to(
          `.${styles.loaderMeta}`,
          { autoAlpha: 0, y: -8, duration: 0.35, ease: "power2.in" },
          "-=0.45",
        )
        .to(loader, {
          yPercent: -100,
          duration: 1.05,
          ease: "power4.inOut",
        })
        .to(
          content,
          { autoAlpha: 1, duration: 0.75, ease: "power3.out" },
          "-=0.62",
        )
        .from(
          `.${styles.heroReveal}`,
          {
            autoAlpha: 0,
            y: 34,
            duration: 0.75,
            stagger: 0.09,
            ease: "power3.out",
          },
          "-=0.5",
        );
    }, page);

    return () => {
      context.revert();
      document.body.classList.remove("is-loading");
    };
  }, []);

  return (
    <div ref={pageRef} className={styles.page}>
      <div ref={cursorRef} className={styles.cursor} aria-hidden="true" />

      <div ref={loaderRef} className={styles.loader} role="status">
        <div className={styles.loaderInner}>
          <p className={styles.loaderName} aria-label={name}>
            {name.split("").map((letter, index) => (
              <span
                className={`${styles.loaderLetterMask} ${
                  index > 5 ? styles.loaderLetterMuted : ""
                }`}
                aria-hidden="true"
                key={`${letter}-${index}`}
              >
                <span className={styles.loaderLetter}>
                  {letter === " " ? "\u00a0" : letter}
                </span>
              </span>
            ))}
          </p>
          <p className={styles.loaderMeta}>Web developer · Portfolio 2026</p>
        </div>
      </div>

      <div ref={contentRef} className={styles.siteContent}>
        <main>
          <div className={styles.scrollStage}>
            <div className={styles.heroPanel}>
              <header className={`${styles.navbar} ${styles.heroReveal}`}>
          <a className={styles.brand} href="#home" aria-label="Shaikh Yousuf, home">
            Shaikh Yousuf
          </a>

          <nav className={styles.navLinks} aria-label="Main navigation">
            {navItems.map((item) => (
              <a
                className={activeSection === item.id ? styles.activeLink : undefined}
                href={`#${item.id}`}
                aria-current={activeSection === item.id ? "page" : undefined}
                onClick={() => setActiveSection(item.id)}
                key={item.id}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a className={styles.contactButton} href="mailto:hello@shaikhyousuf.dev">
            <span>Contact</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m19 6v12c0 .55273-.44775 1-1 1s-1-.44727-1-1v-9.58545l-10.18311 10.18311c-.19531.19531-.45117.29297-.70703.29297s-.51172-.09766-.70703-.29297c-.39062-.39062-.39062-1.02344 0-1.41406l10.1836-10.1836h-9.58643c-.55225 0-1-.44727-1-1s.44775-1 1-1h12c.55225 0 1 .44727 1 1z" />
            </svg>
          </a>
              </header>

              <section className={styles.hero} id="home">
            <h1 className={`${styles.developerTitle} ${styles.heroReveal}`}>
              Developer
            </h1>

            <div className={`${styles.portrait} ${styles.heroReveal}`}>
              <Image
                src="/man.png"
                alt="Portrait of Shaikh Yousuf"
                width={1605}
                height={2400}
                sizes="(max-width: 700px) 112vw, 63vh"
                preload
              />
            </div>

            <h2 className={`${styles.heroStatement} ${styles.heroReveal}`}>
              Code with logic.
              <br />
              Build with imagination.
            </h2>

            <div className={`${styles.heroDetails} ${styles.heroReveal}`}>
              <p>
                Great development is more than writing code – it&apos;s about
                turning complex ideas into simple, reliable, and meaningful
                digital experiences that people genuinely enjoy using.
              </p>

              <dl className={styles.stats}>
                <div>
                  <dt>30+</dt>
                  <dd>Projects Completed</dd>
                </div>
                <div>
                  <dt>2+</dt>
                  <dd>Years Of Experience</dd>
                </div>
              </dl>
            </div>

              </section>
            </div>

            <PortfolioSections />
          </div>
        </main>
      </div>
    </div>
  );
}

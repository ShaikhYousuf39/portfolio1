"use client";

import Image from "next/image";
import {
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import styles from "./page.module.css";

const name = "Shaikh Yousuf";

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Me" },
  { id: "case-studies", label: "Case Studies" },
  { id: "services", label: "Services" },
];

export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollStageRef = useRef<HTMLDivElement>(null);
  const heroPanelRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState("home");

  const handleNavClick = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    setActiveSection(sectionId);

    if (sectionId !== "home" && sectionId !== "about") return;

    const stage = scrollStageRef.current;
    if (!stage) return;

    event.preventDefault();

    const stageTop = stage.getBoundingClientRect().top + window.scrollY;
    const targetScroll =
      sectionId === "about" ? stageTop + window.innerHeight : stageTop;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.history.replaceState(null, "", `#${sectionId}`);
    window.scrollTo({
      top: targetScroll,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.id);

    const syncWithHash = () => {
      const hash = window.location.hash.slice(1);
      if (sectionIds.includes(hash)) setActiveSection(hash);
    };

    syncWithHash();
    window.addEventListener("hashchange", syncWithHash);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const observedSectionIds = reduceMotion
      ? sectionIds
      : sectionIds.filter((id) => id !== "home" && id !== "about");

    const sections = observedSectionIds
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
      return;
    }

    document.body.classList.add("is-loading");

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          document.body.classList.remove("is-loading");
          gsap.set(loader, { display: "none" });
        },
      });

      gsap.set(content, { autoAlpha: 0, y: 36 });

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
          { autoAlpha: 1, y: 0, duration: 0.75, ease: "power3.out" },
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

  useLayoutEffect(() => {
    const page = pageRef.current;
    const scrollStage = scrollStageRef.current;
    const heroPanel = heroPanelRef.current;
    const about = aboutRef.current;

    if (!page || !scrollStage || !heroPanel || !about) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let scrollContext: gsap.Context | undefined;
    let isMounted = true;

    const setupScrollAnimation = async () => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      if (!isMounted) return;

      gsap.registerPlugin(ScrollTrigger);

      scrollContext = gsap.context(() => {
        const aboutElements = gsap.utils.toArray<HTMLElement>(
          `.${styles.aboutReveal}`,
        );

        gsap.set(aboutElements, {
          autoAlpha: 0,
          y: 38,
        });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: scrollStage,
              start: "top top",
              end: () => `+=${window.innerHeight}`,
              pin: true,
              scrub: 0.9,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const currentSection = self.progress > 0.55 ? "about" : "home";
                setActiveSection((previous) =>
                  previous === currentSection ? previous : currentSection,
                );
              },
            },
          })
          .to(heroPanel, {
            yPercent: -100,
            duration: 1,
            ease: "none",
          })
          .to(
            aboutElements,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.32,
              stagger: 0.025,
              ease: "power2.out",
            },
            0.52,
          );

        ScrollTrigger.refresh();
      }, page);
    };

    void setupScrollAnimation();

    return () => {
      isMounted = false;
      scrollContext?.revert();
    };
  }, []);

  return (
    <div ref={pageRef} className={styles.page}>
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
          <div ref={scrollStageRef} className={styles.scrollStage}>
            <div ref={heroPanelRef} className={styles.heroPanel}>
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
                onClick={(event) => handleNavClick(event, item.id)}
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

            <section ref={aboutRef} className={styles.about} id="about">
            <div className={`${styles.aboutTopline} ${styles.aboutReveal}`}>
              <p>(01) About me</p>
              <p>Developer · Designer · Problem solver</p>
            </div>

            <div className={styles.aboutGrid}>
              <h2 className={`${styles.aboutTitle} ${styles.aboutReveal}`}>
                Ideas deserve
                <br />
                <span>more than just</span>
                <br />
                working code.
              </h2>

              <div className={`${styles.aboutCopy} ${styles.aboutReveal}`}>
                <p>
                  I&apos;m Shaikh Yousuf, a web developer who enjoys turning
                  ambitious ideas into clear, fast, and thoughtful digital
                  experiences.
                </p>
                <p>
                  My work sits between design and engineering—where strong
                  visuals, useful interaction, and dependable code meet.
                </p>

                <div className={styles.aboutActions}>
                  <a className={styles.resumeButton} href="/resume.pdf" download>
                    <span>Download resume</span>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 4v12m-5-5 5 5 5-5M5 20h14" />
                    </svg>
                  </a>
                  <a
                    className={styles.connectButton}
                    href="mailto:hello@shaikhyousuf.dev"
                  >
                    <span>Let&apos;s connect</span>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 19 19 5M8 5h11v11" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className={`${styles.aboutFooter} ${styles.aboutReveal}`}>
              <span>Design</span>
              <span>Development</span>
              <span>Interaction</span>
            </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

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

const name = "Shaikh Yousuf";

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Me" },
  { id: "projects", label: "Projects" },
  { id: "services", label: "Services" },
];

const projects = [
  {
    title: "Nook",
    year: "2026",
    description:
      "An inspiration archive for creatives to save, organize, and revisit references in a more immersive way.",
    tags: ["Creative Tool", "Chrome Extension"],
    themeClass: styles.projectLime,
  },
  {
    title: "Remake Tools",
    year: "2025",
    description:
      "A creative-stack web app that helps makers assemble, remix, and ship their toolkit.",
    tags: ["Web App", "Creative Stack"],
    themeClass: styles.projectViolet,
  },
  {
    title: "Balanc\u00e9",
    year: "2025",
    description:
      "A mobile-first learning experience that helps dancers practice, track progress, and stay consistent.",
    tags: ["Mobile App", "Product Design"],
    themeClass: styles.projectRose,
  },
];

const services = [
  {
    title: "Landing Pages",
    description: "High-converting, modern, and responsive landing experiences.",
    visualClass: styles.serviceVisualLanding,
  },
  {
    title: "Business Websites",
    description: "Professional websites built for brands and growing businesses.",
    visualClass: styles.serviceVisualBusiness,
  },
  {
    title: "Web Applications",
    description: "Full-featured, scalable, and thoughtfully engineered web apps.",
    visualClass: styles.serviceVisualApplications,
  },
  {
    title: "API & Integrations",
    description: "Secure APIs and seamless third-party service integrations.",
    visualClass: styles.serviceVisualApi,
  },
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
  const aboutRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const projectsViewportRef = useRef<HTMLDivElement>(null);
  const projectsTrackRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
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

  useLayoutEffect(() => {
    const page = pageRef.current;
    const about = aboutRef.current;

    if (!page || !about) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let scrollContext: gsap.Context | undefined;
    let isMounted = true;

    const setupScrollAnimation = async () => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      if (!isMounted) return;

      gsap.registerPlugin(ScrollTrigger);

      scrollContext = gsap.context(() => {
        gsap.from(`.${styles.aboutReveal}`, {
          autoAlpha: 0,
          y: 28,
          duration: 0.72,
          stagger: 0.075,
          ease: "power3.out",
          scrollTrigger: {
            trigger: about,
            start: "top 78%",
            once: true,
          },
        });
      }, page);
    };

    void setupScrollAnimation();

    return () => {
      isMounted = false;
      scrollContext?.revert();
    };
  }, []);

  useLayoutEffect(() => {
    const page = pageRef.current;
    const projectsSection = projectsRef.current;
    const viewport = projectsViewportRef.current;
    const track = projectsTrackRef.current;

    if (!page || !projectsSection || !viewport || !track) return;

    let projectContext: gsap.Context | undefined;
    let mediaContext: ReturnType<typeof gsap.matchMedia> | undefined;
    let isMounted = true;

    const setupProjectsScroll = async () => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      if (!isMounted) return;

      gsap.registerPlugin(ScrollTrigger);
      mediaContext = gsap.matchMedia();

      projectContext = gsap.context(() => {
        mediaContext?.add(
          "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
          () => {
            const getScrollDistance = () =>
              Math.max(0, track.scrollWidth - viewport.clientWidth);

            const syncSectionHeight = () => {
              projectsSection.style.setProperty(
                "--projects-scroll-distance",
                `${getScrollDistance()}px`,
              );
            };

            syncSectionHeight();

            const movement = gsap.to(track, {
              x: () => -getScrollDistance(),
              ease: "none",
              scrollTrigger: {
                trigger: projectsSection,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.65,
                invalidateOnRefresh: true,
                onRefreshInit: syncSectionHeight,
              },
            });

            return () => {
              movement.scrollTrigger?.kill();
              projectsSection.style.removeProperty(
                "--projects-scroll-distance",
              );
            };
          },
        );
      }, page);

      document.fonts.ready.then(() => {
        if (isMounted) ScrollTrigger.refresh();
      });
    };

    void setupProjectsScroll();

    return () => {
      isMounted = false;
      mediaContext?.revert();
      projectContext?.revert();
    };
  }, []);

  useLayoutEffect(() => {
    const page = pageRef.current;
    const servicesSection = servicesRef.current;

    if (!page || !servicesSection) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let servicesContext: gsap.Context | undefined;
    let isMounted = true;

    const setupServicesReveal = async () => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      if (!isMounted) return;

      gsap.registerPlugin(ScrollTrigger);
      servicesContext = gsap.context(() => {
        gsap.from(`.${styles.serviceReveal}`, {
          autoAlpha: 0,
          y: 34,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: servicesSection,
            start: "top 72%",
            once: true,
          },
        });
      }, page);
    };

    void setupServicesReveal();

    return () => {
      isMounted = false;
      servicesContext?.revert();
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

            <section ref={aboutRef} className={styles.about} id="about">
            <div className={`${styles.aboutTopline} ${styles.aboutReveal}`}>
              <span aria-hidden="true" />
              <p>About me</p>
              <i aria-hidden="true" />
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

            <section
              ref={projectsRef}
              className={styles.projects}
              id="projects"
            >
              <div className={styles.projectsShell}>
                <div className={styles.projectsIntro}>
                  <p className={styles.projectsEyebrow}>
                    <span aria-hidden="true" /> Since 2024
                  </p>
                  <h2>Selected projects</h2>
                  <p className={styles.projectsDescription}>
                    A collection of digital products shaped by curiosity,
                    thoughtful design, and reliable code.
                  </p>
                  <p className={styles.projectsScrollHint}>
                    Scroll <span aria-hidden="true">→</span>
                  </p>
                </div>

                <div
                  ref={projectsViewportRef}
                  className={styles.projectsViewport}
                >
                  <div ref={projectsTrackRef} className={styles.projectsTrack}>
                    {projects.map((project, index) => (
                      <article className={styles.projectCard} key={project.title}>
                        <div
                          className={`${styles.projectVisual} ${project.themeClass}`}
                          aria-hidden="true"
                        >
                          <div className={styles.mockWindow}>
                            <div className={styles.mockToolbar}>
                              <div className={styles.mockLogo}>SY</div>
                              <div className={styles.mockToolbarLinks}>
                                <span />
                                <span />
                                <span />
                              </div>
                              <div className={styles.mockToolbarButton} />
                            </div>
                            <div className={styles.mockBody}>
                              <div className={styles.mockSidebar}>
                                <strong />
                                <span />
                                <span />
                                <span />
                                <span />
                              </div>
                              <div className={styles.mockContent}>
                                <div className={styles.mockHeading}>
                                  <span />
                                  <i />
                                </div>
                                <div className={styles.mockTiles}>
                                  {Array.from({ length: 8 }).map((_, tileIndex) => (
                                    <span key={tileIndex} />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <span className={styles.projectNumber}>
                            0{index + 1}
                          </span>
                        </div>

                        <div className={styles.projectInfo}>
                          <div className={styles.projectHeadingRow}>
                            <h3>{project.title}</h3>
                            <span>{project.year}</span>
                          </div>
                          <p>{project.description}</p>
                          <ul className={styles.projectTags} aria-label="Project tags">
                            {project.tags.map((tag) => (
                              <li key={tag}>{tag}</li>
                            ))}
                          </ul>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section
              ref={servicesRef}
              className={styles.services}
              id="services"
            >
              <div className={`${styles.servicesHeader} ${styles.serviceReveal}`}>
                <div className={styles.servicesLabel}>
                  <span aria-hidden="true" />
                  <p>Services</p>
                  <i aria-hidden="true" />
                </div>

                <div className={styles.servicesHeadingRow}>
                  <h2>
                    What I <span>Do.</span>
                  </h2>
                  <p>
                    I help businesses and individuals turn clear ideas into
                    fast, modern, and scalable digital products.
                  </p>
                </div>
              </div>

              <div className={styles.servicesGrid}>
                {services.map((service, index) => (
                  <article
                    className={`${styles.serviceCard} ${styles.serviceReveal}`}
                    key={service.title}
                  >
                    <div
                      className={`${styles.serviceVisual} ${service.visualClass}`}
                      aria-hidden="true"
                    />

                    <span className={styles.serviceNumber}>0{index + 1}</span>

                    <div className={styles.serviceBody}>
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                    </div>

                    <a
                      className={styles.serviceLink}
                      href={`mailto:hello@shaikhyousuf.dev?subject=${encodeURIComponent(
                        `${service.title} project inquiry`,
                      )}`}
                    >
                      <span>View details</span>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M5 19 19 5M8 5h11v11" />
                      </svg>
                    </a>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

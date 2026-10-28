"use client";

import { useState, type FormEvent } from "react";
import s from "./contact-section.module.css";

const options = ["Landing page", "Business website", "Web application", "Something else"];

export default function ContactSection() {
  const [project, setProject] = useState(options[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [brief, setBrief] = useState("");
  const [status, setStatus] = useState("");
  const message = `Hi Yousuf,\n\nI'm ${name.trim() || "…"} and I'm looking for help with ${project === "Something else" ? "a new idea" : `a ${project.toLowerCase()}`}.\n\n${brief.trim() || "Here’s what I have in mind…"}\n\nYou can reach me at ${email.trim() || "…"}.\n\nLet's make something good.`;

  function compose(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.location.href = `mailto:hello@shaikhyousuf.dev?subject=${encodeURIComponent(`${project} — ${name.trim()}`)}&body=${encodeURIComponent(message)}`;
    setStatus("Your email app will open with this draft. Review it there and send when you’re ready.");
  }

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(message);
      setStatus("Brief copied. You can paste it into an email to hello@shaikhyousuf.dev.");
    } catch {
      setStatus("Couldn’t copy automatically. Select the preview text to copy it manually.");
    }
  }

  return <section id="contact" className={s.contact} aria-labelledby="contact-title">
    <header className={s.header} data-reveal>
      <p className={s.kicker}>A good project starts with a hello</p>
      <h2 id="contact-title">YOUR IDEA.<br/><span>LET’S HEAR IT.</span></h2>
      <p className={s.intro}>A rough idea, a fresh start, or a website that needs a little love. Tell me what you’re thinking.</p>
    </header>
    <div className={s.layout}>
      <form className={s.form} onSubmit={compose}>
        <fieldset><legend><span>01</span> What are we making?</legend>
          <div className={s.choices}>{options.map(option => <label className={s.choice} key={option}>
            <input type="radio" name="project-type" value={option} checked={project === option} onChange={() => setProject(option)}/>
            <span>{option}<b aria-hidden="true">{project === option ? "↗" : "+"}</b></span>
          </label>)}</div>
        </fieldset>
        <fieldset><legend><span>02</span> A little introduction</legend>
          <div className={s.fields}>
            <label>Your name<input name="name" autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="What should I call you?" maxLength={80} required/></label>
            <label>Email address<input name="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" maxLength={160} required/></label>
          </div>
        </fieldset>
        <fieldset><legend><span>03</span> The idea, in your words</legend>
          <label className={s.briefLabel}>Project details<textarea name="brief" value={brief} onChange={e => setBrief(e.target.value)} placeholder="What are you building? Who is it for? Any timing in mind?" rows={4} maxLength={1200} required/></label>
          <span className={s.count}>{brief.length} / 1200</span>
        </fieldset>
        <button type="submit" className={s.submit}>Let’s start a conversation <span aria-hidden="true">↗</span></button>
        <p className={s.note}>Opens your email app with a draft you can review.</p>
        <p className={s.status} role="status">{status}</p>
      </form>
      <aside className={s.preview} aria-label="Your email draft">
        <div className={s.paper}>
          <div className={s.paperTop}><span>YOUR NEXT GOOD THING</span><span className={s.stamp} aria-hidden="true">SY<br/>↗</span></div>
          <p className={s.recipient}>TO: HELLO@SHAIKHYOUSUF.DEV</p>
          <div className={s.letter}>{message}</div>
          <div className={s.paperBottom}><span>A little note.<br/>A lot of possibility.</span><button type="button" onClick={copyBrief}>Copy brief <span aria-hidden="true">↗</span></button></div>
        </div>
        <p className={s.caption}><span aria-hidden="true">↖</span> Your idea is taking shape.</p>
      </aside>
    </div>
  </section>;
}

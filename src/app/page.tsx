import Link from "next/link";
import OneCrewLogo from "../components/OneCrewLogo";

const crew = [
  ["atlas","Atlas","Research"],
  ["nova","Nova","Product"],
  ["milo","Milo","Marketing"],
  ["zara","Zara","Sales"],
  ["leo","Leo","Support"],
  ["iris","Iris","Design"],
  ["kael","Kael","Finance"],
  ["luna","Luna","Operations"],
  ["echo","Echo","Content"],
  ["scout","Scout","Strategy"],
];

function CrewAvatar({name,size=52}:{name:string;size?:number}) {
  return (
    <span className="lp2-avatar clean-avatar" style={{width:size,height:size}}>
      <img src={"/crew/"+name+".jpg"} alt="" />
    </span>
  );
}

export default function Home() {
  return (
    <main className="lp2-page">
      <header className="lp2-nav">
        <OneCrewLogo />
        <nav>
          <a href="#product">Product⌄</a>
          <a href="#crew">Crew⌄</a>
          <a href="#solutions">Solutions⌄</a>
          <a href="#pricing">Pricing</a>
          <a href="#resources">Resources⌄</a>
        </nav>
        <div className="lp2-nav-actions">
          <button className="lp2-search" aria-label="Search">⌕</button>
          <Link className="lp2-login" href="/login">Log in</Link>
          <Link className="lp2-start" href="/login?mode=signup">Start Free →</Link>
        </div>
      </header>

      <section className="lp2-hero" id="product">
        <div className="lp2-copy">
          <div className="lp2-kicker">YOUR AI CREW FOR A BIGGER TOMORROW</div>
          <h1>Build your<br/>company<br/><span>with an AI crew.</span></h1>
          <p>OneCrew gives solopreneurs a full team of AI agents — from research and product to marketing, sales, and support. Do more, faster, with people-powered AI.</p>
          <div className="lp2-actions">
            <Link className="lp2-primary" href="/login?mode=signup">Start Free →</Link>
            <a className="lp2-watch" href="#crew"><span>▶</span>Watch the crew in action</a>
          </div>
          <div className="lp2-proof">
            <span>● No credit card required</span>
            <span>● Setup in minutes</span>
            <span>● 10+ AI teammates</span>
          </div>
        </div>

        <div className="lp2-visual">
          <div className="lp2-aura lp2-aura-one"/>
          <div className="lp2-aura lp2-aura-two"/>
          <div className="lp2-floating lp2-float-top"><CrewAvatar name="leo" size={98}/></div>
          <div className="lp2-floating lp2-float-bottom"><CrewAvatar name="atlas" size={120}/><div className="lp2-scribble">A full team<br/>in your corner<br/>Always. ♡</div></div>

          <div className="lp2-product-window">
            <aside className="lp2-app-side">
              <div className="lp2-app-brand"><span className="crew-mark mini"><i/><i/><i/><b/></span><strong>OneCrew</strong><span>⋮</span></div>
              <button className="lp2-newchat">＋ New chat <kbd>Ctrl K</kbd></button>
              <div className="lp2-app-links">
                <button>⌂ <span>Home</span></button>
                <button className="active">▣ <span>Crew Chat</span></button>
                <button>◎ <span>Missions</span></button>
                <button>◫ <span>Agents</span></button>
                <button>▤ <span>Knowledge</span></button>
                <button>⌁ <span>Integrations</span></button>
                <button>▥ <span>Analytics</span></button>
              </div>
              <div className="lp2-recent">
                <small>Recent</small>
                <span>Launch plan for SaaS</span>
                <span>Social media campaign</span>
                <span>Competitor analysis</span>
                <span>Website redesign</span>
                <span>Q3 growth strategy</span>
              </div>
            </aside>

            <div className="lp2-chat">
              <div className="lp2-chat-top">
                <strong>Crew Chat⌄</strong>
                <div><span className="lp2-live">● 10 agents online</span><button>⋮</button><span className="lp2-userdot">A</span></div>
              </div>

              <div className="lp2-agent-strip" id="crew">
                {crew.map(([img,name,role])=>(
                  <div key={name}>
                    <CrewAvatar name={img} size={45}/>
                    <b>{name}</b>
                    <small>{role}</small>
                  </div>
                ))}
              </div>

              <div className="lp2-thread">
                <div className="lp2-user-message">Create a launch plan for my SaaS product <span className="lp2-userdot">A</span></div>

                <div className="lp2-response">
                  <div className="lp2-response-head">
                    <CrewAvatar name="atlas" size={42}/>
                    <div><b>Atlas <span>◌</span></b><small>Chief of Staff</small></div>
                  </div>
                  <p>Here’s a complete launch plan for your SaaS product:</p>
                  <div className="lp2-checklist">
                    <div><i>✓</i><span>Market research & competitor analysis</span></div>
                    <div><i>✓</i><span>Target audience and positioning</span></div>
                    <div><i className="open">○</i><span>Go-to-market strategy</span></div>
                    <div><i className="open">○</i><span>Marketing campaign ideas</span></div>
                    <div><i className="open">○</i><span>Launch timeline (4 weeks)</span></div>
                  </div>
                </div>

                <div className="lp2-docs">
                  <article><div className="lp2-doc-preview"><span/><span/><span/><span/></div><b>Go-to-Market Strategy</b><small>PDF · 12 pages</small></article>
                  <article><div className="lp2-doc-preview second"><span/><span/><span/><span/></div><b>Launch Timeline</b><small>Notion · 4 weeks</small></article>
                </div>

                <div className="lp2-quick">
                  <button>Make it more detailed</button>
                  <button>Add budget estimates</button>
                  <button>Create social media plan</button>
                  <button>Turn into a Notion doc</button>
                </div>
              </div>

              <form className="lp2-composer">
                <button type="button">⌘</button>
                <input placeholder="Message your crew..." />
                <button className="send" type="button">↑</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="lp2-trust">
        <small>TRUSTED BY FORWARD-THINKING BUILDERS</small>
        <div>
          <span>▣ Notion</span>
          <span>✣ slack</span>
          <span>Google</span>
          <span>▦ Microsoft</span>
          <span>Figma</span>
          <span>◉ Stripe</span>
          <span>◒ Linear</span>
          <span>▲ Vercel</span>
          <span>Discord</span>
          <span>◉ GitHub</span>
        </div>
      </section>

      <section className="lp2-feature-row" id="solutions">
        <article><span className="lp2-icon purple">ϟ</span><div><b>AI Agents</b><p>Specialized teammates for every part of your business.</p></div><button>→</button></article>
        <article><span className="lp2-icon blue">≋</span><div><b>Real Work</b><p>From ideas to execution, not just suggestions.</p></div><button>→</button></article>
        <article><span className="lp2-icon green">●</span><div><b>Your Knowledge</b><p>Connected to your tools, files, and context.</p></div><button>→</button></article>
        <article><span className="lp2-icon pink">◆</span><div><b>Built for Growth</b><p>Scale from solo to team without hiring.</p></div><button>→</button></article>
      </section>

      <section className="lp2-deep" id="pricing">
        <div>
          <div className="lp2-kicker">ONE CREW. ONE COMPANY BRAIN.</div>
          <h2>Your agents don’t just answer.<br/>They work together.</h2>
          <p>Give the crew a goal and OneCrew turns it into missions, delegated tasks, approvals, and real business output.</p>
          <Link className="lp2-primary" href="/login?mode=signup">Build your crew →</Link>
        </div>
        <div className="lp2-deep-card">
          <div className="lp2-mini-row"><CrewAvatar name="scout" size={58}/><div><b>Scout</b><small>Market research complete</small></div><em>✓</em></div>
          <div className="lp2-mini-row"><CrewAvatar name="milo" size={58}/><div><b>Milo</b><small>Growth campaign drafted</small></div><em>✓</em></div>
          <div className="lp2-mini-row"><CrewAvatar name="luna" size={58}/><div><b>Luna</b><small>Launch visuals in progress</small></div><em>●</em></div>
        </div>
      </section>

      <footer className="lp2-footer" id="resources">
        <OneCrewLogo />
        <span>AI teammates for ambitious solopreneurs.</span>
        <div><a href="#product">Product</a><a href="#crew">Crew</a><a href="#solutions">Solutions</a><a href="/login">Log in</a></div>
      </footer>
    </main>
  );
}

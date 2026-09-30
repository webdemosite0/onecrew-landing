import Image from "next/image";

const crew = [
  { name: "Atlas", role: "Chief of Staff", desc: "Plans & keeps you on track", img: "/crew/atlas.jpg" },
  { name: "Scout", role: "Research", desc: "Finds insights & opportunities", img: "/crew/scout.jpg" },
  { name: "Milo", role: "Growth", desc: "Drives growth & acquisition", img: "/crew/milo.jpg" },
  { name: "Nova", role: "Operations", desc: "Keeps everything running", img: "/crew/nova.jpg" },
  { name: "Leo", role: "Sales", desc: "Turns interest into customers", img: "/crew/leo.jpg" },
  { name: "Iris", role: "Support", desc: "Delights your customers", img: "/crew/iris.jpg" },
  { name: "Zara", role: "Finance", desc: "Tracks money & insights", img: "/crew/zara.jpg" },
  { name: "Kael", role: "Product", desc: "Helps you build & ship", img: "/crew/kael.jpg" },
  { name: "Luna", role: "Design", desc: "Creates beautiful experiences", img: "/crew/luna.jpg" },
  { name: "Echo", role: "Content", desc: "Tells your story everywhere", img: "/crew/echo.jpg" },
];

const features = [
  { icon: "🔍", title: "Research & Strategy", desc: "Find opportunities, analyze markets, and turn ideas into plans." },
  { icon: "✏️", title: "Create & Build", desc: "Design, write, and build your product with AI teammates." },
  { icon: "📈", title: "Launch & Grow", desc: "Get customers, grow your audience, and automate marketing." },
  { icon: "⚙️", title: "Run & Scale", desc: "Handle operations, finance, support and more — so you can focus on what matters." },
];

const logos = ["stripe", "Notion", "Figma", "shopify", "Google", "slack", "vercel", "Dropbox"];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafbff] overflow-x-hidden">
      <header className="sticky top-0 z-50 border-b border-gray-100/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <a href="#" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 text-white font-bold text-sm">✦</div>
              <span className="text-lg font-bold tracking-tight text-gray-900">OneCrew</span>
            </a>
            <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
              <a href="#product" className="hover:text-gray-900">Product ▾</a>
              <a href="#crew" className="hover:text-gray-900">Crew ▾</a>
              <a href="#missions" className="hover:text-gray-900">Missions</a>
              <a href="#pricing" className="hover:text-gray-900">Pricing</a>
              <a href="#resources" className="hover:text-gray-900">Resources ▾</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 sm:block">Log in</button>
            <a href="#start" className="btn-primary text-xs sm:text-sm">Start Free →</a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-pink-50/40 to-orange-50/30" />
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />
        <div className="absolute -left-20 top-40 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 lg:px-8 lg:pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="max-w-xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                YOUR AI CREW FOR A BIGGER TOMORROW
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-[3.25rem] leading-[1.15]">
                Build your company <span className="text-gradient">with an AI crew.</span>
              </h1>
              <p className="mt-5 text-base leading-relaxed text-gray-600 sm:text-lg">
                OneCrew gives solopreneurs a full team of AI agents — from research and product to marketing, sales, and support. Do more, faster, with people-powered AI.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#start" className="btn-primary">Start Free →</a>
                <button className="btn-secondary">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-violet-600 text-xs">▶</span>
                  Watch the crew in action
                </button>
              </div>
              <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> No credit card required</span>
                <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Setup in minutes</span>
                <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> 10+ AI teammates</span>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative h-[340px] w-full max-w-lg sm:h-[400px]">
                <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-2 p-2">
                  {crew.map((c, i) => (
                    <div key={c.name} className="relative" style={{ transform: `translate(${(i % 5) * 8 - 16}px, ${Math.floor(i / 5) * 12 - 8}px) rotate(${(i % 3) - 1}deg)`, zIndex: 10 - i }}>
                      <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-lg sm:h-24 sm:w-24">
                        <Image src={c.img} alt={c.name} width={96} height={96} className="h-full w-full object-cover" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute -right-2 top-4 rotate-6 rounded-lg bg-yellow-100 p-3 shadow-md text-[10px] text-gray-700 sm:right-4">
                  <div className="font-semibold text-yellow-800">Ideas</div>
                  <div>Plans</div>
                  <div>Products</div>
                  <div>Customers</div>
                  <div className="text-pink-500">Freedom ♥</div>
                </div>
                <div className="absolute bottom-8 -left-2 -rotate-3 rounded-lg bg-white px-3 py-2 shadow-md text-[10px] font-medium text-violet-600 sm:left-4">
                  Same Crew.<br />Bigger Tomorrow.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-white py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Trusted by modern builders</p>
          <div className="flex flex-wrap items-center justify-center gap-6 opacity-60 grayscale">
            {logos.map((l) => (
              <span key={l} className="text-sm font-bold tracking-tight text-gray-700">{l}</span>
            ))}
          </div>
          <a href="#start" className="text-xs font-medium text-violet-600 hover:underline">Join 50,000+ solopreneurs building with OneCrew →</a>
        </div>
      </section>

      <section id="product" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-600">YOUR ALL-IN-ONE AI OPERATING SYSTEM</div>
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything you need to build, in one place.</h2>
          <p className="mt-4 max-w-2xl text-gray-600">OneCrew brings together a full team of specialized AI agents to help you go from idea to impact — without the overhead.</p>
          <div className="mt-12 grid gap-8 lg:grid-cols-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
              {features.map((f) => (
                <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-lg">{f.icon}</div>
                  <h3 className="font-semibold text-gray-900">{f.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="lg:col-span-3">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2.5">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="ml-3 flex items-center gap-2 text-xs font-medium text-gray-600">
                    <span className="text-violet-500">✦</span> OneCrew
                  </div>
                </div>
                <div className="flex">
                  <div className="hidden w-44 border-r border-gray-100 bg-gray-50/80 p-3 sm:block">
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-violet-100 px-2.5 py-1.5 text-xs font-semibold text-violet-700"><span>🏠</span> Home</div>
                    {["Missions", "Crew", "Tasks", "Knowledge", "Brand", "Integrations"].map((item) => (
                      <div key={item} className="mb-1 rounded-lg px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-100">{item}</div>
                    ))}
                    <div className="mt-6 flex items-center gap-2 border-t border-gray-200 pt-3">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-400 to-pink-400" />
                      <div>
                        <div className="text-[10px] font-semibold text-gray-800">Alex Chen</div>
                        <div className="text-[9px] text-gray-400">Solo Founder</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">Good morning, Alex! ☀️</h3>
                        <p className="text-[11px] text-gray-500">Your crew is on it. 12 tasks in progress.</p>
                      </div>
                      <div className="hidden rounded-full border border-gray-200 bg-white px-3 py-1 text-[10px] text-gray-400 sm:block">Ask your crew anything…</div>
                    </div>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {crew.slice(0, 8).map((c) => (
                        <div key={c.name} className="text-center">
                          <div className="mx-auto h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow">
                            <Image src={c.img} alt={c.name} width={40} height={40} className="h-full w-full object-cover" />
                          </div>
                          <div className="mt-0.5 text-[9px] font-medium text-gray-700">{c.name}</div>
                          <div className="text-[8px] text-gray-400">{c.role}</div>
                        </div>
                      ))}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                        <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-gray-700">Today&apos;s Missions <span className="text-[9px] font-normal text-violet-600">View all</span></div>
                        {[
                          { t: "Analyze 3 new market opportunities", s: "In progress", c: "Scout" },
                          { t: "Create social campaign for launch", s: "In progress", c: "Leo" },
                          { t: "Design new landing page", s: "In review", c: "Luna" },
                          { t: "Update financial forecast", s: "Done ✓", c: "Zara" },
                        ].map((m) => (
                          <div key={m.t} className="mb-1.5 flex items-start gap-2 text-[10px]">
                            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                            <div className="flex-1">
                              <div className="text-gray-700">{m.t}</div>
                              <div className="text-gray-400">{m.c} · <span className={m.s.includes("Done") ? "text-green-600" : "text-amber-600"}>{m.s}</span></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                        <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-gray-700">Crew Activity <span className="flex items-center gap-1 text-[9px] font-normal text-green-600"><span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Live</span></div>
                        {["Scout found 5 competitor insights", "Milo drafted a growth experiment", "Luna created 3 hero variations", "Echo scheduled social content"].map((a, i) => (
                          <div key={a} className="mb-1.5 flex items-start gap-2 text-[10px] text-gray-600">
                            <span className="mt-0.5 text-violet-400">●</span>
                            <div>{a}<div className="text-gray-400">{2 + i * 5} mins ago</div></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="crew" className="bg-gradient-to-b from-white to-violet-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-600">10 SPECIALISTS. ONE POWERFUL TEAM.</div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Meet your AI Crew</h2>
          <p className="mt-3 max-w-xl text-gray-600">A team of AI agents, each with a unique superpower, working together to help you build, grow, and scale.</p>
          <p className="mt-1 text-sm italic text-violet-500">Different skills. A bigger you. ♥</p>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:gap-6">
            {crew.map((c) => (
              <div key={c.name} className="group flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="relative mb-3 h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-md transition group-hover:scale-105 sm:h-24 sm:w-24">
                  <Image src={c.img} alt={c.name} width={96} height={96} className="h-full w-full object-cover" />
                </div>
                <h3 className="font-semibold text-gray-900">{c.name}</h3>
                <p className="text-xs font-medium text-violet-600">{c.role}</p>
                <p className="mt-1 text-[11px] text-gray-500">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-white py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
          {[
            { value: "50K+", label: "Solopreneurs building with OneCrew" },
            { value: "2M+", label: "Tasks completed by the crew" },
            { value: "80%", label: "Average time saved" },
            { value: "4.9/5", label: "From our growing community" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-gray-900 sm:text-3xl">{s.value}</div>
              <div className="mt-1 text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="start" className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 px-6 py-12 shadow-2xl sm:px-12">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex justify-center -space-x-3">
                {crew.slice(0, 6).map((c) => (
                  <div key={c.name} className="h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow">
                    <Image src={c.img} alt={c.name} width={48} height={48} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">A bigger company starts with OneCrew.</h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-white/80">Get founder tips, crew updates, and more.</p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <input type="email" placeholder="Your email" className="w-full max-w-xs rounded-full border-0 px-5 py-3 text-sm text-gray-900 shadow-inner outline-none ring-2 ring-white/30 focus:ring-white sm:w-auto" />
                <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-violet-700 shadow transition hover:bg-violet-50">Start Free →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 text-white font-bold text-sm">✦</div>
                <span className="text-lg font-bold text-gray-900">OneCrew</span>
              </div>
              <p className="mt-3 max-w-xs text-sm text-gray-500">A full AI team for every builder.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Product</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-gray-900">Features</a></li>
                <li><a href="#" className="hover:text-gray-900">Integrations</a></li>
                <li><a href="#" className="hover:text-gray-900">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Crew</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-500">
                <li><a href="#crew" className="hover:text-gray-900">Meet the Crew</a></li>
                <li><a href="#" className="hover:text-gray-900">Use Cases</a></li>
                <li><a href="#" className="hover:text-gray-900">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Company</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-gray-900">About</a></li>
                <li><a href="#" className="hover:text-gray-900">Careers</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row">
            <p className="text-xs text-gray-400">© {new Date().getFullYear()} OneCrew. All rights reserved.</p>
            <div className="flex gap-4 text-gray-400">
              <a href="#" className="hover:text-gray-600">𝕏</a>
              <a href="#" className="hover:text-gray-600">in</a>
              <a href="#" className="hover:text-gray-600">▶</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import {
  audience,
  closingCta,
  features,
  featuresSection,
  footer,
  hero,
  howItWorks,
  pricing,
} from "@/app/_data/landing";
import { FeatureMock } from "@/components/landing/FeatureMocks";
import { TeamPricingCta } from "@/components/landing/TeamPricingCta";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PricingTable } from "@clerk/nextjs";

const PRICING_TAB = 
  "rounded-full px-5 py-1.5 data-active:bg-primary data-active:text-primary-foreground dark:data-active:bg-primary dark:data-active:text-primary-foreground"

function Diamond() {
  return (
    <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 bg-primary" />
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center justify-center gap-2.5 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
      <Diamond />
      {children}
    </p>
  );
}

/** A map waypoint: a numbered diamond. The last stop on the route is filled in. */
function Waypoint({ number, destination }: { number: number; destination: boolean }) {
  return (
    <span aria-hidden="true" className="relative flex size-10 shrink-0 items-center justify-center">
      <span
        className={`absolute inset-1.5 rotate-45 rounded-[3px] border border-primary ${
          destination ? "bg-primary" : "bg-background"
        }`}
      />
      <span
        className={`relative font-mono text-xs ${
          destination ? "text-primary-foreground" : "text-primary"
        }`}
      >
        {String(number).padStart(2, "0")}
      </span>
    </span>
  );
}

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        {/* overflow-x-clip: the tilted card flares wider at its bottom edge, which shouldn't cause sideways scroll. */}
        <section className="topo-bg flex flex-col items-center overflow-x-clip px-6 pt-12 pb-24 text-center md:pt-14">
          <Eyebrow>{hero.eyebrow}</Eyebrow>

          <h1 className="mt-6 max-w-3xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
            {hero.headline.before}
            <span className="text-primary">{hero.headline.highlight}</span>
            {hero.headline.after}
          </h1>

          <p className="mt-5 max-w-lg text-base text-pretty text-muted-foreground">
            {hero.subtitle}
          </p>

          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild className="h-11 w-full px-5 text-base sm:w-auto">
              <Link href={hero.primaryCta.href}>{hero.primaryCta.label}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 w-full px-5 text-base sm:w-auto"
            >
              <Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
            </Button>
          </div>

          {/* survey-frame sits outside the card because overflow-hidden would clip its corner marks. */}
          <div className="survey-frame scroll-tilt mt-20 w-full max-w-280 md:mt-16 lg:mt-10">
            <div className="overflow-hidden rounded-2xl border bg-card shadow-2xl">
              <video
                autoPlay
                muted
                loop
                playsInline
                poster={hero.video.poster}
                width={1600}
                height={900}
                aria-label={hero.video.label}
                className="block h-auto w-full"
              >
                <source src={hero.video.webm} type="video/webm" />
                <source src={hero.video.mp4} type="video/mp4" />
              </video>
            </div>
          </div>
        </section>

        <section
          aria-label={audience.label}
          className="flex flex-col items-center gap-4 border-y px-6 py-8 md:flex-row md:justify-center md:gap-10"
        >
          <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
            {audience.label}
          </p>
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
            {audience.items.map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <Diamond />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section id="product" className="scroll-mt-18 px-6 py-24 md:py-32">
          <h2 className="mx-auto max-w-3xl text-center text-4xl leading-[1.1] font-semibold tracking-tight text-balance md:text-5xl">
            {featuresSection.heading}
          </h2>

          <div className="mx-auto mt-16 flex max-w-6xl flex-col gap-20 md:mt-24 md:gap-28">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.id}
                  className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
                >
                  {/* Text stays first in the DOM, so only the visual order alternates. */}
                  <div className={index % 2 === 1 ? "lg:order-last" : undefined}>
                    <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <h3 className="mt-5 text-2xl font-semibold tracking-tight md:text-3xl">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-pretty text-muted-foreground">
                      {feature.description}
                    </p>
                    <ul className="mt-6 space-y-3 text-sm">
                      {feature.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-center gap-3">
                          <Diamond />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <FeatureMock mock={feature.mock} />
                </article>
              );
            })}
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-18 border-t px-6 py-24 md:py-32">
          <Eyebrow>{howItWorks.eyebrow}</Eyebrow>
          <h2 className="mx-auto mt-5 max-w-3xl text-center text-4xl leading-[1.1] font-semibold tracking-tight text-balance md:text-5xl">
            {howItWorks.heading}
          </h2>

          <ol className="mx-auto mt-16 grid max-w-5xl gap-8 md:mt-20 md:grid-cols-3">
            {howItWorks.steps.map((step, index) => {
              const last = index === howItWorks.steps.length - 1;
              return (
                <li key={step.title} className="relative flex gap-5 md:flex-col md:gap-6">
                  {/* The route to the next waypoint: down the page on phones, across from md up.
                      It starts and stops 8px clear of each marker and spans the 2rem grid gap. */}
                  {!last && (
                    <span
                      aria-hidden="true"
                      className="absolute top-12 -bottom-6 left-5 border-l border-dashed border-primary/60 md:top-5 md:-right-6 md:bottom-auto md:left-12 md:border-t md:border-l-0"
                    />
                  )}
                  <Waypoint number={index + 1} destination={last} />
                  <div className="pb-2 md:pr-6">
                    <h3 className="text-xl font-semibold tracking-tight">{step.title}</h3>
                    <p className="mt-2 text-pretty text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section 
        id="pricing"
        className="scroll-mt-18 border-t px-6 py-24 md:py-32">

          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="flex items-center justify-center gap-2.5 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
              <span aria-hidden className="size-1.5 rotate-45 bg-primary" />
              {pricing.eyebrow}
            </p>
            {/* <Eyebrow>{pricing.eyebrow}</Eyebrow> */}
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
              {pricing.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-pretty text-muted-foreground">
              {pricing.body}
            </p>
            {/* <span className="mt-8 inline-block rounded-full border border-primary/40 bg-accent px-3 py-1 font-mono text-xs tracking-[0.2em] text-accent-foreground uppercase">
              {pricing.badge}
            </span> */}
          </div>
  
          <Tabs defaultValue="user" className="mx-auto max-w-5xl items-center gap-10">
            <TabsList className="h-auto rounded-full border border-white/10 bg-white/5 p-1">

              <TabsTrigger value="user" className={PRICING_TAB} >Personal</TabsTrigger>
              <TabsTrigger value="organization" className={PRICING_TAB} >Team</TabsTrigger>
            </TabsList>
            <TabsContent value="user" className="w-full" >
              <PricingTable for="user" />
              </TabsContent>
            <TabsContent value="organization" className="w-full" > 
              <PricingTable for="organization" />
              <TeamPricingCta />
            </TabsContent>
          </Tabs>
          


        </section>

        <section className="topo-bg flex flex-col items-center border-t px-6 py-28 text-center md:py-36">
          <Image
            src={closingCta.mascot.src}
            alt={closingCta.mascot.alt}
            width={112}
            height={112}
            className="size-24 md:size-28"
          />
          <h2 className="mt-8 max-w-2xl text-4xl leading-[1.1] font-semibold tracking-tight text-balance md:text-5xl">
            {closingCta.heading}
          </h2>
          <p className="mt-5 max-w-md text-pretty text-muted-foreground">{closingCta.body}</p>
          <Button asChild className="mt-8 h-11 px-5 text-base">
            <Link href={closingCta.cta.href}>{closingCta.cta.label}</Link>
          </Button>
        </section>
      </main>

      <footer className="border-t px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-sm text-muted-foreground sm:flex-row">
          <span className="font-heading font-semibold text-foreground">{footer.brand}</span>
          <span>{footer.credit}</span>
        </div>
      </footer>
    </>
  );
}

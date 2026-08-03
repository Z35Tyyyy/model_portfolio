import Intro from "@/components/Intro";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Statement from "@/components/Statement";
import Quote from "@/components/Quote";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Ugc from "@/components/Ugc";
import Film from "@/components/Film";
import Sequence from "@/components/Sequence";
import Contact from "@/components/Contact";
import { content } from "@/lib/content";

export default function Home() {
  const [storyOne, storyTwo] = content.story;
  const [statementOne, statementTwo] = content.statements;
  const [quoteOne, quoteTwo, quoteThree] = content.quotes;

  return (
    <>
      <Intro />
      <Hero />

      <Story {...storyOne} />
      <Statement
        lines={statementOne.lines}
        theme={statementOne.theme as "light" | "dark"}
      />
      <Story {...storyTwo} reverse />
      <Quote text={quoteOne} />

      <About />
      <Quote text={quoteTwo} />

      <Projects />

      <Ugc />
      <Film />

      <Quote text={quoteThree} />
      <Statement
        lines={statementTwo.lines}
        theme={statementTwo.theme as "light" | "dark"}
      />

      <Sequence />
      <Contact />
    </>
  );
}

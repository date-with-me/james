import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Section } from "./components/Section";
import { Stat } from "./components/Stat";
import { Tag } from "./components/Tag";
import { Dietary } from "./components/Dietary";
import { PoliticalCompass } from "./components/PoliticalCompass";
import { LookingInMap } from "./components/LeafletMap";
import Youtube from "./components/utility/YouTube";
import Gallery from "./components/utility/Gallery";
import LoveLanguages from "./components/LoveLanguages";

 

function Header() {
  return (
    <header className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
      <img
        src="./assets/james-pp.png"
        alt="Profile Picture"
        className="w-28 h-28 md:w-40 md:h-40 rounded-full object-cover ring-4 ring-white shadow"
      />
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">James</h1>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Founder of <a href="https://date-with.me" className="text-indigo-600 underline">date-with.me</a>.
          I built this website because typical dating profiles never let me show the whole me.
        </p>
        <blockquote className="mt-4 text-gray-700 italic">
          Vegetarian, love animals, nature and the countryside. Consultant software developer and civil engineer, home owner, 
          love science, edutainment, programming and co-op video games. Loyal and emotionally available. I'd love to cook you a 
          meal and binge TV and movies together while snuggled up on the couch! 😁
        </blockquote>
        <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2">
          <Tag>💚 Empathetic</Tag>
          <Tag>🤓 Nerdy</Tag>
          <Tag>🧪 Science lover</Tag>
          <Tag>🎨 Innovator</Tag>
          <Tag>🧠 Thinker</Tag>
          <Tag>🎮 Co-op gamer</Tag>
        </div>
      </div>
    </header>
  );
}

function BasicsDashboard() {
  return (
    <Section title="Basics" id="basics">
      {(() => {
        const compassData = [
          { economic: -5.0, social: -6.56, date: "2025-09-10" },
          { economic: -1.2, social: -3.0, date: "2022-01-02" },
          { economic: 2.63, social: -4.36, date: "2019-06-01" },
        ];
        return null;
      })()}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Stat label="Height" value="6'1" emoji="📏" />
        <Stat label="Sexuality" value="Heterosexual" emoji="🫂" />
        <Stat label="Looking for" value="Long-term relationship / Life partner" emoji="💞" />
        <Stat label="Relationship style" value="Monogamous" emoji="❤️" />
        <Stat label="Kids" value="Open to kids" emoji="👶" />
        <Stat label="Exercise" value="Sometimes" emoji="🏃" />
        <Stat label="Education" value="Bachelor’s degree" emoji="📗" />
        <Stat label="Religion" value="Agnostic Atheist" emoji="⛪" />
        <Stat label="Drinking" value="Rarely" emoji="🍷" />
        <Stat label="Smoking" value="Never; Okay with vapers" emoji="🚬" />
        <Dietary
            type="vegetarian"
            description={
              "Borderline vegan. My vegetarianism is a core value, and while I don't expect you to go fully vegetarian, I do need a partner" + 
              " who can happily share that lifestyle. So if things kick off between us you need to be genuinely okay with eating vegetarian / vegan" + 
              " food most of the time."
            }
          />
        {/* Political Compass card */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm uppercase tracking-wide text-gray-500 mb-2">Political Compass</div>
          <div className="flex items-start">
            <PoliticalCompass
              points={[
                { economic: -5.0, social: -6.56, date: "2025-09-10" },
                { economic: -1.2, social: -3.0, date: "2022-01-02" },
                { economic: 2.63, social: -4.36, date: "2019-06-01" },
              ]}
              width={180}
              height={180}
              className="shrink-0"
            />
            <p className="flex-1">
              I've come from a center-right libertarian background. As time has gone on I've grown further to the left as my perspectives
              have become more nuanced.
            </p>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm uppercase tracking-wide text-gray-500 mb-2">Looking in this area</div>
          <LookingInMap
            data={"./assets/area.geojson"}
            theme={(row) => {
              return row.color
            }}
            legend={[
              { color: "#00FF00", description: "Excellent!" },
              { color: "#FFFF00", description: "We'll make it work!" },
              { color: "#FF0000", description: "If you are willing to relocate, I'm down!" },
            ]}
            center={[52.61743,-1.1380]}
            zoom={7.21}
            autoFitDataBounds={false}
          />
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <LoveLanguages WordsOfAffirmation="both" ActsOfService="giver" PhysicalTouch="both" QualityTime="both" ReceivingGifts="giver"/>
        </div>
      </div>
    </Section>
  );
}

function Articles() {
  return (
    <div className="grid grid-cols-1 gap-6">
      <Section title="Pictures of me" id="pictures">
        <Gallery height={400} set={[
            {description: "", path: "./assets/james-1.webp"},
            {description: "", path: "./assets/james-8.jpg"},
            {description: "", path: "./assets/james-3.webp"},
            {description: "", path: "./assets/james-2.webp"},
            {description: "", path: "./assets/james-4.jpg"},
            {description: "", path: "./assets/james-7.jpg"},
          ]}
        />
      </Section>

      <Section title="Animals" id="animals">
        <p className="my-2">
          If it wasn't clear already, animals are a massive part of my life 😁 I get such immense joy from looking after our cohabitors 
          on this planet, whether they be the pets I live with, the animals agriculture or the animals I make acquantence with on a daily
          basis! 
        </p>
        <h2 className="font-bold underline">Tiggy and Nora</h2>
        <p className="my-2">
          Tiggy and Nora are my parent's cats. Until last year, I lived with my parents and grew very close with both Tiggy and Nora. It
          is amazing how different their personalities are! Tiggy is super chill, and is best friends with whoever will feed him 😂 On the
          other hand Nora has very strong boundaries with strangers, but after a bit of time and patience she always comes around to understand
          she is safe with us ❤️
        </p>
        <Gallery set={[
          {description: "This is Tiggy, he's the 4th cat I've lived with. Tiggy was a farm cat for most of his childhood, and was initially very wild, but today is very needy, and wants lots of hugs. Feed him and you'll be his friend forever!", path: "./assets/james-cat-tiggy-1.jpg"},
          {description: "This summer it was very hot and while Tiggy was cuddling me, I decided to blast him with my desk fan to cool him down a bit 🥰", path: "./assets/james-cat-tiggy-2.mp4"},
          {description: "Tiggy sleeping on me.", path: "./assets/james-cat-tiggy-3.jpg"},
          {description: "Tiggy sleeping on me.", path: "./assets/james-cat-tiggy-4.webp"},
          {description: "This is Nora, the 5th cat I've lived with. She was a rescue and spent the first years of her life terrified of humans, living under a garden shed. We were very close when she was a kitten, and she loves a bit of fuss, but only on her terms!", path: "./assets/james-cat-nora-1.mp4"},
          {description: "I believe Nora is highly intelligent, here she is watching some youtube videos with me 🤓", path: "./assets/james-cat-nora-2.mp4"},
          {description: "Having said that, here she is trying to eat my glasses 😂😂😂", path: "./assets/james-cat-nora-4.mp4"},
          {description: "And here she is snuggled up to me 🥰", path: "./assets/james-cat-nora-3.jpg"},
          {description: "These days she rarely sits on me, but she still loves a fuss!", path: "./assets/james-cat-nora-5.mp4"}
        ]} height={300}/>
        <h2 className="font-bold underline">Other animals</h2>
        <p>
          Unlike many humans, I don't distinguish between pets and other animals. They are equally as deserving of love and affection.
          Here's a few moments caught on camera of me interacting with animals in the wider world.
        </p>
        <Gallery set={[
          {description: "A few months ago I visited a farm with some friends, and while sitting on a wall I was approached by this cutie!", path: "./assets/james-cat-farmcat.mp4"},
          {description: "Amazingly she felt safe enough in my arms to have a little nap on me 🥰", path: "./assets/james-cat-farmcat.webp"},
          {description: "Although cats are my forte, I'm also a lover of dogs, and all kinds of other animals too!", path: "./assets/james-dog-cookie-1.png"},
          {description: "While on a walk this summer, I came across this horse. Horses are gorgeous elegant creatures.", path: "./assets/james-animal-horse.jpg"},
          {description: "It's always so sad to see horses in fenced areas like this, I hope they have good owners. 🤞", path: "./assets/james-animal-horse-3.jpg"},
          {description: "Finally a picture of me feeding a cow. I have mixed feelings about this given that it's agriculture, but I feel it's important to show our love for these animals especially.", path: "./assets/james-animal-cow-1.jpg"}
        ]} height={300}/>
      </Section>

      
      <Section title="A few things which make me cry..." id="tears">
        <p>
          Ever wonder what makes me tear up? Here are a few examples that reliably turn on the waterworks! If ever you fancy
          watching me ugly cry, show me one of these videos 😂 Honestly, I've cried so much this evening while writing this
          section and rewatching these videos... 😅
        </p>
        <div className="p-4">
          <h2 className="font-bold underline">Moana</h2>
          <p className="my-2">
            I've been a big fan of Disney for many years. All the Disney movies I've watched have been consistently brilliant. 
            But Moana is the first that comes to mind when I think about movies that made me cry. Specifically the scene where
            Moana finally realises that <b>Te Kā</b> <i>is</i> <b>Te Fiti</b>. The line "You know who you are" always breaks me.
          </p>
          <Youtube url={"https://youtu.be/sf3CevfP-E8"} />
        </div>
        <div className="p-4">
          <h2 className="font-bold underline">Vox-Machina - Keyleth vs Sylas</h2>
          <p className="my-2">
            Yes, that's right, I'm a Critical Role fanboy 😂. I have been watching Critical Role episodes since Campaign 2, and have
            been thoroughly addicted to the campaigns since. I have yet to watch the Campaign 1 tabletop sessions but have been mostly
            enamored by the animated series. 😍
          </p>
          <p className="my-2">
            This scene with Keyleth is incredibly emotional for me, and never ceases to bring tears to my eyes. It powerfully conveys 
            the message that you can make impactful decisions if you believe in yourself, and it's largely that doubt in our own abilities
            which holds us back. In this scene, Keyleth, a character who up to this point struggled with self-doubt, finally truly embraces
            her identity and her vital role in the world.
          </p>
          <Youtube url={"https://youtu.be/2PgvLb_rOnk"} />
        </div>

        <div className="p-4">
          <h2 className="font-bold underline">Baldurs Gate 3 - Freeing the Nightsong</h2>
          <p className="my-2">
            I've been a huge fan of Larian games for years now. I first played <b>Divinity: Original Sin 2</b> with my friends in
            2019, and we adored it so much that we immediately bought the slightly worse, but also amazing <b>Divinity: Original Sin 1</b>,
            and as soon as BG3 came into early access we have been there playing the game also. BG3 has turned into one of my most played
            games, with over 700 hours playing it over the last 5 years 👀. If you haven't tried it yourself... It will definitely be the 
            first on our list to play together!! 😁
          </p>
          <p className="my-2">
             Despite having played the game about 10 times now (😅), I still learn new things about the game every time I play it, and
             this scene... This scene breaks me every single time... I think this scene is so powerful to me, because it shows no matter
             how you've acted in the past, there is always the chance at redemption. That through our actions, we can grow 🥺. This
             sentiment is powerful to me.
          </p>
          <Youtube url={"https://youtu.be/utDBG-8h5DA"} />
        </div>
      </Section>

      

      <Section title="Hobbies" id="hobbies">
        <h2 className="font-bold underline">Programming</h2>
        <h2 className="font-bold underline">Musical Instruments</h2>
        <h2 className="font-bold underline">Video Editing</h2>
        <h2 className="font-bold underline">Science & Edutainment</h2>
        <h2 className="font-bold underline">Custom Jewerly</h2>
        <h2 className="font-bold underline">Cooking</h2>
      </Section>

      <Section title="Philosophy" id="philosophy">
        <h2 className="font-bold underline">Techno-optimism</h2>
        <p className="my-2">
          This is my daily, lived, experience. I'm always on the lookout for innovative technological solutions to tackle problems,
          whether it's at work or finding smarter ways to approach DIY projects at home. I genuinely believe that paired with careful
          design and planning, technology can solve many of the challenges we face every day! Example: There's never any hesitation to
          spin up my own dating website 😂
        </p>
        <h2 className="font-bold underline">Determinism</h2>
        <p className="my-2">
          My perspective on life is shaped by determinism, the idea that all events are the result of prior causes. Everything is fated,
          not in a mystical sense, but from the complex chain of events that shapes who we are. This belief of mine fosters a profound sense
          of empathy in me, particularly for those facing adversity or struggling with difficult circumstances. I believe understanding these
          influences is key to compassion.
        </p>
        <h2 className="font-bold underline">Spirituality</h2>
        <p className="my-2">
          When it comes to spirituality, I'm an agnostic atheist. I don't claim to know whether a divine being exists, but I live my
          life based on the evidence and experience of this world, without relying on religious dogma.  My morals are deeply personal
          and derived from a sense of shared humanity, and a desire to contribute positively to the world.
        </p>
        <p className="my-2">
          My own beliefs are important to me, but I'm completely open-minded about others' spiritual paths. You absolutely don't need 
          to be an atheist! What matters most to me is shared values and mutual respect.
        </p>
      </Section>

      {/* 
      <Section title="What I'm looking for" id="interested">
        <p>

        </p>
      </Section> 
      */}

      

      {/* TODO: Music playlist */}

      {/* TODO: Call to action - Interested? Send your contact details here... mailto://date-with-me-james@protonmail.com ...       */}
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8 md:space-y-10">
        <Header />
        <BasicsDashboard />
        <Articles />
      </div>
    </div>
  );
}

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
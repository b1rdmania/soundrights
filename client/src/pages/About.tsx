
import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-28 pb-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">About SoundRights</h1>
            
            <section className="prose max-w-none mb-12">
              <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
              <p className="text-muted-foreground mb-8">
                At SoundRights, we believe creators deserve more control and clarity over their intellectual property. 
                Our mission is to build user-friendly tools on decentralized infrastructure like Story Protocol to empower 
                musicians and sound designers in the evolving digital landscape, ensuring fair and transparent management 
                of their valuable audio assets.
              </p>
              
              <h2 className="text-2xl font-semibold mb-3">Meet the Creator</h2>
              <p className="text-muted-foreground mb-8">
                I'm a web3 native, having worked at Sonic Labs for 2 years, but with a music industry background and interested about the intersection of music technology and decentralized systems. SoundRights was born from a desire to explore how blockchain and programmable IP can solve real-world challenges for audio creators. With a background in React development and AI exploration, I'm excited to build tools that put power back into the hands of artists. This MVP for SoundRights is my submission to the Surreal World Assets bounty, leveraging the innovative Story Protocol.
              </p>
              
              <h2 className="text-2xl font-semibold mb-3">Connect</h2>
              <div className="flex flex-wrap gap-4 mb-8">
                <a 
                  href="https://github.com/b1rdmania" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  GitHub
                </a>
                <a 
                  href="https://twitter.com/b1rdmania" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  Twitter/X
                </a>
                <a 
                  href="https://t.me/birdman1a" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  Telegram
                </a>
              </div>
              
              <h2 className="text-2xl font-semibold mb-3">Acknowledgements</h2>
              <p className="text-muted-foreground">
                Special thanks to the organizers of the Surreal World Assets bounty and the team behind 
                Story Protocol for providing the platform and opportunity to build.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;

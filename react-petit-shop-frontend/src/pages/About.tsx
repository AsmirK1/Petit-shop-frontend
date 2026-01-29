import { Link } from "react-router-dom"
import type  { Developer } from "../types/Developer";
// import { MarkGithubIcon } from "@primer/octicons-react";
// import { FaGithub, FaLinkedin } from "react-icons/fa";

function IconGithub(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={props.className}>
      <path
        fill="currentColor"
        d="M12 .5C5.73.5.75 5.7.75 12.1c0 5.11 3.29 9.44 7.86 10.97.57.11.78-.25.78-.56v-2.1c-3.2.71-3.87-1.42-3.87-1.42-.52-1.35-1.27-1.71-1.27-1.71-1.04-.73.08-.71.08-.71 1.15.08 1.75 1.2 1.75 1.2 1.02 1.78 2.67 1.27 3.32.97.1-.76.4-1.27.73-1.56-2.55-.3-5.23-1.3-5.23-5.79 0-1.28.45-2.33 1.2-3.15-.12-.3-.52-1.52.12-3.17 0 0 .98-.32 3.2 1.2.93-.26 1.92-.4 2.9-.4s1.97.14 2.9.4c2.22-1.52 3.2-1.2 3.2-1.2.64 1.65.24 2.87.12 3.17.75.82 1.2 1.87 1.2 3.15 0 4.5-2.69 5.49-5.25 5.78.41.36.78 1.08.78 2.18v3.23c0 .31.2.67.79.56 4.56-1.53 7.85-5.86 7.85-10.97C23.25 5.7 18.27.5 12 .5Z"
      />
    </svg>
  );
}

function IconLinkedIn(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={props.className}>
      <path
        fill="currentColor"
        d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 23.5h4V7.98h-4V23.5ZM8.5 7.98h3.83v2.12h.05c.53-1 1.83-2.12 3.77-2.12 4.03 0 4.78 2.65 4.78 6.09v9.43h-4v-8.36c0-2-.04-4.56-2.78-4.56-2.78 0-3.2 2.17-3.2 4.41v8.51h-4V7.98Z"
      />
    </svg>
  );
}

export const About = () => {
    // const developers: {
	// 	id: number;
	// 	name: string;
    //     profie: string;
	// 	github: string;
	// 	linkedin: string;
	// 	aboutText: string;
	// }[] = [
    const developers: Developer [] = [
		{
			id: 0,
			name: "Asmir",
            profie: "Software Developer",
			github: "https://github.com/Al-Amer",
			linkedin: "Software Developer",
			aboutText:
				"Software Engineer with very good knowledge of HTML5, JavaScript and SQL as well as successfully applied Responsive Designs, Clean Code: Clear code, without bugs.",
		},
		{
			id: 1,
			name: "Saeed",
            profie: "Software Developer",
			github: "https://github.com/vandakisaeed",
			linkedin: "Software Developer",
			aboutText:
				"Software Engineer with very good knowledge of HTML5, JavaScript and SQL as well as successfully applied Responsive Designs, Clean Code: Clear code, without bugs.",
		},
		{
			id: 2,
			name: "Amer",
            profie: "Software Developer",
			github: "https://github.com/Al-Amer",
			linkedin: "https://www.linkedin.com/in/amer-almonajed/",
			aboutText:
				"Software Engineer with very good knowledge of HTML5, JavaScript and SQL as well as successfully applied Responsive Designs, Clean Code: Clear code, without bugs.",
		},
	];
    
    return (
        <div className="space-y-10 p-4 md:p-8 lg:p-12">
           {/* Hero */}
            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10 backdrop-blur">
                {/* <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" /> */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                  <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-700 dark:text-white/70">
                    Student project · Portfolio-ready
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                    About Petit-shope
                  </h1>
                  <p className="max-w-2xl text-gray-700 dark:text-white/75 leading-relaxed">
                    Welcome to our online marketplace — the place where everyone can buy and sell with ease.
                    Our platform connects buyers and sellers in one secure and simple space. Whether you want to sell your own products or shop from a wide range of sellers,
                    our website gives you everything you need.
                    To use the platform, users must register and log in, ensuring a safe and trusted experience for everyone.
                  </p>
                  <ul className="list-disc">
                    <li>Sellers can register, add their products, manage prices, and reach customers easily.</li>
                    <li>Buyers can browse products, add to cart, and complete purchases securely.</li>
                    <li>Admins can manage users, products, and monitor sales.</li>
                  </ul>
                  <p className="max-w-2xl text-gray-700 dark:text-white/75 leading-relaxed">
                    Our goal is to create a trusted marketplace where anyone can become a seller and everyone can find what they need — all in one place.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link
                      to="/"
                      className="rounded-xl px-4 py-2 text-sm bg-gradient-to-r from-indigo-500/50 to-cyan-500/40 hover:from-indigo-500/60 hover:to-cyan-500/50 ring-1 ring-white/10 transition"
                    >
                      Back to Dashboard
                    </Link>
                  </div>
                  </div>

                  <div className="hidden lg:flex items-center justify-end">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
                    <img src="/petit-logo.svg" alt="Petit Shop logo" className="w-56 h-56 sm:w-72 sm:h-72 object-contain" />
                  </div>
                  </div>
                </div>
            </section>
            <section className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur space-y-4">
                <h2 className="text-lg font-semibold">What you can do</h2>
                <ul className="space-y-2 text-gray-700 dark:text-white/75">
                  <li className="flex gap-2">
                  <span className="text-gray-500 dark:text-white/50">•</span> Buy Anything You Need
                    </li>
                    <li className="flex gap-2">
                    <span className="text-gray-500 dark:text-white/50">•</span> Sell Your Products Easily
                    </li>
                    <li className="flex gap-2">
                    <span className="text-gray-500 dark:text-white/50">•</span> Offer Your Services
                    </li>
                    <li className="flex gap-2">
                    <span className="text-gray-500 dark:text-white/50">•</span> Secure Registration & Login
                    </li>
                    <li className="flex gap-2">
                    <span className="text-gray-500 dark:text-white/50">•</span> All-in-One Platform
                    </li>
                </ul>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur space-y-4">
                <h2 className="text-lg font-semibold">Project facts</h2>
                <div className="grid gap-3 sm:grid-cols-2 text-sm text-gray-700 dark:text-white/70">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-gray-900 dark:text-white/90 font-medium">Frontend</div>
                    <div>React + TypeScript</div>
                    <div>React Router</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-gray-900 dark:text-white/90 font-medium">Backend</div>
                    <div>ASP.NET Minimal API</div>
                    <div>EF Core + SQLite</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-gray-900 dark:text-white/90 font-medium">UX focus</div>
                    <div>ProblemDetails errors</div>
                    <div>Optimistic updates</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-gray-900 dark:text-white/90 font-medium">Privacy</div>
                    <div>Login for protected data</div>
                    <div>No third-party selling</div>
                    </div>
                </div>

                <p className="text-gray-600 dark:text-white/60 text-sm">
                    Note: This is a student project. Some features require login to protect private data.
                </p>
                </div>
            </section>

      {/* Team */}
            <section className="space-y-4 pl-10 pr-10 pt-6 pb-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
                <div className="flex items-end justify-between gap-4">
                    <h2 className="text-xl font-semibold pl-4">Meet the team</h2>
                    <div className="text-sm text-gray-600 dark:text-white/60 pr-4">Click GitHub/LinkedIn to see our work</div>
                </div>
                {/*  */}
                <div className="grid gap-6 items-start justify-center m-8 p-8">
            		<div className=" flex items-start justify-center border border-white/10 bg-white/5 backdrop-blur rounded-xl m-8 p-8">
			            {developers.map((developer) => {
				            return (
					            <div
						        key={developer.id}
	    	    				className="group flex flex-col justify-center text-center border-2 border-solid border  border-white/10 bg-white/5 p-6 backdrop-blur 
                                           rounded-xl m-4 p-4 w-80 transition-transform duration-300 
                                           hover:scale-105"
                                // className="rounded-3xl border border border-white/10 bg-white/5 p-6 backdrop-blur hover:bg-white/10 transition"
				            	>
						            <div className="flex justify-center backdrop-blur">
        						    	{/* <Image
		    				    		src={developer.imge}
			    		    			alt={developer.name}
				        				className="rounded-full h-40 w-40 object-contain 
                                       transition-transform duration-300 
                                       group-hover:scale-110 group-hover:ring-4 group-hover:ring-indigo-400"
					        		    /> */}
						            </div>
						            <h3 className="font-serif text-xl mt-3">{developer.name}</h3>
	    	    	    			<p className="font-mono mt-3">{developer.profie}</p>
		    	    	    		<p className="font-san h-70 overflow-y-auto mt-3">
					        		{developer.aboutText}
						            </p>

                                    <div className="mt-5 flex items-start justify-center  ">
                                        <div className="m-2"> 
                                            {/* <a
                                            href="https://github.com/Al-Amer"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-white transition-colors"
                                        >
                                            <FaGithub size={20} />
                                        </a> */}
                                         {/* <a
                                            href="https://github.com/Al-Amer"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-white transition-colors"
                                        >
                                            <MarkGithubIcon size={20}/>
                                        </a> */}
                                        {/* <SocialLinks githubUrl={developer.github} linkedinUrl={developer.linkedin} /> */}
                                        <a href={developer.github} target="_blank" rel="noreferrer" className="btn" aria-label="GitHub">
                                            <IconGithub className="h-5 w-5" />
                                            {/* GitHub */}
                                        </a>
                                        </div>
                                        <div className="m-2" >
                                        {/* <a
                                            href="https://www.linkedin.com/in/amer-almonajed/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-blue-400 transition-colors">
                                            <FaLinkedin size={20} />
                                        </a> */}
                                        <a href={developer.linkedin} target="_blank" rel="noreferrer" className="btn" aria-label="LinkedIn">
                                            <IconLinkedIn className="h-5 w-5" />
                                            {/* LinkedIn */}
                                        </a>
                                        </div>
                                    </div>

						{/* Social icons can be added here if needed */}
				
                	</div>
				);
			})}
		</div>
        
          {/* {developers.map((m) => (
            <article
              key={m.name}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur hover:bg-white/10 transition"
            >
              <div className="flex items-start gap-4">
                <Avatar name={m.name} />
                <div className="min-w-0">
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-sm text-white/60">Software developer</div>
                </div>
              </div>

              <p className="mt-4 text-sm text-white/75 leading-relaxed">{m.bio}</p>

              <div className="mt-5">
                <SocialLinks githubUrl={m.link} linkedinUrl={m.link} />
              </div>
            </article>
          ))} */}

                </div>
            </section>
        </div>
    )
}
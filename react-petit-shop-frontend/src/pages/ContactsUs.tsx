import { Link } from "react-router-dom";

export const ContactsUs = () => {
  const openWhatsApp = () => {
    const phoneNumber = "00000000000"; // <-- your WhatsApp number (no +)
    const message = "Hello, I contacted you from your website";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };
  const supportPhone = "+10000000000"; // replace with your real number (include country code)
  const supportEmail = "support@petitshop.example";

  const openCall = () => {
    // Use tel: to initiate a call on supported devices
    try {
      console.log('openCall ->', supportPhone);
      // prefer opening in same tab to trigger native phone handler
      window.location.href = `tel:${supportPhone}`;
    } catch (e) {
      console.error('openCall failed', e);
    }
  };

  const openEmail = () => {
    const subject = encodeURIComponent("Support Request - Petit Shop");
    const body = encodeURIComponent("Hello,%0A%0AI need help with my account and would like support.%0A%0AThanks,");
    try {
      console.log('openEmail ->', supportEmail);
      window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
    } catch (e) {
      console.error('openEmail failed', e);
    }
  };
  return (
    <div className="space-y-10 p-4 md:p-8 lg:p-12">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10 backdrop-blur">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-700 dark:text-white/70">
              Contact & Support
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Get in touch
            </h1>

            <p className="max-w-2xl text-gray-700 dark:text-white/75 leading-relaxed">
              Need help? We're here to support buyers and sellers. Choose your
              preferred contact method below or send us a message using the form.
            </p>

            <Link
              to="/"
              className="inline-block rounded-xl px-4 py-2 text-sm bg-gradient-to-r from-indigo-500/50 to-cyan-500/40 hover:from-indigo-500/60 hover:to-cyan-500/50 ring-1 ring-white/10 transition"
            >
              Back to Dashboard
            </Link>
          </div>

          {/* ================= CONTACT CARDS ================= */}
          <div className="flex flex-col gap-3">
            {/* WhatsApp */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 18"
                  >
                    <path d="M18 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3.546l3.2 3.659a1 1 0 0 0 1.506 0L13.454 14H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Live chat</h3>
                  <p className="text-sm text-gray-600 dark:text-white/70">
                    Quick answers via WhatsApp
                  </p>
                </div>
              </div>
              <button
                onClick={openWhatsApp}
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Contact
              </button>
            </div>

            {/* Call */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 8h11m0 0-4-4m4 4-4 4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Call us</h3>
                  <p className="text-sm text-gray-600 dark:text-white/70">
                    Request a callback
                  </p>
                </div>
              </div>
              <button
                onClick={openCall}
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Call
              </button>
            </div>

            {/* Email */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  @
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Email us</h3>
                  <p className="text-sm text-gray-600 dark:text-white/70">
                    Send detailed message
                  </p>
                </div>
              </div>
              <button
                onClick={openEmail}
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Email
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10 backdrop-blur">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          className="relative left-1/2 -z-10 aspect-1155/678 w-144.5 max-w-none -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-40rem)] sm:w-288.75"
        />
      </div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Text Us</h2>
          <p className="mt-2 text-lg/8 text-gray-600 dark:text-white/60">Write us the message you want to send</p>
        </div>
        <form action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label htmlFor="first-name" className="block text-sm/6 font-semibold text-gray-700 dark:text-white">
              First name
            </label>
            <div className="mt-2.5">
              <input
                id="first-name"
                name="first-name"
                type="text"
                autoComplete="given-name"
                className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="last-name" className="block text-sm/6 font-semibold text-gray-700 dark:text-white">
              Last name
            </label>
            <div className="mt-2.5">
              <input
                id="last-name"
                name="last-name"
                type="text"
                autoComplete="family-name"
                className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="company" className="block text-sm/6 font-semibold text-gray-700 dark:text-white">
              Company
            </label>
            <div className="mt-2.5">
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-700 dark:text-white">
              Email
            </label>
            <div className="mt-2.5">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="phone-number" className="block text-sm/6 font-semibold text-gray-700 dark:text-white">
              Phone number
            </label>
            <div className="mt-2.5">
              <div className="flex rounded-md bg-white/5 outline-1 -outline-offset-1 outline-white/10 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-500">
                <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                  <select
                    id="country"
                    name="country"
                    autoComplete="country"
                    aria-label="Country"
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-transparent py-2 pr-7 pl-3.5 text-base text-gray-400 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                  >
                    <option>US</option>
                    <option>CA</option>
                    <option>EU</option>
                  </select>
                  
                </div>
                  <input
                  id="phone-number"
                  name="phone-number"
                  type="text"
                  placeholder="123-456-7890"
                  className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
                />
              </div>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="block text-sm/6 font-semibold text-gray-700 dark:text-white">
              Message
            </label>
            <div className="mt-2.5">
              <textarea
                id="message"
                name="message"
                rows={4}
                className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                defaultValue={''}
              />
            </div>
          </div>
          <div className="flex gap-x-4 sm:col-span-2">
            <div className="flex h-6 items-center">
              <div className="group relative inline-flex w-8 shrink-0 rounded-full bg-white/5 p-px inset-ring inset-ring-white/10 outline-offset-2 outline-indigo-500 transition-colors duration-200 ease-in-out has-checked:bg-indigo-500 has-focus-visible:outline-2">
                <span className="size-4 rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out group-has-checked:translate-x-3.5" />
                <input
                  id="agree-to-policies"
                  name="agree-to-policies"
                  type="checkbox"
                  aria-label="Agree to policies"
                  className="absolute inset-0 size-full appearance-none focus:outline-hidden"
                />
              </div>
            </div>
            <label htmlFor="agree-to-policies" className="text-sm/6 text-gray-400">
              By selecting this, you agree to our{' '}
              <a href="#" className="font-semibold whitespace-nowrap text-indigo-400">
                privacy policy
              </a>
              .
            </label>
          </div>
        </div>
          <div className="mt-6">
            <label className="block mb-2.5 text-sm font-medium text-gray-900 dark:text-white/90">Upload file</label>
            <input className="cursor-pointer bg-white/5 border border-white/10 text-gray-900 dark:text-white text-sm rounded-base focus:ring-brand focus:border-brand block w-full shadow-xs placeholder:text-body" aria-describedby="file_input_help" id="file_input" type="file"></input>
            <p className="mt-1 text-sm text-gray-600 dark:text-white/60" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
          </div>

          <div className="mt-10">
            <button
              type="submit"
              className="block w-full rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Let's talk
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
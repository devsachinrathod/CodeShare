import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4.5rem)] text-stone-950">

      {/* Main */}
      <main className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden px-4 py-16 sm:px-6">
        {/* Background decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute left-1/2 top-[-12rem] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-stone-200/50 blur-3xl" />
          <div className="absolute bottom-[-10rem] left-1/2 h-[20rem] w-[30rem] -translate-x-1/2 rounded-full bg-stone-100 blur-3xl" />
        </div>

        <div className="w-full max-w-2xl text-center">
          {/* Logo mark */}
          <div className="animate-fade-up mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-stone-200 bg-white shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-7 w-7 text-stone-900"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9 7-5 5 5 5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m15 7 5 5-5 5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14 4-4 16"
              />
            </svg>
          </div>

          {/* Hero */}
          <h1 className="animate-fade-up text-[clamp(2.75rem,8vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-stone-950">
            Share code.
            <br />
            <span className="text-stone-400">Simply.</span>
          </h1>

          <p className="animate-fade-up-delay mx-auto mt-6 max-w-lg text-lg leading-relaxed text-stone-600 sm:text-xl">
            Share code securely without accounts, passwords, or complicated
            setup.
          </p>

          <p className="animate-fade-up-delay mx-auto mt-3 max-w-md text-sm leading-6 text-stone-500 sm:text-base">
            Send a temporary code using a secure, single-use OTP.
          </p>

          {/* Main actions */}
          <div className="animate-fade-up-delay-2 mx-auto mt-10 grid w-full max-w-lg gap-3 sm:grid-cols-2">
            <Link
              href="/send"
              className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-xl bg-stone-950 px-6 text-base font-medium text-white shadow-lg shadow-stone-950/10 transition-all hover:-translate-y-0.5 hover:bg-stone-800 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M22 2 11 13"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m22 2-7 20-4-9-9-4 20-7Z"
                />
              </svg>

              Send Code

              <span className="text-white/40 transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Link
              href="/receive"
              className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-xl border border-stone-200 bg-white px-6 text-base font-medium text-stone-900 shadow-sm transition-all hover:-translate-y-0.5 hover:border-stone-300 hover:bg-stone-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5 text-stone-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v12m0 0 4-4m-4 4-4-4"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 18.5v1A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-1"
                />
              </svg>

              Receive Code
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="animate-fade-up-delay-2 mx-auto mt-12 flex max-w-lg flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-stone-500 sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              No account required
            </div>

            <span className="hidden h-3 w-px bg-stone-200 sm:block" />

            <div className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-3.5 w-3.5 text-stone-400"
              >
                <rect x="5" y="10" width="14" height="10" rx="2" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10V7a4 4 0 0 1 8 0v3"
                />
              </svg>
              Secure & temporary
            </div>

            <span className="hidden h-3 w-px bg-stone-200 sm:block" />

            <div className="flex items-center gap-2">
              <span className="font-mono text-stone-400">01×</span>
              Single-use
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

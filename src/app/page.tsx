export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Don&apos;t know how to monetize your land?
      </h1>
      <p className="text-gray-600">
        Register your plot, get an instant recommendation on the best way to
        monetize it — sale, lease, or joint development — and get listed to
        real buyers and lessees.
      </p>
      <a
        href="/login"
        className="inline-block bg-brand hover:bg-brand-dark text-white px-5 py-3 rounded-lg font-medium"
      >
        Get Started
      </a>
    </div>
  );
}

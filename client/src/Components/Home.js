function HomeContent() {
  return (
    <div className="container mx-auto bg-white dark:bg-slate-900">
      <div className="flex flex-col md:flex-row md:items-center justify-around">
        <div className="w-full md:w-1/2 p-6">
          <h1 className="text-3xl md:text-4xl lg:8xl font-semibold tracking-wide mb-2">
            <span className="text-red-700 dark:text-red-700">Study</span> by
            yourself or with your friends
          </h1>
        </div>
        <div className="w-full md:w-1/2 p-6">
          <img
            src="./img/people-studying-together.avif"
            alt="People studying together"
            className="aspect-auto rounded"
          />
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row md:items-center justify-around">
        <div className="w-full md:w-1/2 p-6 aspect-auto">
          <img
            src="./img/kid-studying-alone.avif"
            alt="A kid studying alone"
            className="aspect-auto rounded"
          />
        </div>

        <div className="w-full md:w-1/2 p-6">
          <h1 className="text-3xl md:text-4xl lg:8xl font-semibold tracking-wide mb-2">
            Compare your{" "}
            <span className="text-red-700 dark:text-red-700">study</span> times
          </h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-around">
        <div className="w-full md:w-1/2 p-6">
          <h1 className="text-3xl md:text-4xl lg:8xl font-semibold tracking-wide mb-2">
            Gain success as you{" "}
            <span className="text-red-700 dark:text-red-700">study</span>
          </h1>
        </div>
        <div className="w-full md:w-1/2 p-6 aspect-auto">
          <img
            src="./img/people-enjoying.avif"
            alt="People enjoying while studying"
            className="aspect-auto rounded"
          />
        </div>
      </div>
    </div>
  );
}

export default HomeContent;

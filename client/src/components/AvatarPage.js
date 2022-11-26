function AvatarPage() {
  return (
    <div className="container mx-auto h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="font-semibold font-sans text-xl md:text-2xl lg:text-3xl xl:text-4xl text-center p-6">
        CHOOSE YOUR AVATAR
      </h1>

      <div className="w-full columns-2 text-center md:columns-4">
        <button className="bg-yellow-avatar rounded-full m-2 p-4">
          <img className="w-full aspect-squre" src="./img/icons8-bear-96.png" />
        </button>
        <button className="bg-yellow-avatar rounded-full m-2 p-4">
          <img
            className="aspect-square w-full"
            src="./img/icons8-beaver-96.png"
          />
        </button>
        <button className="bg-yellow-avatar rounded-full m-2 p-4">
          <img className="aspect-square w-full" src="./img/icons8-fox-96.png" />
        </button>
        <button className="bg-yellow-avatar rounded-full m-2 p-4">
          <img
            className="aspect-square w-full"
            src="./img/icons8-deer-96.png"
          />
        </button>
        <button className="bg-yellow-avatar rounded-full m-2 p-4">
          <img
            className="aspect-square w-full"
            src="./img/icons8-machaon-butterfly-96.png"
          />
        </button>
        <button className="bg-yellow-avatar rounded-full m-2 p-4">
          <img
            className="aspect-square w-full"
            src="./img/icons8-hedgehog-96.png"
          />
        </button>
        <button className="bg-yellow-avatar rounded-full m-2 p-4">
          <img
            className="aspect-square w-full"
            src="./img/icons8-squirrel-96.png"
          />
        </button>
        <button className="bg-yellow-avatar rounded-full m-2 p-4">
          <img className="aspect-square w-full" src="./img/icons8-bee-96.png" />
        </button>
      </div>
    </div>
  );
}

export default AvatarPage;

import circle from '../../assets/photos/icons/circle.png';

const Medias = ({ medias = [] }) => {
  console.log('Medias received:', medias);
  return (
    <section className="relative bg-white mt-12 md:mt-16">
      <div className="relative z-10">
        <div className="flex items-center mb-8 px-4 sm:px-6 lg:px-26">
          <img src={circle} alt="circle icon" className="w-8 h-8 mr-2" />
          <h2 className="text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] text-[#000000] uppercase " style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>
            Médias
          </h2>
        </div>
        <div className="flex w-full h-[32rem]">
          <div className="flex flex-col w-1/2 h-full">
            {medias[0] ? (
              <img src={medias[0].image || '/placeholder-artwork.jpg'} alt={medias[0].titre} className="w-full h-1/2 object-cover" />
            ) : (
              <div className="w-full h-1/2 flex items-center justify-center bg-[#9E9E9E]">
                <span className="text-white text-3xl">Aucun média</span>
              </div>
            )}
            {medias[1] ? (
              <img src={medias[1].image || '/placeholder-artwork.jpg'} alt={medias[1].titre} className="w-full h-1/2 object-cover" />
            ) : (
              <div className="w-full h-1/2 flex items-center justify-center bg-[#BDBDBD]">
                <span className="text-white text-3xl">Aucun média</span>
              </div>
            )}
          </div>
          <div className="w-1/2 h-full">
            {medias[2] ? (
              <img src={medias[2].image || '/placeholder-artwork.jpg'} alt={medias[2].titre} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#D9D9D9]">
                <span className="text-[#606060] text-3xl">Aucun média</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Medias;

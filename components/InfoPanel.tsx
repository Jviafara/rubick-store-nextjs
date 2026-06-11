const InfoPanel = () => {
  return (
    <div className='w-full lg:px-32 py-12 flex flex-col md:flex-row gap-8 lg:justify-center mt-4  md:mt-8 lg:mt-16 bg-gray-200  bg-opacity-50 text-center'>
      <div className='w-full lg:w-1/3 px-8'>
        <h1 className='font-bold text-2xl'>Free Delivery</h1>
        <p>Free delivery for all oders over $100.</p>
      </div>
      <div className='w-full lg:w-1/3 px-8'>
        <h1 className='font-bold text-2xl'>30 Days Return</h1>
        <p>30 day guaranty for defectives or damaged products.</p>
      </div>
      <div className='w-full lg:w-1/3 px-8'>
        <h1 className='font-bold text-2xl'>Secure Payment</h1>
        <p>100% secure and relayable payment with quick refound if necessary.</p>
      </div>
    </div>
  )
}

export default InfoPanel

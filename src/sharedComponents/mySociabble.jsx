import ccLogo from '../assets/cma.png'


export function MySociabble() {
  return (
    <header className='w-full bg-ccblue shadow-lg border-b-2 border-blue-700 -mt-2'>
      <div className='container mx-auto py-8 px-6 text-center'>
        <div className='flex items-center justify-center space-x-6'>
          <img
            src={ccLogo}
            alt='CMA CGM Logo'
            className='h-12 md:h-16 lg:h-20 filter brightness-0 invert transition-transform duration-300 hover:scale-105'
          />
          <p className='font-ssp text-white text-sm md:text-lg lg:text-xl font-bold tracking-wide max-w-4xl leading-tight'>
            WE IMAGINE BETTER WAYS TO SERVE A WORLD IN MOTION
          </p>
        </div>
      </div>
    </header>
  )
}

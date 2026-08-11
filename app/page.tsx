import Container from '@/components/Container'
import InfoPanel from '@/components/InfoPanel'
import ProductSlide from '@/components/ProductSlide'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
}

export default function Home() {
  return (
    <div className='flex flex-col items-center relative '>
      <Container
        header={'new products'}
        seeMore={'/products'}
      >
        <ProductSlide slideType='latest' />
      </Container>
      <InfoPanel />
      <Container
        header={'Top Rated'}
        seeMore={'/products'}
      >
        <ProductSlide slideType='top_rated' />
      </Container>
    </div>
  )
}

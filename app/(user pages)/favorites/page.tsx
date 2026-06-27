import Container from '@/components/Container'
import FavoritesGrid from '@/components/FavoritesGrid'

const Favorites = () => {
  return (
    <div className='w-full flex flex-col items-center'>
      <Container header={'favorites'}>
        <FavoritesGrid />
      </Container>
    </div>
  )
}

export default Favorites

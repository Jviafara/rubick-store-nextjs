import Container from '@/components/Container'
import TutorialSlide from '@/components/TutorialSlide'

const TutorialsPage = () => {
  return (
    <main className='w-full mx-auto flex items-center justify-center'>
      <Container header={'tutorials'}>
        <TutorialSlide />
      </Container>
    </main>
  )
}

export default TutorialsPage

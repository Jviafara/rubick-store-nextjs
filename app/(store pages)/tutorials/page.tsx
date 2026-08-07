import Container from '@/components/Container'
import TutorialSlide from '@/components/TutorialSlide'

const TutorialsPage = () => {
  return (
    <main className='w-full  mx-auto py-12 flex items-center justify-center overflow-visible'>
      <Container header={'tutorials'}>
        <TutorialSlide />
      </Container>
    </main>
  )
}

export default TutorialsPage

import Container from '@/components/Container'
import TutorialSlide from '@/components/TutorialSlide'

const TutorialsPage = () => {
  return (
    <main className='w-full max-h-[calc(100vh-76px)] mx-auto flex items-center justify-center overflow-visible'>
      <Container header={'tutorials'}>
        <TutorialSlide />
      </Container>
    </main>
  )
}

export default TutorialsPage

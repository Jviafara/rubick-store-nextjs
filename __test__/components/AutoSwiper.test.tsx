import AutoSwiper from '@/components/AutoSwiper'
import { render, screen } from '@testing-library/react'

const mockSwiperProps = jest.fn()

jest.mock('swiper/react', () => ({
  Swiper: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => {
    mockSwiperProps(props)
    return <div data-testid='swiper'>{children}</div>
  },
}))

jest.mock('swiper/modules', () => ({
  Pagination: 'PaginationModule',
}))

describe('AutoSwiper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSwiperProps.mockClear()
  })

  it('should render AutoSwiper', () => {
    render(
      <AutoSwiper slideNumber={2}>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </AutoSwiper>,
    )
    expect(screen.getByTestId('swiper')).toBeInTheDocument()
    expect(screen.getByText('Slide 1')).toBeInTheDocument()
    expect(screen.getByText('Slide 2')).toBeInTheDocument()
  })

  it('disables loop when slideNumber is less than 4', () => {
    render(
      <AutoSwiper slideNumber={3}>
        <div>Slide 1</div>
      </AutoSwiper>,
    )

    expect(mockSwiperProps).toHaveBeenCalledWith(expect.objectContaining({ loop: false }))
  })
  it('disables loop when slideNumber is undefined (defaults to 1)', () => {
    render(
      <AutoSwiper>
        <div>Slide 1</div>
      </AutoSwiper>,
    )

    expect(mockSwiperProps).toHaveBeenCalledWith(expect.objectContaining({ loop: false }))
  })

  it('enables loop when slideNumber is 4 or greater', () => {
    render(
      <AutoSwiper slideNumber={4}>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
        <div>Slide 4</div>
      </AutoSwiper>,
    )

    expect(mockSwiperProps).toHaveBeenCalledWith(expect.objectContaining({ loop: true }))
  })

  it('passes Pagination module, dynamicBullets config, and responsive breakpoints', () => {
    render(
      <AutoSwiper slideNumber={5}>
        <div>Slide 1</div>
      </AutoSwiper>,
    )

    const passedProps = mockSwiperProps.mock.calls[0][0]

    expect(passedProps.modules).toEqual(['PaginationModule'])
    expect(passedProps.pagination).toEqual({ dynamicBullets: true })
    expect(passedProps.breakpoints).toEqual({
      375: { slidesPerView: 1, spaceBetween: 15 },
      425: { slidesPerView: 1.5, spaceBetween: 25 },
      768: { slidesPerView: 2.5, spaceBetween: 15 },
      1024: { slidesPerView: 3, spaceBetween: 30 },
      1280: { slidesPerView: 4, spaceBetween: 35 },
      1536: { slidesPerView: 5, spaceBetween: 50 },
    })
  })
})

import { centerAnimations, colorClasses, leftAnimations, ModalPositions, rightAnimations } from '@/lib/constants'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux.hooks'
import { toogleModalService } from '@/lib/redux/features/modalSlice'
import { ModalContentProps } from '@/lib/types'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import Logo from './Logo'
import { useEffect, useState } from 'react'
import { useScrollLock } from '@/lib/hooks/useScrollLock'

const Modal = () => {
  const dispatch = useAppDispatch()
  const { config } = useAppSelector(state => state.modalService)

  const {
    modalOpen,
    position = ModalPositions.Center,
    header,
    subTitle,
    icon: Icon,
    logo,
    children,
    closeButton,
    confirmButton,
    cancelButton,
  } = config

  const confirmClasses = colorClasses[(confirmButton?.color || 'primary') as keyof typeof colorClasses]

  const cancelClasses = colorClasses[(cancelButton?.color || 'secondary') as keyof typeof colorClasses]

  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeModal = () => {
    dispatch(toogleModalService(false))
  }

  const getAnimation = () => {
    switch (position) {
      case ModalPositions.Left:
        return leftAnimations

      case ModalPositions.Right:
        return rightAnimations

      case ModalPositions.Center:
      default:
        return centerAnimations
    }
  }

  const animations = getAnimation()

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          key='modal-overlay'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ marginTop: scrollY }}
          className='absolute top-0 left-0 z-50 max-h-screen h-full w-full max-w-screen overflow-clip bg-muted/30 backdrop-blur-sm'
          onClick={closeModal}
        >
          {/* CENTER */}
          {position === ModalPositions.Center && (
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2  -translate-y-1/2  w-fit max-w-[90vw] h-fit`}>
              <ModalContent
                animations={animations}
                header={header}
                subTitle={subTitle}
                Icon={Icon}
                logo={logo}
                subChildren={children}
                closeButton={closeButton}
                confirmButton={confirmButton}
                cancelButton={cancelButton}
                confirmClasses={confirmClasses}
                cancelClasses={cancelClasses}
                onClose={closeModal}
              />
            </div>
          )}

          {/* LEFT */}
          {position === ModalPositions.Left && (
            <div className='absolute inset-y-0 left-0 flex items-center w-full h-full'>
              <ModalContent
                animations={animations}
                header={header}
                subTitle={subTitle}
                Icon={Icon}
                logo={logo}
                subChildren={children}
                closeButton={closeButton}
                confirmButton={confirmButton}
                cancelButton={cancelButton}
                confirmClasses={confirmClasses}
                cancelClasses={cancelClasses}
                onClose={closeModal}
              />
            </div>
          )}

          {/* RIGHT */}
          {position === ModalPositions.Right && (
            <div className='absolute inset-y-0 right-0 flex items-center w-fit h-full'>
              <ModalContent
                animations={animations}
                header={header}
                subTitle={subTitle}
                Icon={Icon}
                logo={logo}
                subChildren={children}
                closeButton={closeButton}
                confirmButton={confirmButton}
                cancelButton={cancelButton}
                confirmClasses={confirmClasses}
                cancelClasses={cancelClasses}
                onClose={closeModal}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const ModalContent = ({
  animations,
  header,
  subTitle,
  Icon,
  logo,
  subChildren,
  closeButton,
  confirmButton,
  cancelButton,
  confirmClasses,
  cancelClasses,
  onClose,
}: ModalContentProps) => {
  useScrollLock(true)
  return (
    <motion.div
      initial={animations.initial}
      animate={animations.animate}
      exit={animations.exit}
      transition={{ duration: 0.5 }}
      onClick={event => event.stopPropagation()}
      className='card-gradient-cyan-magenta flex h-full w-[90vw] md:w-fit md:max-w-[50vw] flex-col items-center gap-8 overflow-x-clip overflow-y-auto rounded-2xl px-4 py-8'
    >
      {/* Header */}
      <section className='relative flex min-h-6 w-full items-center justify-start gap-4 has-only:justify-center'>
        {/* Icon */}
        <div className='flex justify-center'>
          {Icon && (
            <Icon
              size={48}
              className='text-accent'
            />
          )}
        </div>

        {/* Header text */}
        {(header || subTitle) && (
          <div className='grow w-full'>
            <h1 className='text-2xl uppercase text-main'>{header}</h1>
            <p className='text-muted'>{subTitle}</p>
          </div>
        )}

        {/* Logo */}
        {logo && (
          <Link
            href={'/'}
            onClick={onClose}
            className='absolute left-0 top-0  text-main transition-colors hover:text-secondary'
          >
            <Logo full={true} />
          </Link>
        )}

        {/* Close button */}
        {closeButton && (
          <button
            type='button'
            onClick={onClose}
            className='absolute right-0 top-0 text-main transition-colors hover:text-secondary'
          >
            <X size={24} />
          </button>
        )}
      </section>

      {/* Main content */}
      <section>{subChildren}</section>

      {/* Divider */}
      {(cancelButton || confirmButton) && <div className='h-0 w-full border-t border-muted' />}

      {/* Actions */}
      {(cancelButton || confirmButton) && (
        <section className='flex w-full justify-between md:w-[80%]'>
          {cancelButton && (
            <button
              type='button'
              onClick={cancelButton.action}
              className={`w-fit rounded-2xl border px-8 py-1 font-bold uppercase transition-all duration-500 hover:scale-105 ${cancelClasses.border} ${cancelClasses.hoverBg}`}
            >
              {cancelButton.label}
            </button>
          )}

          {confirmButton && (
            <button
              type='button'
              onClick={confirmButton.action}
              className={`w-fit rounded-2xl border px-8 py-1 font-bold uppercase transition-all duration-500 hover:scale-105 ${confirmClasses.bg} ${confirmClasses.hoverBg} ${confirmClasses.border}`}
            >
              {confirmButton.label}
            </button>
          )}
        </section>
      )}
    </motion.div>
  )
}

export default Modal

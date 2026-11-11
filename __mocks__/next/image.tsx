import type { ImgHTMLAttributes } from 'react'

type MockImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean
  priority?: boolean
  unoptimized?: boolean
}

// Jest picks this file up automatically for `next/image`.
// It renders a plain <img> and drops the Next-only props so React does not warn about them.
const Image = (props: MockImageProps) => {
  const { fill, priority, unoptimized, ...imgProps } = props
  void fill
  void priority
  void unoptimized

  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...imgProps} />
}

export default Image

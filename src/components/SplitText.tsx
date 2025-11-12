
interface SplitTextProps {
  text: string
  className?: string
}

export default function SplitText({
  text,
  className = ''
}: SplitTextProps) {
  return (
    <span className={className}>
      {text}
    </span>
  )
}


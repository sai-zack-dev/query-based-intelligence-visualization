import * as React from "react"

export function useForwardedRef<T>(ref: React.ForwardedRef<T>) {
  const innerRef = React.useRef<T>(null)

  React.useEffect(() => {
    if (!ref) return

    if (typeof ref === "function") {
      ref(innerRef.current)
    } else {
      // @ts-ignore
      ref.current = innerRef.current
    }
  }, [ref])

  return innerRef
}

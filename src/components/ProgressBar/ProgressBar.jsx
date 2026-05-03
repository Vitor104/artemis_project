import { forwardRef } from 'react'
import './ProgressBar.css'

const ProgressBar = forwardRef(function ProgressBar(_, ref) {
  return (
    <div className="progress-bar" aria-hidden="true">
      <div ref={ref} className="progress-bar__fill" />
    </div>
  )
})

export default ProgressBar

import React from 'react'

import './styles.css'

interface ToastMessageProps {
  isEnabled: boolean
  type: string
  title: string
  description: string
}

const ToastMessage: React.FC<ToastMessageProps> = ({
  isEnabled,
  type,
  title,
  description
}) => {
  if (isEnabled) {
    return (
      <div className={`toast ${type}`}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    )
  } else {
    return <div className="disabled"></div>
  }
}

export default ToastMessage

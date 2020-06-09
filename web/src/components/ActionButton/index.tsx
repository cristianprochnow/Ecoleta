import React from 'react'

import './styles.css'

interface ActionButtonProps {
  buttonPlaceholder: string
}

const ActionButton: React.FC<ActionButtonProps> = ({ buttonPlaceholder }) => {
  return (
    <button type="submit">{buttonPlaceholder}</button>
  )
}

export default ActionButton

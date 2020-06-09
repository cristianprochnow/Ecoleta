import React, { ChangeEvent } from 'react'

import './styles.css'

interface InputTextProps {
  containerClass: string
  labelWord: string
  htmlPropsName: string
  typingExample: string
  inputValue: string
  onHandleChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const InputText: React.FC<InputTextProps> = ({
  containerClass = "field",
  labelWord = "",
  htmlPropsName = "input",
  typingExample = null,
  inputValue,
  onHandleChange
}) => {
  return (
    <div className={containerClass}>
      <label htmlFor={htmlPropsName}>{labelWord}</label>

      <input
        type="text"
        name={htmlPropsName}
        id={htmlPropsName}
        value={inputValue}
        onChange={onHandleChange}
      />

      {typingExample
        ? <p>{typingExample}</p>
        : undefined}
    </div>
  )
}

export default InputText

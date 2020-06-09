import React, { ChangeEvent } from 'react'

import './styles.css'

interface SelectBoxProps {
  labelWord: string
  htmlPropsName: string
  description: string
  selectValue: string
  optionsData: string[]
  onHandleSelect: (event: ChangeEvent<HTMLSelectElement>) => void
}

const SelectBox: React.FC<SelectBoxProps> = ({
  labelWord,
  htmlPropsName = "select",
  description = "Selecione uma opção",
  selectValue,
  optionsData = [],
  onHandleSelect
}) => {
  return (
    <div className="field">
      <label htmlFor={htmlPropsName}>{labelWord}</label>

      <select
        name={htmlPropsName}
        id={htmlPropsName}
        value={selectValue}
        onChange={onHandleSelect}
      >
        <option value="0">{description}</option>
        {optionsData.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  )
}

export default SelectBox
